import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { VerifyDocDto, VerificationAction } from './dto/verify-doc.dto';
import {
  ResolveDisputeDto,
  DisputeResolution,
} from './dto/resolve-dispute.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── User Management ────────────────────────────────────────────

  async listUsers(params?: {
    skip?: number;
    take?: number;
    search?: string;
    role?: string;
    status?: string;
  }) {
    const { skip = 0, take = 50, search, role, status } = params || {};

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        where,
        select: {
          id: true,
          phone: true,
          name: true,
          email: true,
          role: true,
          status: true,
          gender: true,
          city: true,
          createdAt: true,
          driverProfile: {
            select: {
              verificationStatus: true,
              totalRating: true,
              ratingCount: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users, total, skip, take };
  }

  async getUserDetails(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        role: true,
        status: true,
        gender: true,
        city: true,
        avatarUrl: true,
        emergencyContacts: true,
        createdAt: true,
        updatedAt: true,
        driverProfile: {
          select: {
            verificationStatus: true,
            totalRating: true,
            ratingCount: true,
            badges: true,
            vehicles: true,
            recurringRides: true,
          },
        },
        wallet: {
          select: {
            balance: true,
            transactions: {
              take: 20,
              orderBy: { createdAt: 'desc' },
            },
          },
        },
        bookings: {
          take: 20,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            seatCount: true,
            fareTotal: true,
            bookingStatus: true,
            paymentStatus: true,
            createdAt: true,
          },
        },
        kycDocuments: true,
        notifications: {
          take: 20,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  async updateUserStatus(userId: string, status: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === 'ADMIN') {
      throw new BadRequestException('Cannot change admin user status');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { status: status as never },
      select: {
        id: true,
        status: true,
      },
    });
  }

  // ─── Document Verification ──────────────────────────────────────

  async getDocQueue(params?: { skip?: number; take?: number }) {
    const { skip = 0, take = 50 } = params || {};

    const [documents, total] = await Promise.all([
      this.prisma.kycDocument.findMany({
        skip,
        take,
        where: { status: 'PENDING' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
        },
        orderBy: { uploadedAt: 'asc' },
      }),
      this.prisma.kycDocument.count({ where: { status: 'PENDING' } }),
    ]);

    return { documents, total, skip, take };
  }

  async verifyDocument(docId: string, dto: VerifyDocDto) {
    const document = await this.prisma.kycDocument.findUnique({
      where: { id: docId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.status !== 'PENDING') {
      throw new BadRequestException('Document has already been reviewed');
    }

    const updateData: Record<string, unknown> = {
      status: dto.action,
    };

    if (dto.action === VerificationAction.REJECTED && dto.rejectionReason) {
      updateData.verifiedAt = new Date();
    } else if (dto.action === VerificationAction.APPROVED) {
      updateData.verifiedAt = new Date();
    }

    return this.prisma.kycDocument.update({
      where: { id: docId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });
  }

  // ─── Disputes ───────────────────────────────────────────────────

  async getDisputes(params?: {
    skip?: number;
    take?: number;
    status?: string;
  }) {
    const { skip = 0, take = 50, status } = params || {};

    const where: Record<string, unknown> = {};

    if (status) {
      where.paymentStatus = status;
    } else {
      where.paymentStatus = 'PENDING';
    }

    const [disputes, total] = await Promise.all([
      this.prisma.booking.findMany({
        skip,
        take,
        where: {
          ...where,
          OR: [{ paymentStatus: 'FAILED' }, { paymentStatus: 'PENDING' }],
        },
        include: {
          rider: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          instance: {
            include: {
              ride: {
                include: {
                  driver: {
                    select: {
                      driverId: true,
                      user: {
                        select: {
                          id: true,
                          name: true,
                          phone: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.booking.count({
        where: {
          ...where,
          OR: [{ paymentStatus: 'FAILED' }, { paymentStatus: 'PENDING' }],
        },
      }),
    ]);

    return { disputes, total, skip, take };
  }

  async resolveDispute(bookingId: string, dto: ResolveDisputeDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (dto.resolution === DisputeResolution.REFUND_RIDER && dto.refundAmount) {
      if (dto.refundAmount > Number(booking.fareTotal)) {
        throw new BadRequestException('Refund amount exceeds fare');
      }

      await this.prisma.payment.create({
        data: {
          bookingId,
          amount: dto.refundAmount,
          type: 'REFUND',
          status: 'SUCCEEDED',
        },
      });

      await this.prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: 'REFUNDED' },
      });
    } else if (dto.resolution === DisputeResolution.DISMISS) {
      await this.prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: 'CAPTURED' },
      });
    }

    return {
      message: `Dispute resolved: ${dto.resolution}`,
      bookingId,
      resolution: dto.resolution,
      notes: dto.notes,
    };
  }

  // ─── Stats ──────────────────────────────────────────────────────

  async getStats() {
    const [
      totalUsers,
      activeUsers,
      totalDrivers,
      totalRiders,
      totalBookings,
      completedBookings,
      pendingDocVerifications,
      openDisputes,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: 'ACTIVE' } }),
      this.prisma.driverProfile.count(),
      this.prisma.user.count({ where: { role: 'RIDER' } }),
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { bookingStatus: 'COMPLETED' } }),
      this.prisma.kycDocument.count({ where: { status: 'PENDING' } }),
      this.prisma.booking.count({
        where: {
          OR: [{ paymentStatus: 'FAILED' }, { paymentStatus: 'PENDING' }],
        },
      }),
    ]);

    const revenueResult = await this.prisma.payment.aggregate({
      where: {
        status: 'SUCCEEDED',
        type: 'CAPTURE',
      },
      _sum: { amount: true },
    });

    return {
      totalUsers,
      activeUsers,
      totalDrivers,
      totalRiders,
      totalBookings,
      completedBookings,
      totalRevenue: Number(revenueResult._sum.amount || 0),
      pendingDocVerifications,
      openDisputes,
    };
  }
}
