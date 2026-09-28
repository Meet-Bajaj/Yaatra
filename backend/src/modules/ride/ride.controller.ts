import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { RideService } from './ride.service';
import {
  SearchRidesDto,
  BookRideDto,
  CancelRideDto,
  RideFilter,
} from './dto/book-ride.dto';

interface AuthRequest {
  user: { userId: string; phone: string; role: string };
}

@ApiTags('rides')
@Controller('rides')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Get('available')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Search available rides (on-demand + scheduled)',
    description: 'Search for available on-demand and scheduled rides based on pickup/drop locations, date, and time filters.',
  })
  @ApiResponse({ status: 200, description: 'Ride results returned' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  getAvailable(@Req() req: AuthRequest, @Query() raw: Record<string, string>) {
    const query: SearchRidesDto = {
      pickupLat: parseFloat(raw.pickupLat),
      pickupLng: parseFloat(raw.pickupLng),
      dropLat: parseFloat(raw.dropLat ?? raw.dropoffLat),
      dropLng: parseFloat(raw.dropLng ?? raw.dropoffLng),
      pickupAddress: raw.pickupAddress,
      dropAddress: raw.dropAddress ?? raw.dropoffAddress,
      sortBy: raw.sortBy as any,
      date: raw.date,
      time: raw.time,
      filter:
        raw.womenOnly === 'true'
          ? (RideFilter.WOMEN_ONLY as any)
          : ((raw.filter ?? raw.type)?.toUpperCase() as any),
    };
    return this.rideService.searchAvailable(req.user.userId, query);
  }

  @Post('book')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Book a ride (on-demand or scheduled)',
    description: 'Create a new ride booking. Supports both immediate on-demand rides and future scheduled rides.',
  })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid booking data or ride unavailable' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  bookRide(@Req() req: AuthRequest, @Body() dto: BookRideDto) {
    return this.rideService.bookRide(req.user.userId, dto);
  }

  @Get('upcoming')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get upcoming rides + scheduled bookings',
    description: 'Retrieve all future confirmed rides and active scheduled ride bookings for the current user.',
  })
  @ApiResponse({ status: 200, description: 'Upcoming rides returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  getUpcoming(@Req() req: AuthRequest) {
    return this.rideService.getUpcoming(req.user.userId);
  }

  @Get('history')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get completed/cancelled ride history',
    description: 'Fetch paginated ride history including completed and cancelled rides for the current user.',
  })
  @ApiResponse({ status: 200, description: 'Ride history returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  getHistory(@Req() req: AuthRequest) {
    return this.rideService.getHistory(req.user.userId);
  }

  @Get(':id')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get ride details',
    description: 'Retrieve full details of a specific ride including route, driver info, status, and timeline.',
  })
  @ApiResponse({ status: 200, description: 'Ride details returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  @ApiResponse({ status: 404, description: 'Ride not found' })
  getRide(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.rideService.getRide(req.user.userId, id);
  }

  @Post(':id/cancel')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cancel a ride',
    description: 'Cancel an active or upcoming ride. A cancellation reason is required.',
  })
  @ApiResponse({ status: 200, description: 'Ride cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Ride cannot be cancelled (already completed or in progress)' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  @ApiResponse({ status: 404, description: 'Ride not found' })
  cancelRide(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: CancelRideDto,
  ) {
    return this.rideService.cancelRide(req.user.userId, id, dto.reason);
  }

  @Post(':id/rebook')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Rebook a previous ride',
    description: 'Create a new booking using the route and preferences from a previous ride.',
  })
  @ApiResponse({ status: 201, description: 'New ride created from rebook' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  @ApiResponse({ status: 404, description: 'Original ride not found' })
  rebookRide(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.rideService.rebookRide(req.user.userId, id);
  }
}
