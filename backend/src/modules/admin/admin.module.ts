import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { S3Service } from '../kyc/s3.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, PrismaService, S3Service],
  exports: [AdminService],
})
export class AdminModule {}
