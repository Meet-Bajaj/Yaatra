import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  IsNumber,
  Min,
} from 'class-validator';

export enum DisputeResolution {
  REFUND_RIDER = 'REFUND_RIDER',
  PAY_DRIVER = 'PAY_DRIVER',
  SPLIT = 'SPLIT',
  DISMISS = 'DISMISS',
}

export class ResolveDisputeDto {
  @ApiProperty({ enum: DisputeResolution })
  @IsEnum(DisputeResolution)
  resolution: DisputeResolution;

  @ApiPropertyOptional({ example: 'Refunded 50% to rider' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  refundAmount?: number;
}
