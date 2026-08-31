import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SearchRidesDto, BookRideDto, RideFilter } from './dto/book-ride.dto';
import { FARE_CONSTANTS } from '../../common/constants/fare.constants';

@Injectable()
export class RideService {
  private readonly logger = new Logger(RideService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── Search Available Rides ─────────────────────────────────

  async searchAvailable(userId: string, dto: SearchRidesDto) {
    const results: Array<Record<string, unknown>> = [];

    // 1. Search on-demand: professional drivers online in nearby zone
    const onlineDrivers = await this.prisma.driverProfile.findMany({
      where: {
        isOnline: true,
        driverType: { in: ['PROFESSIONAL', 'BOTH'] },
        currentLat: { not: null },
        currentLng: { not: null },
      },
      include: {
        user: {
          select: { id: true, name: true, gender: true, avatarUrl: true },
        },
        vehicles: { take: 1 },
      },
    });

    for (const driver of onlineDrivers) {
      if (!driver.currentLat || !driver.currentLng) continue;

      // Filter: women-only check
      if (
        dto.filter === RideFilter.WOMEN_ONLY ||
        dto.filter === RideFilter.CARPOOL
      ) {
        continue; // Skip pro drivers for these filters
      }

      // Simple proximity check (rough, PostGIS would be better)
      const distKm = this.haversineKm(
        dto.pickupLat,
        dto.pickupLng,
        driver.currentLat,
        driver.currentLng,
      );

      if (distKm <= FARE_CONSTANTS.MATCH_RADIUS_KM) {
        const estimatedFare =
          FARE_CONSTANTS.PRO_BASE_FARE +
          FARE_CONSTANTS.PRO_COST_PER_KM * distKm;

        results.push({
          type: 'ON_DEMAND',
          driver: {
            id: driver.driverId,
            name: driver.user.name,
            gender: driver.user.gender,
            avatarUrl: driver.user.avatarUrl,
            rating: driver.totalRating,
            ratingCount: driver.ratingCount,
          },
          vehicle: driver.vehicles[0] || null,
          pickup: {
            lat: driver.currentLat,
            lng: driver.currentLng,
          },
          estimatedFare: Math.round(estimatedFare),
          distanceKm: Math.round(distKm * 10) / 10,
          surgeMultiplier: 1,
        });
      }
    }

    // 2. Search scheduled: carpool offers matching route
    if (dto.filter !== RideFilter.PROFESSIONAL) {
      const carpoolOffers = await this.prisma.recurringRide.findMany({
        where: {
          status: 'ACTIVE',
          ...(dto.filter === RideFilter.WOMEN_ONLY ? { womenOnly: true } : {}),
        },
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
            ...(dto.date
              ? { where: { date: new Date(dto.date), status: 'SCHEDULED' } }
              : {}),
            orderBy: { date: 'asc' },
            take: 5,
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      for (const offer of carpoolOffers) {
        // Get available seats per instance
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
            results.push({
              type: 'SCHEDULED',
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
              womenOnly: offer.womenOnly,
            });
          }
        }
      }
    }

    return {
      results,
      count: results.length,
      searchArea: {
        pickup: { lat: dto.pickupLat, lng: dto.pickupLng },
        drop: { lat: dto.dropLat, lng: dto.dropLng },
      },
    };
  }

  // ─── Book a Ride ────────────────────────────────────────────

  async bookRide(userId: string, dto: BookRideDto) {
    if (dto.type === 'ON_DEMAND') {
      return this.bookOnDemand(userId, dto);
    }
    return this.bookScheduled(userId, dto);
  }

  private async bookOnDemand(userId: string, dto: BookRideDto) {
    if (!dto.tripId) {
      throw new BadRequestException('tripId required for on-demand booking');
    }

    const trip = await this.prisma.trip.findUnique({
      where: { id: dto.tripId },
    });

    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.status !== 'SEARCHING') {
      throw new BadRequestException('Trip is no longer available');
    }
    if (trip.riderId === userId) {
      throw new BadRequestException('Cannot book your own trip');
    }

    // For on-demand, the rider creates the trip request
    const newTrip = await this.prisma.trip.create({
      data: {
        riderId: userId,
        status: 'SEARCHING',
        pickupLat: trip.pickupLat,
        pickupLng: trip.pickupLng,
        dropLat: trip.dropLat,
        dropLng: trip.dropLng,
        pickupAddress: trip.pickupAddress,
        dropAddress: trip.dropAddress,
        fareEstimate: trip.fareEstimate,
        distanceKm: trip.distanceKm,
        durationMin: trip.durationMin,
        pickupTime: dto.pickupAddress ? new Date() : undefined,
      },
      include: {
        rider: {
          select: { id: true, name: true, phone: true },
        },
      },
    });

    this.logger.log(`On-demand trip ${newTrip.id} created by rider ${userId}`);

    return newTrip;
  }

