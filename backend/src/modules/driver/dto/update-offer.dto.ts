import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RoutePointDto, ScheduleSlotDto } from './create-offer.dto';

export class UpdateOfferDto {
  @ApiPropertyOptional({ type: RoutePointDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => RoutePointDto)
  pickup?: RoutePointDto;

  @ApiPropertyOptional({ type: RoutePointDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => RoutePointDto)
  drop?: RoutePointDto;

  @ApiPropertyOptional({ type: [ScheduleSlotDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleSlotDto)
  schedule?: ScheduleSlotDto[];

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(3)
  seats?: number;

  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(500)
  pricePerSeat?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  womenOnly?: boolean;

  @ApiPropertyOptional({ example: 'Going to office via NH48' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ enum: ['ACTIVE', 'PAUSED'] })
  @IsOptional()
  @IsString()
  status?: 'ACTIVE' | 'PAUSED';
}
