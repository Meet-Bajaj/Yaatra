import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class CreateOfferDto {
  @ApiProperty({ example: 'Koramangala to Whitefield' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  routeName: string;

  @ApiProperty({ example: 77.6245 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  startLng: number;

  @ApiProperty({ example: 12.9352 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  startLat: number;

  @ApiProperty({ example: 77.75 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  endLng: number;

  @ApiProperty({ example: 12.9987 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  endLat: number;

  @ApiProperty({ example: '08:30' })
  @IsString()
  @IsNotEmpty()
  departureTime: string;

  @ApiProperty({ example: ['MON', 'TUE', 'WED', 'THU', 'FRI'] })
  @IsNotEmpty()
  daysOfWeek: string[];

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(1)
  @Max(3)
  availableSeats: number;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @Min(10)
  @Max(500)
  pricePerSeat: number;

  @ApiPropertyOptional({ example: 'KA01AB1234' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  vehicleId?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  womenOnly?: boolean;

  @ApiPropertyOptional({ example: '456 Residency Road, Bangalore' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  pickupAddress?: string;
}
