import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FARE_CONSTANTS } from '../../common/constants/fare.constants';

export interface CorridorMatch {
  rideId: string;
  driverId: string;
  driverName: string;
  routeOverlapKm: number;
  pickupDetourKm: number;
  dropDetourKm: number;
  score: number;
}

@Injectable()
export class CorridorService {
  private readonly logger = new Logger(CorridorService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find rides whose routes overlap with the user's desired corridor.
   * Uses simplified distance-based matching (PostGIS would be better).
   */
  async findCorridorMatches(
    pickupLat: number,
    pickupLng: number,
    dropLat: number,
    dropLng: number,
  ): Promise<CorridorMatch[]> {
    // Get all active recurring rides
    const rides = await this.prisma.recurringRide.findMany({
      where: { status: 'ACTIVE' },
      include: {
        driver: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
      },
    });

    const matches: CorridorMatch[] = [];

    for (const ride of rides) {
      const schedule = ride.schedule as Record<string, unknown>;
      const ridePickup = schedule.pickup as
        { lat: number; lng: number } | undefined;
      const rideDrop = schedule.drop as
        { lat: number; lng: number } | undefined;

      if (!ridePickup || !rideDrop) continue;

      // Calculate route overlap
      const overlap = this.calculateRouteOverlap(
        pickupLat,
        pickupLng,
        dropLat,
        dropLng,
        ridePickup.lat,
        ridePickup.lng,
        rideDrop.lat,
        rideDrop.lng,
      );

      if (overlap.routeOverlapKm > 0) {
        // Score: more overlap + less detour = better
        const overlapScore =
          (overlap.routeOverlapKm / overlap.totalDistanceKm) * 50;
        const detourScore = Math.max(
          0,
          50 - (overlap.pickupDetourKm + overlap.dropDetourKm) * 5,
        );

        matches.push({
          rideId: ride.id,
          driverId: ride.driverId,
          driverName: ride.driver.user.name,
          routeOverlapKm: Math.round(overlap.routeOverlapKm * 100) / 100,
          pickupDetourKm: Math.round(overlap.pickupDetourKm * 100) / 100,
          dropDetourKm: Math.round(overlap.dropDetourKm * 100) / 100,
          score: Math.round(overlapScore + detourScore),
        });
      }
    }

    matches.sort((a, b) => b.score - a.score);

    return matches;
  }

  /**
   * Calculate route overlap between two corridors.
   * Simplified: checks if endpoints are within detour threshold.
   */
  private calculateRouteOverlap(
    pLat: number,
    pLng: number,
    dLat: number,
    dLng: number,
    rPLat: number,
    rPLng: number,
    rDLat: number,
    rDLng: number,
  ) {
    const userDist = this.haversineKm(pLat, pLng, dLat, dLng);
    const rideDist = this.haversineKm(rPLat, rPLng, rDLat, rDLng);

    const pickupDetour = this.haversineKm(pLat, pLng, rPLat, rPLng);
    const dropDetour = this.haversineKm(dLat, dLng, rDLat, rDLng);

    // Overlap: if both detours are within max allowed
    const maxDetour = FARE_CONSTANTS.MAX_ROUTE_DETOUR_KM;
    let routeOverlapKm = 0;

    if (pickupDetour <= maxDetour && dropDetour <= maxDetour) {
      // Both endpoints are within detour threshold — full route overlap
      routeOverlapKm = Math.min(userDist, rideDist);
    } else if (pickupDetour <= maxDetour || dropDetour <= maxDetour) {
      // Partial overlap — one endpoint matches
      routeOverlapKm = Math.min(userDist, rideDist) * 0.5;
    }

    return {
      routeOverlapKm,
      totalDistanceKm: Math.max(userDist, rideDist),
      pickupDetourKm: pickupDetour,
      dropDetourKm: dropDetour,
    };
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
