import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Persist a location update for a trip.
   */
  async updateLocation(
    tripId: string,
    lat: number,
    lng: number,
    speed?: number,
  ) {
    const location = await this.prisma.tripLocation.create({
      data: {
        tripId,
        lat,
        lng,
        speedKmh: speed,
      },
    });

    // Update trip driver location
    await this.prisma.trip.update({
      where: { id: tripId },
      data: {},
    });

    return location;
  }

  /**
   * Get the latest location for a trip.
   */
  async getLatestLocation(tripId: string) {
    const location = await this.prisma.tripLocation.findFirst({
      where: { tripId },
      orderBy: { recordedAt: 'desc' },
    });

    return location;
  }

  /**
   * Get location history for a trip.
   */
  async getLocationHistory(tripId: string, limit: number = 100) {
    const locations = await this.prisma.tripLocation.findMany({
      where: { tripId },
      orderBy: { recordedAt: 'desc' },
      take: limit,
    });

    return locations;
  }

  /**
   * Get trip info for authorization checks.
   */
  async getTripInfo(tripId: string) {
    return this.prisma.trip.findUnique({
      where: { id: tripId },
      select: {
        id: true,
        riderId: true,
        driverId: true,
        status: true,
      },
    });
  }
}