  private async bookScheduled(userId: string, dto: BookRideDto) {
    if (!dto.instanceId) {
      throw new BadRequestException(
        'instanceId required for scheduled booking',
      );
    }

    const instance = await this.prisma.rideInstance.findUnique({
      where: { id: dto.instanceId },
      include: { ride: true },
    });

    if (!instance) throw new NotFoundException('Ride instance not found');
    if (instance.status !== 'SCHEDULED') {
      throw new BadRequestException('This ride instance is not available');
    }

    // Check available seats
    const bookedSeats = await this.prisma.booking.aggregate({
      where: {
        instanceId: dto.instanceId,
        bookingStatus: { in: ['PENDING', 'CONFIRMED'] },
      },
      _sum: { seatCount: true },
    });

    const totalBooked = bookedSeats._sum.seatCount || 0;
    if (totalBooked + dto.seats > instance.ride.maxPassengers) {
      throw new BadRequestException(
        `Only ${instance.ride.maxPassengers - totalBooked} seats available`,
      );
    }

    // Calculate fare
    const fareTotal = Number(instance.ride.pricePerSeat) * dto.seats;
    const commissionRate =
      instance.ride.driverId === userId
        ? 0
        : FARE_CONSTANTS.CARPOOL_COMMISSION_MIN;
    const commission = Math.min(
      fareTotal * commissionRate,
      FARE_CONSTANTS.CARPOOL_COMMISSION_CAP,
    );

    const booking = await this.prisma.booking.create({
      data: {
        instanceId: dto.instanceId,
        riderId: userId,
        seatCount: dto.seats,
        fareTotal,
        commission,
        paymentStatus: 'PENDING',
        bookingStatus: 'PENDING',
      },
      include: {
        instance: {
          include: {
            ride: {
              include: {
                driver: {
                  include: {
                    user: { select: { id: true, name: true, phone: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    this.logger.log(
      `Scheduled booking ${booking.id} created for instance ${dto.instanceId}`,
    );

    return booking;
  }

  // ─── Get Ride Details ───────────────────────────────────────

  async getRide(userId: string, tripId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        rider: {
          select: { id: true, name: true, phone: true, avatarUrl: true },
        },
        driver: {
          select: { id: true, name: true, phone: true, avatarUrl: true },
        },
        payments: true,
        locations: { orderBy: { recordedAt: 'desc' }, take: 1 },
      },
    });

    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.riderId !== userId && trip.driverId !== userId) {
      throw new ForbiddenException('Not your trip');
    }

    return trip;
  }

  // ─── Cancel Ride ────────────────────────────────────────────

  async cancelRide(userId: string, tripId: string, reason?: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.riderId !== userId && trip.driverId !== userId) {
      throw new ForbiddenException('Not your trip');
    }

    // Check if trip can be cancelled
    if (trip.status === 'COMPLETED' || trip.status === 'CANCELLED') {
      throw new BadRequestException('Trip is already completed or cancelled');
    }

    // Penalty check: if driver accepted and <30 min to pickup
    if (trip.status === 'DRIVER_ASSIGNED' && trip.pickupTime) {
      const pickupTime = new Date(trip.pickupTime);
      const now = new Date();
      const minutesUntilPickup =
        (pickupTime.getTime() - now.getTime()) / (1000 * 60);

      if (minutesUntilPickup < 30 && minutesUntilPickup > 0) {
        this.logger.warn(
          `Late cancellation for trip ${tripId}: ${Math.round(minutesUntilPickup)}min to pickup`,
        );
      }
    }

    const updated = await this.prisma.trip.update({
      where: { id: tripId },
      data: { status: 'CANCELLED' },
    });

    this.logger.log(
      `Trip ${tripId} cancelled by ${userId}. Reason: ${reason || 'none'}`,
    );

    return updated;
  }

  // ─── Rebook Ride ────────────────────────────────────────────

  async rebookRide(userId: string, tripId: string) {
    const originalTrip = await this.prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!originalTrip) throw new NotFoundException('Trip not found');
    if (originalTrip.riderId !== userId) {
      throw new ForbiddenException('Only the original rider can rebook');
    }

    const newTrip = await this.prisma.trip.create({
      data: {
        riderId: userId,
        status: 'SEARCHING',
        pickupLat: originalTrip.pickupLat,
        pickupLng: originalTrip.pickupLng,
        dropLat: originalTrip.dropLat,
        dropLng: originalTrip.dropLng,
        pickupAddress: originalTrip.pickupAddress,
        dropAddress: originalTrip.dropAddress,
        fareEstimate: originalTrip.fareEstimate,
        distanceKm: originalTrip.distanceKm,
        durationMin: originalTrip.durationMin,
      },
      include: {
        rider: { select: { id: true, name: true } },
      },
    });

    this.logger.log(`Trip ${tripId} rebooked as ${newTrip.id} by ${userId}`);

    return newTrip;
  }

  // ─── Upcoming & History ─────────────────────────────────────

  async getUpcoming(userId: string) {
    const now = new Date();

    // On-demand trips
    const trips = await this.prisma.trip.findMany({
      where: {
        OR: [{ riderId: userId }, { driverId: userId }],
        status: {
          in: ['SEARCHING', 'DRIVER_ASSIGNED', 'ARRIVING', 'IN_PROGRESS'],
        },
      },
      include: {
        rider: { select: { id: true, name: true, avatarUrl: true } },
        driver: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Scheduled bookings
    const bookings = await this.prisma.booking.findMany({
      where: {
        riderId: userId,
        bookingStatus: { in: ['PENDING', 'CONFIRMED'] },
        instance: { date: { gte: now } },
      },
      include: {
        instance: {
          include: {
            ride: {
              include: {
                driver: {
                  include: {
                    user: { select: { id: true, name: true, avatarUrl: true } },
                  },
                },
                vehicle: { select: { make: true, model: true, color: true } },
              },
            },
          },
        },
      },
      orderBy: { instance: { date: 'asc' } },
    });

    return { trips, bookings };
  }

  async getHistory(userId: string) {
    const trips = await this.prisma.trip.findMany({
      where: {
        OR: [{ riderId: userId }, { driverId: userId }],
        status: { in: ['COMPLETED', 'CANCELLED'] },
      },
      include: {
        rider: { select: { id: true, name: true, avatarUrl: true } },
        driver: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const bookings = await this.prisma.booking.findMany({
      where: {
        riderId: userId,
        bookingStatus: { in: ['COMPLETED', 'CANCELLED'] },
      },
      include: {
        instance: {
          include: {
            ride: {
              include: {
                driver: {
                  include: {
                    user: { select: { id: true, name: true } },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return { trips, bookings };
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
