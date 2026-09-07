import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { S3Service } from '../kyc/s3.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, S3Service, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
