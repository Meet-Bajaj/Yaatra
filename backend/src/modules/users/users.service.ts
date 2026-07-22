import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll(): Promise<User[]> {
     return await this.prisma.user.findMany({
      include: {
        driverProfile: true,
        wallet: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  //     try {
  //   const users = await this.prisma.user.findMany();

  //   console.log(users);

  //   return users;

  // } catch (error) {
  //   console.error(error);
  //   throw error;
  // }
  }

  findOne(id: string) {
    const user = this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        driverProfile: true,
        wallet: true,
        bookings: true,
        ratingsGiven: true,
        ratingsReceived: true,
        notifications: true,
        kycDocuments: true,
      },
    });
    if(!user)
      throw new NotFoundException(`User with UserID ${id} not found.`);
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
