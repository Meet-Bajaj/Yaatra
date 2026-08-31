import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { GoOnlineDto } from './dto/go-online.dto';
import { FARE_CONSTANTS } from '../../common/constants/fare.constants';
import Redis from 'ioredis';

@Injectable()
export class DriverService {
  private readonly logger = new Logger(DriverService.name);
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
        this.logger.warn(`Redis unavailable for driver pool: ${err.message}`);
        this.redis = null;
      });
    } catch {
      this.logger.warn('Redis not available — driver pool disabled');
    }
  }

  // ─── Driver Profile ─────────────────────────────────────────

  async getProfile(driverId: string) {
    const profile = await this.prisma.driverProfile.findUnique({
      where: { driverId },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            name: true,
            email: true,
            gender: true,
            avatarUrl: true,
          },
        },
        vehicles: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Driver profile not found');
    }

    return profile;
  }

  // ─── Carpool Offers ─────────────────────────────────────────

  async createOffer(driverId: string, dto: CreateOfferDto) {
    const profile = await this.ensureDriverProfile(driverId);

    if (profile.driverType === 'PROFESSIONAL') {
      throw new ForbiddenException(
        'Professional drivers cannot create carpool offers',
      );
    }

    // Verify vehicle belongs to driver
    const vehicle = await this.prisma.vehicles.findFirst({
      where: { id: dto.vehicleId, driverId: profile.driverId },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found or not owned by you');
    }

    // Use raw SQL because route is Unsupported("geography(LINESTRING,4326)")
    const routeWkt = `SRID=4326;LINESTRING(${dto.pickup.lng} ${dto.pickup.lat}, ${dto.drop.lng} ${dto.drop.lat})`;

    const scheduleData = JSON.stringify({
      pickup: dto.pickup,
      drop: dto.drop,
      slots: dto.schedule,
      notes: dto.notes,
    });

    const results = await this.prisma.$queryRawUnsafe<
      Array<{ ride_id: string }>
    >(
      `INSERT INTO recurring_rides (ride_id, driver_id, vehicle_id, route, "schedule", price_per_seat, max_passengers, women_only, status, created_at, updated_at)
       VALUES (gen_random_uuid()::text, $1, $2, ST_GeogFromText($3)::geography, $4::jsonb, $5, $6, $7, 'ACTIVE', NOW(), NOW())
       RETURNING ride_id`,
      profile.driverId,
      dto.vehicleId,
      routeWkt,
      scheduleData,
      dto.pricePerSeat,
      dto.seats,
      dto.womenOnly ?? false,
    );

    const offerId = results[0].ride_id;

    this.logger.log(
      `Offer ${offerId} created by ${driverId}: ${dto.pickup.address} → ${dto.drop.address}`,
    );

    return this.prisma.recurringRide.findUnique({
      where: { id: offerId },
      include: {
        vehicle: {
          select: {
            make: true,
            model: true,
            color: true,
            licensePlate: true,
          },
        },
        instances: true,
      },
    });
  }

  async getOffers(driverId: string) {
    const profile = await this.ensureDriverProfile(driverId);

    return this.prisma.recurringRide.findMany({
      where: { driverId: profile.driverId },
      include: {
        vehicle: {
          select: {
            make: true,
            model: true,
            color: true,
            licensePlate: true,
          },
        },
        instances: {
          orderBy: { date: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOffer(driverId: string, offerId: string, dto: UpdateOfferDto) {
    await this.ensureOfferOwner(driverId, offerId);

    const existing = await this.prisma.recurringRide.findUnique({
      where: { id: offerId },
    });

    const currentSchedule =
      (existing?.schedule as Record<string, unknown>) || {};
    const updatedSchedule = {
      ...currentSchedule,
      ...(dto.pickup && { pickup: dto.pickup }),
      ...(dto.drop && { drop: dto.drop }),
      ...(dto.schedule && { slots: dto.schedule }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
    };

    // Build update fields
    const updates: string[] = [];

    const params: any[] = [];
    let paramIdx = 1;

    if (dto.pickup && dto.drop) {
      const routeWkt = `SRID=4326;LINESTRING(${dto.pickup.lng} ${dto.pickup.lat}, ${dto.drop.lng} ${dto.drop.lat})`;
      updates.push(`route = ST_GeogFromText($${paramIdx})::geography`);
      params.push(routeWkt);
      paramIdx++;
    }

    updates.push(`"schedule" = $${paramIdx}::jsonb`);
    params.push(JSON.stringify(updatedSchedule));
    paramIdx++;

    if (dto.seats) {
      updates.push(`max_passengers = $${paramIdx}`);
      params.push(dto.seats);
      paramIdx++;
    }
    if (dto.pricePerSeat) {
      updates.push(`price_per_seat = $${paramIdx}`);
      params.push(dto.pricePerSeat);
      paramIdx++;
    }
    if (dto.womenOnly !== undefined) {
      updates.push(`women_only = $${paramIdx}`);
      params.push(dto.womenOnly);
      paramIdx++;
    }
    if (dto.status) {
      updates.push(`status = $${paramIdx}`);
      params.push(dto.status);
      paramIdx++;
    }

    updates.push(`updated_at = NOW()`);

    if (updates.length > 1) {
      /* eslint-disable @typescript-eslint/no-unsafe-argument */
      await this.prisma.$queryRawUnsafe(
        `UPDATE recurring_rides SET ${updates.join(', ')} WHERE ride_id = $${paramIdx}`,
        ...params,
        offerId,
      );
      /* eslint-enable @typescript-eslint/no-unsafe-argument */
    }

    return this.prisma.recurringRide.findUnique({
      where: { id: offerId },
      include: {
        vehicle: {
          select: {
            make: true,
            model: true,
            color: true,
            licensePlate: true,
          },
        },
      },
    });
  }

  async deleteOffer(driverId: string, offerId: string) {
    await this.ensureOfferOwner(driverId, offerId);

    // Cancel all future instances
    await this.prisma.rideInstance.updateMany({
      where: {
        rideId: offerId,
        date: { gte: new Date() },
        status: 'SCHEDULED',
      },
      data: { status: 'CANCELLED' },
    });

    await this.prisma.recurringRide.delete({ where: { id: offerId } });

    return { message: 'Offer deleted successfully' };
  }

  // ─── Carpool Requests ───────────────────────────────────────

  async getOfferRequests(driverId: string, offerId: string) {
    await this.ensureOfferOwner(driverId, offerId);

    const instances = await this.prisma.rideInstance.findMany({
      where: { rideId: offerId },
      include: {
        bookings: {
          where: { bookingStatus: { in: ['PENDING', 'CONFIRMED'] } },
          include: {
            rider: {
              select: {
                id: true,
                name: true,
                phone: true,
                gender: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { date: 'desc' },
    });

    return instances;
  }

  async acceptRequest(driverId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        instance: {
          include: { ride: { select: { driverId: true } } },
        },
      },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.instance.ride.driverId !== driverId) {
      throw new ForbiddenException('Not your offer');
    }
    if (booking.bookingStatus !== 'PENDING') {
      throw new BadRequestException('Booking is not pending');
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { bookingStatus: 'CONFIRMED' },
    });
  }

  async rejectRequest(driverId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        instance: {
          include: { ride: { select: { driverId: true } } },
        },
      },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.instance.ride.driverId !== driverId) {
      throw new ForbiddenException('Not your offer');
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { bookingStatus: 'CANCELLED' },
    });
  }

  // ─── Professional Driver — Online/Offline ────────────────────

  async goOnline(driverId: string, dto: GoOnlineDto) {
    const profile = await this.ensureDriverProfile(driverId);

    if (profile.driverType === 'CARPOOL') {
      throw new ForbiddenException(
        'Carpool drivers cannot go online — use offer a seat instead',
      );
    }

    // Update profile
    await this.prisma.driverProfile.update({
      where: { driverId },
      data: {
        isOnline: true,
        currentLat: dto.lat,
        currentLng: dto.lng,
        currentZone: dto.zone || 'default',
      },
    });

    // Add to Redis driver pool
    if (this.redis) {
      const zone = dto.zone || 'default';
      const driverData = JSON.stringify({
        driverId,
        lat: dto.lat,
        lng: dto.lng,
        zone,
        vehicleId: dto.vehicleId,
        onlineAt: new Date().toISOString(),
      });

      await this.redis.sadd(`driver:${zone}`, driverData);
      await this.redis.setex(
        `driver:online:${driverId}`,
        3600, // 1 hour TTL
        zone,
      );

      this.logger.log(`Driver ${driverId} online in zone ${zone}`);
    }

    return {
      message: 'You are now online',
      zone: dto.zone || 'default',
      location: { lat: dto.lat, lng: dto.lng },
    };
  }

  async goOffline(driverId: string) {
    await this.ensureDriverProfile(driverId);

    // Remove from Redis pool
    if (this.redis) {
      const zone = await this.redis.get(`driver:online:${driverId}`);
      if (zone) {
        const members = await this.redis.smembers(`driver:${zone}`);
        for (const member of members) {
          try {
            const parsed = JSON.parse(member) as { driverId: string };
            if (parsed.driverId === driverId) {
              await this.redis.srem(`driver:${zone}`, member);
            }
          } catch {
            // skip malformed entries
          }
        }
        await this.redis.del(`driver:online:${driverId}`);
      }
    }

    await this.prisma.driverProfile.update({
      where: { driverId },
      data: {
        isOnline: false,
        currentLat: null,
        currentLng: null,
        currentZone: null,
      },
    });

    this.logger.log(`Driver ${driverId} offline`);

    return { message: 'You are now offline' };
  }

  // ─── Professional Driver — Trip Requests ────────────────────

  async getProDriverRequests(driverId: string) {
    const profile = await this.ensureDriverProfile(driverId);

    if (!profile.isOnline) {
      throw new BadRequestException('Go online first to receive requests');
    }

    const trips = await this.prisma.trip.findMany({
      where: {
        OR: [
          { driverId, status: 'DRIVER_ASSIGNED' },
          { status: 'SEARCHING', driverId: null },
        ],
      },
      include: {
        rider: {
          select: {
            id: true,
            name: true,
            phone: true,
            gender: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return trips;
  }

  async acceptTrip(driverId: string, tripId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.status !== 'SEARCHING') {
      throw new BadRequestException('Trip is not available for acceptance');
    }

    // Check pickup limit (max 2 pickups per trip)
    const activeTrips = await this.prisma.trip.count({
      where: {
        driverId,
        status: { in: ['DRIVER_ASSIGNED', 'ARRIVING', 'IN_PROGRESS'] },
      },
    });

    if (activeTrips >= FARE_CONSTANTS.MAX_PICKUPS_PER_TRIP) {
      throw new BadRequestException(
        `Maximum ${FARE_CONSTANTS.MAX_PICKUPS_PER_TRIP} concurrent trips allowed`,
      );
    }

    const updated = await this.prisma.trip.update({
      where: { id: tripId },
      data: {
        driverId,
        status: 'DRIVER_ASSIGNED',
      },
      include: {
        rider: {
          select: { id: true, name: true, phone: true },
        },
      },
    });

    this.logger.log(`Trip ${tripId} accepted by driver ${driverId}`);

    return updated;
  }

  async rejectTrip(driverId: string, tripId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) throw new NotFoundException('Trip not found');

    this.logger.log(`Trip ${tripId} rejected by driver ${driverId}`);

    return { message: 'Trip rejected' };
  }

  // ─── Trip Lifecycle ─────────────────────────────────────────

  async arriveAtPickup(driverId: string, tripId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.driverId !== driverId) {
      throw new ForbiddenException('Not your trip');
    }
    if (trip.status !== 'DRIVER_ASSIGNED') {
      throw new BadRequestException('Trip is not in DRIVER_ASSIGNED status');
    }

    return this.prisma.trip.update({
      where: { id: tripId },
      data: { status: 'ARRIVING' },
    });
  }

  async completeTrip(driverId: string, tripId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.driverId !== driverId) {
      throw new ForbiddenException('Not your trip');
    }
    if (trip.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Trip is not in progress');
    }

    const updated = await this.prisma.trip.update({
      where: { id: tripId },
      data: {
        status: 'COMPLETED',
        endTime: new Date(),
      },
    });

    this.logger.log(`Trip ${tripId} completed by driver ${driverId}`);

    return updated;
  }

  // ─── Earnings ───────────────────────────────────────────────

  async getEarnings(driverId: string) {
    const profile = await this.ensureDriverProfile(driverId);

    const completedTrips = await this.prisma.trip.findMany({
      where: {
        driverId: profile.driverId,
        status: 'COMPLETED',
      },
      select: {
        id: true,
        fareFinal: true,
        fareEstimate: true,
        createdAt: true,
        endTime: true,
      },
      orderBy: { endTime: 'desc' },
    });

    const completedBookings = await this.prisma.booking.findMany({
      where: {
        instance: { ride: { driverId: profile.driverId } },
        bookingStatus: 'COMPLETED',
      },
      select: {
        id: true,
        fareTotal: true,
        commission: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const tripEarnings = completedTrips.reduce(
      (sum, t) => sum + Number(t.fareFinal || t.fareEstimate || 0),
      0,
    );

    const offerEarnings = completedBookings.reduce(
      (sum, b) => sum + Number(b.fareTotal) - Number(b.commission),
      0,
    );

    return {
      totalEarnings: tripEarnings + offerEarnings,
      tripEarnings,
      offerEarnings,
      totalTrips: completedTrips.length,
      totalBookings: completedBookings.length,
      recentTrips: completedTrips.slice(0, 10),
      recentBookings: completedBookings.slice(0, 10),
    };
  }

  // ─── Helpers ────────────────────────────────────────────────

  private async ensureDriverProfile(userId: string) {
    const profile = await this.prisma.driverProfile.findUnique({
      where: { driverId: userId },
    });

    if (!profile) {
      throw new NotFoundException(
        'Driver profile not found. Set your role to driver first.',
      );
    }

    return profile;
  }

  private async ensureOfferOwner(driverId: string, offerId: string) {
    const offer = await this.prisma.recurringRide.findUnique({
      where: { id: offerId },
    });

    if (!offer) throw new NotFoundException('Offer not found');
    if (offer.driverId !== driverId) {
      throw new ForbiddenException('Not your offer');
    }

    return offer;
  }
}
