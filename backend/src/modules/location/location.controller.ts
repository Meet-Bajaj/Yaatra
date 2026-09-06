import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { LocationService } from './location.service';

interface AuthRequest {
  user: { userId: string; phone: string; role: string };
}

@ApiTags('location')
@Controller('trips')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get(':id/location')

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get live driver location', description: 'Returns the current GPS coordinates of the driver for an active trip. Only the rider and driver of the trip can access this. Pass ?history=true to get location history trail.' })
  @ApiResponse({ status: 200, description: 'Driver location coordinates returned.' })
  @ApiResponse({ status: 403, description: 'Not authorized to view this trip location.' })
  @ApiResponse({ status: 404, description: 'Trip not found.' })
  @ApiQuery({ name: 'history', required: false, type: Boolean })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getLocation(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Query('history') history?: string,
    @Query('limit') limit?: string,
  ) {
    // Authorization check
    const trip = await this.locationService.getTripInfo(id);
    if (!trip) {
      return { error: 'Trip not found' };
    }

    if (trip.riderId !== req.user.userId && trip.driverId !== req.user.userId) {
      throw new ForbiddenException('Not authorized to view this location');
    }

    if (history === 'true') {
      const locationLimit = limit ? parseInt(limit, 10) : 100;
      return this.locationService.getLocationHistory(id, locationLimit);
    }

    return this.locationService.getLatestLocation(id);
  }
}
