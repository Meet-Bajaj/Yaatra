import { ApiProperty } from '@nestjs/swagger';

export class AdminStatsEntity {
  @ApiProperty()
  totalUsers: number;

  @ApiProperty()
  activeUsers: number;

  @ApiProperty()
  totalDrivers: number;

  @ApiProperty()
  totalRiders: number;

  @ApiProperty()
  totalBookings: number;

  @ApiProperty()
  completedBookings: number;

  @ApiProperty()
  totalRevenue: number;

  @ApiProperty()
  pendingDocVerifications: number;

  @ApiProperty()
  openDisputes: number;

  constructor(partial: Partial<AdminStatsEntity>) {
    Object.assign(this, partial);
  }
}
