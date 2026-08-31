import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class GoOnlineDto {
  @ApiProperty({ example: 28.6139 })
  @IsNumber()
  lat: number;

  @ApiProperty({ example: 77.209 })
  @IsNumber()
  lng: number;

  @ApiPropertyOptional({ example: 'zone-central-delhi' })
  @IsOptional()
  @IsString()
  zone?: string;

  @ApiPropertyOptional({ example: 'vehicle-uuid' })
  @IsOptional()
  @IsString()
  vehicleId?: string;
}

export class AcceptTripDto {
  @ApiProperty({ example: 'trip-uuid-here' })
  @IsString()
  tripId: string;
}

export class GoOfflineDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  pendingTrips?: number;
}
