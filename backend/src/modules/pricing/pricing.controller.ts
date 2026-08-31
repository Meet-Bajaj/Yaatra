import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get fare estimate for a trip' })
  @ApiQuery({ name: 'type', enum: ['CARPOOL', 'PROFESSIONAL'], required: true })
  @ApiQuery({ name: 'distanceKm', type: Number, required: true })
  @ApiQuery({ name: 'durationMin', type: Number, required: true })
  @ApiQuery({ name: 'surgeMultiplier', type: Number, required: false })
  @ApiQuery({ name: 'pricePerSeat', type: Number, required: false })
  @ApiQuery({ name: 'seats', type: Number, required: false })
  @ApiResponse({ status: 200, description: 'Fare estimate returned' })
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
