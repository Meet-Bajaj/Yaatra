import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class UpdateVehicleDto {
  @ApiPropertyOptional({ example: 'Toyota' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  make?: string;

  @ApiPropertyOptional({ example: 'Innova Crysta' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  model?: string;

  @ApiPropertyOptional({ example: 'White' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  color?: string;

  @ApiPropertyOptional({ example: 'KA01AB1234' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  licensePlate?: string;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(6)
  capacity?: number;
}
