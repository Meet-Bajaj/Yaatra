import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  MaxLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ example: 'Toyota' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  make: string;

  @ApiProperty({ example: 'Innova Crysta' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  model: string;

  @ApiProperty({ example: 'White' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  color: string;

  @ApiProperty({ example: 'KA01AB1234' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  licensePlate: string;

  @ApiProperty({ example: 4 })
  @IsNumber()
  @Min(1)
  @Max(6)
  capacity: number;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  isCommercial?: boolean;
}
