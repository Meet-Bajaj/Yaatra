import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { EmergencyContactsDto } from './dto/emergency-contacts.dto';
import { CreateSavedPlaceDto } from './dto/create-saved-place.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { phone: createUserDto.phone },
    });

    if (existing) {
      throw new ConflictException('User with this phone number already exists');
    }

    return this.prisma.user.create({
      data: createUserDto,
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll(params?: { skip?: number; take?: number; search?: string }) {
    const { skip = 0, take = 50, search } = params || {};

    return this.prisma.user.findMany({
      skip,
      take,
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
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
        createdAt: true,
        updatedAt: true,
        driverProfile: {
          select: {
            verificationStatus: true,
            totalRating: true,
            ratingCount: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
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
        referralCode: true,
        createdAt: true,
        updatedAt: true,
        driverProfile: {
          select: {
            verificationStatus: true,
            totalRating: true,
            ratingCount: true,
            badges: true,
            vehicles: true,
          },
        },
        wallet: {
          select: {
            balance: true,
          },
        },
        kycDocuments: {
          select: {
            id: true,
            type: true,
            status: true,
            uploadedAt: true,
            verifiedAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async getMe(userId: string) {
    return this.findOne(userId);
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: updateProfileDto.name,
        gender: updateProfileDto.gender as never,
        email: updateProfileDto.email,
        city: updateProfileDto.city,
        avatarUrl: updateProfileDto.avatarUrl,
      },
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
        updatedAt: true,
      },
    });
  }

  async update(userId: string, updateUserDto: Partial<UpdateProfileDto>) {
    return this.updateProfile(userId, updateUserDto);
  }

  async setRole(userId: string, role: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const validDriverRoles = ['CARPOOL', 'PROFESSIONAL', 'BOTH'];
    const isDriverRole = validDriverRoles.includes(role);

    return this.prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { role: role as never },
        select: {
          id: true,
          phone: true,
          name: true,
          role: true,
        },
      });

      if (isDriverRole) {
        await tx.driverProfile.upsert({
          where: { driverId: userId },
          create: { driverId: userId },
          update: {},
        });
      }

      return updatedUser;
    });
  }

  async updateEmergencyContacts(userId: string, dto: EmergencyContactsDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { emergencyContacts: dto.contacts as never },
      select: {
        id: true,
        emergencyContacts: true,
      },
    });
  }

  async softDelete(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === 'ADMIN') {
      throw new ForbiddenException('Cannot delete admin users');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { status: 'DELETED' },
      select: {
        id: true,
        status: true,
      },
    });
  }

  // ─── Saved Places ───────────────────────────────────────────────

  getSavedPlaces(userId: string) {
    return this.prisma.savedPlace.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createSavedPlace(userId: string, dto: CreateSavedPlaceDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.savedPlace.create({
      data: {
        userId,
        label: dto.label,
        name: dto.name,
        address: dto.address,
        lat: dto.lat,
        lng: dto.lng,
      },
    });
  }

  async deleteSavedPlace(userId: string, placeId: string) {
    const place = await this.prisma.savedPlace.findUnique({
      where: { id: placeId },
    });

    if (!place) {
      throw new NotFoundException('Saved place not found');
    }

    if (place.userId !== userId) {
      throw new ForbiddenException('Cannot delete another user saved place');
    }

    await this.prisma.savedPlace.delete({ where: { id: placeId } });

    return { message: 'Place deleted successfully' };
  }

  // ─── Driver Vehicles ────────────────────────────────────────────

  async getDriverVehicles(userId: string) {
    const profile = await this.prisma.driverProfile.findUnique({
      where: { driverId: userId },
    });

    if (!profile) {
      throw new NotFoundException('Driver profile not found');
    }

    return this.prisma.vehicles.findMany({
      where: { driverId: profile.driverId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createVehicle(userId: string, dto: CreateVehicleDto) {
    const profile = await this.prisma.driverProfile.findUnique({
      where: { driverId: userId },
    });

    if (!profile) {
      throw new NotFoundException('Driver profile not found');
    }

    const existingPlate = await this.prisma.vehicles.findUnique({
      where: { licensePlate: dto.licensePlate },
    });

    if (existingPlate) {
      throw new ConflictException(
        'Vehicle with this license plate already exists',
      );
    }

    return this.prisma.vehicles.create({
      data: {
        driverId: profile.driverId,
        make: dto.make,
        model: dto.model,
        licensePlate: dto.licensePlate,
        capacity: dto.capacity,
      },
    });
  }

  async updateVehicle(
    userId: string,
    vehicleId: string,
    dto: UpdateVehicleDto,
  ) {
    const vehicle = await this.prisma.vehicles.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const profile = await this.prisma.driverProfile.findUnique({
      where: { driverId: userId },
    });

    if (!profile || vehicle.driverId !== profile.driverId) {
      throw new ForbiddenException('Cannot update another driver vehicle');
    }

    return this.prisma.vehicles.update({
      where: { id: vehicleId },
      data: {
        ...(dto.make && { make: dto.make }),
        ...(dto.model && { model: dto.model }),
        ...(dto.color && { color: dto.color }),
        ...(dto.licensePlate && { licensePlate: dto.licensePlate }),
        ...(dto.capacity && { capacity: dto.capacity }),
      },
    });
  }

  async deleteVehicle(userId: string, vehicleId: string) {
    const vehicle = await this.prisma.vehicles.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const profile = await this.prisma.driverProfile.findUnique({
      where: { driverId: userId },
    });

    if (!profile || vehicle.driverId !== profile.driverId) {
      throw new ForbiddenException('Cannot delete another driver vehicle');
    }

    await this.prisma.vehicles.delete({ where: { id: vehicleId } });

    return { message: 'Vehicle deleted successfully' };
  }

  // ─── Driver Profile ─────────────────────────────────────────────

  async getDriverProfile(userId: string) {
    const profile = await this.prisma.driverProfile.findUnique({
      where: { driverId: userId },
      include: {
        vehicles: true,
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            avatarUrl: true,
            gender: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Driver profile not found');
    }

    return profile;
  }

  async getDriverEarnings(userId: string) {
    const profile = await this.prisma.driverProfile.findUnique({
      where: { driverId: userId },
    });

    if (!profile) {
      throw new NotFoundException('Driver profile not found');
    }

    const bookings = await this.prisma.booking.findMany({
      where: {
        instance: {
          ride: { driverId: profile.driverId },
        },
        bookingStatus: 'COMPLETED',
      },
      select: {
        fareTotal: true,
        commission: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalEarnings = bookings.reduce(
      (sum, b) => sum + Number(b.fareTotal) - Number(b.commission),
      0,
    );
    const totalCommission = bookings.reduce(
      (sum, b) => sum + Number(b.commission),
      0,
    );

    return {
      totalEarnings,
      totalCommission,
      tripCount: bookings.length,
      recentTrips: bookings.slice(0, 10),
    };
  }
}
