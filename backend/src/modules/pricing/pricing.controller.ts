import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { PricingService } from './pricing.service';

@ApiTags('pricing')
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get('estimate')

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get fare estimate', description: 'Calculates an estimated fare for a trip based on ride type, distance, duration, surge multiplier, and per-seat pricing. Returns breakdown of base fare, distance fare, time fare, and total.' })
  @ApiResponse({ status: 200, description: 'Fare estimate returned with full breakdown.' })
  @ApiResponse({ status: 400, description: 'Invalid parameters. Distance and duration are required.' })
  @ApiQuery({ name: 'type', enum: ['CARPOOL', 'PROFESSIONAL'], required: true })
  @ApiQuery({ name: 'distanceKm', type: Number, required: true })
  @ApiQuery({ name: 'durationMin', type: Number, required: true })
  @ApiQuery({ name: 'surgeMultiplier', type: Number, required: false })
  @ApiQuery({ name: 'pricePerSeat', type: Number, required: false })
  @ApiQuery({ name: 'seats', type: Number, required: false })
  getEstimate(
    @Query('type') type: 'CARPOOL' | 'PROFESSIONAL',
    @Query('distanceKm') distanceKm: string,
    @Query('durationMin') durationMin: string,
    @Query('surgeMultiplier') surgeMultiplier?: string,
    @Query('pricePerSeat') pricePerSeat?: string,
    @Query('seats') seats?: string,
  ) {
    return this.pricingService.calculateFare(
      type,
      parseFloat(distanceKm),
      parseInt(durationMin, 10),
      surgeMultiplier ? parseFloat(surgeMultiplier) : 1,
      {
        pricePerSeat: pricePerSeat ? parseFloat(pricePerSeat) : undefined,
        seats: seats ? parseInt(seats, 10) : 1,
      },
    );
  }
}
