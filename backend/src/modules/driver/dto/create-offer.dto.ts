import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RoutePointDto {
  @ApiProperty({ example: 28.6139 })
  @IsNumber()
  lat: number;

  @ApiProperty({ example: 77.209 })
  @IsNumber()
  lng: number;

  @ApiProperty({ example: 'Connaught Place, New Delhi' })
  @IsString()
  @IsNotEmpty()
  address: string;
}

export class ScheduleSlotDto {
  @ApiProperty({ example: 'MONDAY' })
  @IsString()
  @IsNotEmpty()
  day: string;

  @ApiProperty({ example: '08:30' })
  @IsString()
  @IsNotEmpty()
  departureTime: string;
}

export class CreateOfferDto {
  @ApiProperty({ type: RoutePointDto })
  @ValidateNested()
  @Type(() => RoutePointDto)
  pickup: RoutePointDto;

  @ApiProperty({ type: RoutePointDto })
  @ValidateNested()
  @Type(() => RoutePointDto)
  drop: RoutePointDto;

  @ApiProperty({ type: [ScheduleSlotDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleSlotDto)
  schedule: ScheduleSlotDto[];

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(1)
  @Max(3)
  seats: number;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @Min(10)
  @Max(500)
  pricePerSeat: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  womenOnly?: boolean;

  @ApiProperty({ example: 'vehicle-uuid-here' })
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @ApiPropertyOptional({ example: 'Going to office via NH48' })
  @IsOptional()
  @IsString()
  notes?: string;
}
