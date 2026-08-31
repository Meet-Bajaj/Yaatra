import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FARE_CONSTANTS } from '../../common/constants/fare.constants';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── Get My Subscriptions ───────────────────────────────────

  async getMySubscriptions(userId: string) {
    // Get bookings on scheduled rides where user is a rider
    const bookings = await this.prisma.booking.findMany({
      where: {
        riderId: userId,
        bookingStatus: { in: ['PENDING', 'CONFIRMED'] },
      },
      include: {
        instance: {
          include: {
            ride: {
              include: {
                driver: {
                  include: {
                    user: {
                      select: { id: true, name: true, avatarUrl: true },
                    },
                  },
                },
                vehicle: {
                  select: { make: true, model: true, color: true },
                },
              },
            },
          },
        },
      },
      orderBy: { instance: { date: 'asc' } },
    });

    // Get offers where user is the driver
    const driverOffers = await this.prisma.recurringRide.findMany({
      where: {
        driverId: userId,
        status: { in: ['ACTIVE', 'PAUSED'] },
      },
      include: {
        vehicle: {
          select: { make: true, model: true, color: true },
        },
        instances: {
          orderBy: { date: 'asc' },
          take: 5,
        },
      },
    });

    return {
      asRider: bookings,
      asDriver: driverOffers,
    };
  }

  // ─── Find Matching Offers ───────────────────────────────────

  async findMatches(
    userId: string,
    pickupLat: number,
    pickupLng: number,
    dropLat: number,
    dropLng: number,
    date?: string,
    _time?: string,
  ) {
    // Get all active carpool offers
    const offers = await this.prisma.recurringRide.findMany({
      where: { status: 'ACTIVE' },
      include: {
        driver: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                gender: true,
                avatarUrl: true,
              },
            },
          },
        },
        vehicle: {
          select: { make: true, model: true, color: true, capacity: true },
        },
        instances: {
          where: { status: 'SCHEDULED' },
          orderBy: { date: 'asc' },
          take: 10,
        },
      },
    });

    const matches: Array<Record<string, unknown>> = [];

    for (const offer of offers) {
      // Skip own offers
      if (offer.driverId === userId) continue;

      // Parse schedule for route comparison
      const schedule = offer.schedule as Record<string, unknown>;
      const pickup = schedule.pickup as
        { lat: number; lng: number } | undefined;
      const drop = schedule.drop as { lat: number; lng: number } | undefined;

      if (!pickup || !drop) continue;

      // Check route overlap (simplified: proximity to pickup/drop)
      const pickupDist = this.haversineKm(
        pickupLat,
        pickupLng,
        pickup.lat,
        pickup.lng,
      );
      const dropDist = this.haversineKm(dropLat, dropLng, drop.lat, drop.lng);

      if (
        pickupDist <= FARE_CONSTANTS.SCHEDULED_MATCH_RADIUS_KM &&
        dropDist <= FARE_CONSTANTS.SCHEDULED_MATCH_RADIUS_KM
      ) {
        // Check available seats for matching instances
        for (const instance of offer.instances) {
          if (date && instance.date.toISOString().slice(0, 10) !== date)
            continue;

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
            matches.push({
              offerId: offer.id,
              instanceId: instance.id,
              driver: {
                id: offer.driver.driverId,
                name: offer.driver.user.name,
                gender: offer.driver.user.gender,
                rating: offer.driver.totalRating,
              },
              vehicle: offer.vehicle,
              schedule: {
                date: instance.date,
                departureTime: instance.departureTime,
              },
              pricePerSeat: Number(offer.pricePerSeat),
              availableSeats,
              pickupDistance: Math.round(pickupDist * 100) / 100,
              dropDistance: Math.round(dropDist * 100) / 100,
              womenOnly: offer.womenOnly,
            });
          }
        }
      }
    }

    return {
      matches,
      count: matches.length,
      searchArea: {
        pickup: { lat: pickupLat, lng: pickupLng },
        drop: { lat: dropLat, lng: dropLng },
      },
    };
  }

  // ─── Update Schedule ────────────────────────────────────────

  async updateSchedule(
    userId: string,
    offerId: string,
    dto: { status?: string },
  ) {
    const offer = await this.prisma.recurringRide.findUnique({
      where: { id: offerId },
    });

    if (!offer) throw new NotFoundException('Schedule not found');
    if (offer.driverId !== userId) {
      throw new ForbiddenException('Not your schedule');
    }

    if (!dto.status || !['ACTIVE', 'PAUSED'].includes(dto.status)) {
      throw new BadRequestException('Status must be ACTIVE or PAUSED');
    }

    return this.prisma.recurringRide.update({
      where: { id: offerId },
      data: { status: dto.status as 'ACTIVE' | 'PAUSED' },
    });
  }

  // ─── Cancel Instance ────────────────────────────────────────

  async cancelInstance(userId: string, instanceId: string) {
    const instance = await this.prisma.rideInstance.findUnique({
      where: { id: instanceId },
      include: { ride: { select: { driverId: true } } },
    });

    if (!instance) throw new NotFoundException('Instance not found');

    // Allow driver or rider who booked to cancel
    const isDriver = instance.ride.driverId === userId;
    const hasBooking = await this.prisma.booking.findFirst({
      where: { instanceId, riderId: userId },
    });

    if (!isDriver && !hasBooking) {
      throw new ForbiddenException('Not authorized to cancel this instance');
    }

    // Cancel all pending bookings
    await this.prisma.booking.updateMany({
      where: {
        instanceId,
        bookingStatus: { in: ['PENDING', 'CONFIRMED'] },
      },
      data: { bookingStatus: 'CANCELLED' },
    });

    const updated = await this.prisma.rideInstance.update({
      where: { id: instanceId },
      data: { status: 'CANCELLED' },
    });

    this.logger.log(`Instance ${instanceId} cancelled by ${userId}`);

    return updated;
  }

  // ─── Helpers ────────────────────────────────────────────────

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
