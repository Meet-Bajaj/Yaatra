import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
} from 'class-validator';

export enum RideType {
  ON_DEMAND = 'ON_DEMAND',
  SCHEDULED = 'SCHEDULED',
}

export enum RideFilter {
  ALL = 'ALL',
  CARPOOL = 'CARPOOL',
  PROFESSIONAL = 'PROFESSIONAL',
  WOMEN_ONLY = 'WOMEN_ONLY',
}

export class SearchRidesDto {
  @ApiProperty({ example: 28.6139 })
  @IsNumber()
  pickupLat: number;

  @ApiProperty({ example: 77.209 })
  @IsNumber()
  pickupLng: number;

  @ApiProperty({ example: 28.5355 })
  @IsNumber()
  dropLat: number;

  @ApiProperty({ example: 77.391 })
  @IsNumber()
  dropLng: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pickupAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dropAddress?: string;

  @ApiPropertyOptional({ enum: RideFilter, default: RideFilter.ALL })
  @IsOptional()
  @IsEnum(RideFilter)
  filter?: RideFilter;

  @ApiPropertyOptional({ example: 'price' })
  @IsOptional()
  @IsString()
  sortBy?: 'price' | 'time' | 'rating';

  @ApiPropertyOptional({ example: '2026-09-01' })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({ example: '08:30' })
  @IsOptional()
  @IsString()
  time?: string;
}

export class BookRideDto {
  @ApiProperty({ enum: ['ON_DEMAND', 'SCHEDULED'] })
  @IsEnum(['ON_DEMAND', 'SCHEDULED'] as const)
  type: 'ON_DEMAND' | 'SCHEDULED';

  @ApiPropertyOptional({ example: 'trip-uuid-or-instance-uuid' })
  @IsOptional()
  @IsString()
  tripId?: string;

  @ApiPropertyOptional({ example: 'instance-uuid-for-scheduled' })
  @IsOptional()
  @IsString()
  instanceId?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  seats: number;

  @ApiProperty({ example: 'pickup-address' })
  @IsString()
  @IsNotEmpty()
  pickupAddress: string;

  @ApiProperty({ example: 'drop-address' })
  @IsString()
  @IsNotEmpty()
  dropAddress: string;

  @ApiPropertyOptional({ example: 'wallet' })
  @IsOptional()
  @IsString()
  paymentMethod?: string;
}

export class CancelRideDto {
  @ApiPropertyOptional({ example: 'Changed plans' })
  @IsOptional()
  @IsString()
  reason?: string;
}
