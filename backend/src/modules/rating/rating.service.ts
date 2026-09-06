import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RatingService {
  private readonly logger = new Logger(RatingService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── Create Rating ──────────────────────────────────────────

  async create(
    userId: string,
    dto: {
      revieweeId: string;
      tripId?: string;
      rideInstanceId?: string;
      score: number;
      comment?: string;
      tags?: string[];
    },
  ) {
    // Validate: reviewer ≠ reviewee
    if (userId === dto.revieweeId) {
      throw new BadRequestException('Cannot rate yourself');
    }

    // Validate: score range
    if (dto.score < 1 || dto.score > 5) {
      throw new BadRequestException('Score must be between 1 and 5');
    }

    // Validate: trip exists and is completed
    if (dto.tripId) {
      const trip = await this.prisma.trip.findUnique({
        where: { id: dto.tripId },
      });

      if (!trip) throw new NotFoundException('Trip not found');
      if (trip.status !== 'COMPLETED') {
        throw new BadRequestException('Can only rate completed trips');
      }

      // Check: reviewer was part of this trip
      if (trip.riderId !== userId && trip.driverId !== userId) {
        throw new BadRequestException('You were not part of this trip');
      }
    }

    // Validate: ride instance exists and is completed
    if (dto.rideInstanceId) {
      const instance = await this.prisma.rideInstance.findUnique({
        where: { id: dto.rideInstanceId },
      });

      if (!instance) throw new NotFoundException('Ride instance not found');
      if (instance.status !== 'COMPLETED') {
        throw new BadRequestException('Can only rate completed rides');
      }
    }

    // Check for duplicate rating
    const existing = await this.prisma.rating.findFirst({
      where: {
        reviewerId: userId,
        tripId: dto.tripId,
        rideInstanceId: dto.rideInstanceId,
      },
    });

    if (existing) {
      throw new ConflictException('You have already rated this ride');
    }

    // Create rating
    const rating = await this.prisma.rating.create({
      data: {
        reviewerId: userId,
        revieweeId: dto.revieweeId,
        tripId: dto.tripId,
        rideInstanceId: dto.rideInstanceId,
        score: dto.score,
        comment: dto.comment,
        tags: dto.tags || [],
      },
      include: {
        reviewer: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    // Update driver profile stats if reviewee is a driver
    const driverProfile = await this.prisma.driverProfile.findUnique({
      where: { driverId: dto.revieweeId },
    });

    if (driverProfile) {
      const newCount = driverProfile.ratingCount + 1;
      const newTotal =
        (Number(driverProfile.totalRating) * driverProfile.ratingCount +
          dto.score) /
        newCount;

      await this.prisma.driverProfile.update({
        where: { driverId: dto.revieweeId },
        data: {
          totalRating: newTotal,
          ratingCount: newCount,
        },
      });
    }

    this.logger.log(
      `Rating ${rating.id}: ${userId} → ${dto.revieweeId} (${dto.score}/5)`,
    );

    return rating;
  }

  // ─── Get User Ratings ───────────────────────────────────────

  async getUserRatings(userId: string) {
    const ratings = await this.prisma.rating.findMany({
      where: { revieweeId: userId },
      include: {
        reviewer: {
          select: { id: true, name: true, avatarUrl: true },
        },
        trip: {
          select: { id: true, pickupAddress: true, dropAddress: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const avgScore =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
        : 0;

    return {
      userId,
      averageScore: Math.round(avgScore * 10) / 10,
      totalRatings: ratings.length,
      ratings,
    };
  }

  // ─── Delete Scaffold Methods ────────────────────────────────

  findAll() {
    return [];
  }

  findOne(_id: string) {
    return null;
  }

  update(_id: string) {
    return null;
  }

  remove(_id: string) {
    return null;
  }
}
