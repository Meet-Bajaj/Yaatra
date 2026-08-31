import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FARE_CONSTANTS } from '../../common/constants/fare.constants';
import Redis from 'ioredis';

export interface MatchResult {
  driverId: string;
  driverName: string;
  driverRating: number;
  vehicleId: string;
  vehicleMake: string;
  vehicleModel: string;
  lat: number;
  lng: number;
  distanceToPickupKm: number;
  score: number;
}

@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);
  private redis: Redis | null = null;

  constructor(private readonly prisma: PrismaService) {
    try {
      this.redis = new Redis(
        process.env.REDIS_URL || 'redis://localhost:6379',
        {
          maxRetriesPerRequest: 3,
          retryStrategy(times: number) {
            if (times > 3) return null;
            return Math.min(times * 200, 1000);
          },
        },
      );
      this.redis.on('error', (err: Error) => {
        this.logger.warn(`Redis unavailable for matching: ${err.message}`);
        this.redis = null;
      });
    } catch {
      this.logger.warn('Redis not available — matching will use DB only');
    }
  }

  /**
   * Find nearby online drivers for an on-demand trip.
   * Uses Redis pool for speed, falls back to DB.
   */
  async findNearbyDrivers(
    pickupLat: number,
    pickupLng: number,
    options?: {
      womenOnly?: boolean;
      maxResults?: number;
      excludeDriverIds?: string[];
    },
  ): Promise<MatchResult[]> {
    const maxResults = options?.maxResults || 5;
    const excludeIds = new Set(options?.excludeDriverIds || []);

    // Try Redis pool first
    if (this.redis) {
      try {
        const zones = await this.redis.keys('driver:*');
        const zoneNames = zones
          .map((z) => z.replace('driver:', ''))
          .filter((z) => !z.includes(':online:'));

        const allDrivers: MatchResult[] = [];

        for (const zone of zoneNames) {
          const members = await this.redis.smembers(`driver:${zone}`);
          for (const member of members) {
            try {
              const driver = JSON.parse(member) as {
                driverId: string;
                lat: number;
                lng: number;
                vehicleId?: string;
              };

              if (excludeIds.has(driver.driverId)) continue;

              const distKm = this.haversineKm(
                pickupLat,
                pickupLng,
                driver.lat,
                driver.lng,
              );

              if (distKm <= FARE_CONSTANTS.MATCH_RADIUS_KM) {
                allDrivers.push({
                  driverId: driver.driverId,
                  driverName: '',
                  driverRating: 0,
                  vehicleId: driver.vehicleId || '',
                  vehicleMake: '',
                  vehicleModel: '',
                  lat: driver.lat,
                  lng: driver.lng,
                  distanceToPickupKm: distKm,
                  score: 0,
                });
              }
            } catch {
              // skip malformed entries
            }
          }
        }

        if (allDrivers.length > 0) {
          // Enrich with DB data
          return this.enrichAndScore(
            allDrivers,
            pickupLat,
            pickupLng,
            maxResults,
            options?.womenOnly,
          );
        }
      } catch (err) {
        const error = err as Error;
        this.logger.warn(
          `Redis matching failed, falling back to DB: ${error.message}`,
        );
      }
    }

    // Fallback: query DB
    return this.findFromDb(
      pickupLat,
      pickupLng,
      maxResults,
      options?.womenOnly,
      excludeIds,
    );
  }

  /**
   * Find matching carpool offers for a scheduled ride.
   */
  async findCarpoolMatches(
    pickupLat: number,
    pickupLng: number,
    dropLat: number,
    dropLng: number,
    date?: string,
  ) {
    const offers = await this.prisma.recurringRide.findMany({
      where: { status: 'ACTIVE' },
      include: {
        driver: {
          include: {
            user: { select: { id: true, name: true, gender: true } },
          },
        },
        vehicle: {
          select: { make: true, model: true, color: true, capacity: true },
        },
        instances: {
          where: { status: 'SCHEDULED' },
          ...(date
            ? { where: { date: new Date(date), status: 'SCHEDULED' } }
            : {}),
          orderBy: { date: 'asc' },
        },
      },
    });

    const matches: Array<Record<string, unknown>> = [];

    for (const offer of offers) {
      const schedule = offer.schedule as Record<string, unknown>;
      const offerPickup = schedule.pickup as
        { lat: number; lng: number } | undefined;
      const offerDrop = schedule.drop as
        { lat: number; lng: number } | undefined;

      if (!offerPickup || !offerDrop) continue;

      const pickupDist = this.haversineKm(
        pickupLat,
        pickupLng,
        offerPickup.lat,
        offerPickup.lng,
      );
      const dropDist = this.haversineKm(
        dropLat,
        dropLng,
        offerDrop.lat,
        offerDrop.lng,
      );

      if (
        pickupDist <= FARE_CONSTANTS.SCHEDULED_MATCH_RADIUS_KM &&
        dropDist <= FARE_CONSTANTS.SCHEDULED_MATCH_RADIUS_KM
      ) {
        for (const instance of offer.instances) {
          const bookedSeats = await this.prisma.booking.aggregate({
            where: {
              instanceId: instance.id,
              bookingStatus: { in: ['PENDING', 'CONFIRMED'] },
            },
            _sum: { seatCount: true },
          });

          const availableSeats =
            offer.maxPassengers - (bookedSeats._sum.seatCount || 0);

          if (availableSeats > 0) {
            // Score: lower detour = better
            const totalDetour = pickupDist + dropDist;
            const score = 100 - totalDetour * 10;

            matches.push({
              offerId: offer.id,
              instanceId: instance.id,
              driver: {
                id: offer.driver.driverId,
                name: offer.driver.user.name,
                rating: offer.driver.totalRating,
              },
              vehicle: offer.vehicle,
              schedule: {
                date: instance.date,
                departureTime: instance.departureTime,
              },
              pricePerSeat: Number(offer.pricePerSeat),
              availableSeats,
              pickupDetour: Math.round(pickupDist * 100) / 100,
              dropDetour: Math.round(dropDist * 100) / 100,
              score: Math.round(score),
            });
          }
        }
      }
    }

    // Sort by score (highest first)
    matches.sort((a, b) => (b.score as number) - (a.score as number));

    return matches;
  }

  // ─── Helpers ────────────────────────────────────────────────

  private async enrichAndScore(
    drivers: MatchResult[],
    pickupLat: number,
    pickupLng: number,
    maxResults: number,
    womenOnly?: boolean,
  ): Promise<MatchResult[]> {
    const driverIds = drivers.map((d) => d.driverId);

    const profiles = await this.prisma.driverProfile.findMany({
      where: {
        driverId: { in: driverIds },
        verificationStatus: 'PASSED',
      },
      include: {
        user: { select: { id: true, name: true, gender: true } },
        vehicles: { take: 1 },
      },
    });

    const profileMap = new Map(profiles.map((p) => [p.driverId, p]));

    const enriched = drivers
      .map((d) => {
        const profile = profileMap.get(d.driverId);
        if (!profile) return null;

        // Women-only filter
        if (womenOnly && profile.user.gender !== 'FEMALE') return null;

        // Score: proximity (40%) + rating (60%)
        const proximityScore =
          (1 - d.distanceToPickupKm / FARE_CONSTANTS.MATCH_RADIUS_KM) * 40;
        const ratingScore =
          profile.ratingCount > 0 ? (Number(profile.totalRating) / 5) * 60 : 30; // Default for new drivers

        return {
          ...d,
          driverName: profile.user.name,
          driverRating: Number(profile.totalRating),
          vehicleId: profile.vehicles[0]?.id || '',
          vehicleMake: profile.vehicles[0]?.make || '',
          vehicleModel: profile.vehicles[0]?.model || '',
          score: Math.round(proximityScore + ratingScore),
        };
      })
      .filter((d): d is MatchResult => d !== null);

    enriched.sort((a, b) => b.score - a.score);

    return enriched.slice(0, maxResults);
  }

  private async findFromDb(
    pickupLat: number,
    pickupLng: number,
    maxResults: number,
    womenOnly?: boolean,
    excludeIds?: Set<string>,
  ): Promise<MatchResult[]> {
    const onlineDrivers = await this.prisma.driverProfile.findMany({
      where: {
        isOnline: true,
        driverType: { in: ['PROFESSIONAL', 'BOTH'] },
        verificationStatus: 'PASSED',
        currentLat: { not: null },
        currentLng: { not: null },
      },
      include: {
        user: { select: { id: true, name: true, gender: true } },
        vehicles: { take: 1 },
      },
    });

    const results: MatchResult[] = [];

    for (const driver of onlineDrivers) {
      if (!driver.currentLat || !driver.currentLng) continue;
      if (excludeIds?.has(driver.driverId)) continue;
      if (womenOnly && driver.user.gender !== 'FEMALE') continue;

      const distKm = this.haversineKm(
        pickupLat,
        pickupLng,
        driver.currentLat,
        driver.currentLng,
      );

      if (distKm <= FARE_CONSTANTS.MATCH_RADIUS_KM) {
        const proximityScore =
          (1 - distKm / FARE_CONSTANTS.MATCH_RADIUS_KM) * 40;
        const ratingScore =
          driver.ratingCount > 0 ? (Number(driver.totalRating) / 5) * 60 : 30;

        results.push({
          driverId: driver.driverId,
          driverName: driver.user.name,
          driverRating: Number(driver.totalRating),
          vehicleId: driver.vehicles[0]?.id || '',
          vehicleMake: driver.vehicles[0]?.make || '',
          vehicleModel: driver.vehicles[0]?.model || '',
          lat: driver.currentLat,
          lng: driver.currentLng,
          distanceToPickupKm: Math.round(distKm * 100) / 100,
          score: Math.round(proximityScore + ratingScore),
        });
      }
    }

    results.sort((a, b) => b.score - a.score);

    return results.slice(0, maxResults);
  }

  private haversineKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
