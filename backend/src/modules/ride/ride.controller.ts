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
import { AuthGuard } from '@nestjs/passport';
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
} from './dto/book-ride.dto';

interface AuthRequest {
  user: { userId: string; phone: string; role: string };
}

@ApiTags('rides')
@Controller('rides')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Get('available')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search available rides (on-demand + scheduled)' })
  @ApiResponse({ status: 200, description: 'Ride results returned' })
  getAvailable(@Req() req: AuthRequest, @Query() query: SearchRidesDto) {
    return this.rideService.searchAvailable(req.user.userId, query);
  }

  @Post('book')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Book a ride (on-demand or scheduled)' })
  @ApiResponse({ status: 201, description: 'Booking created' })
  bookRide(@Req() req: AuthRequest, @Body() dto: BookRideDto) {
    return this.rideService.bookRide(req.user.userId, dto);
  }

  @Get('upcoming')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get upcoming rides + scheduled bookings' })
  getUpcoming(@Req() req: AuthRequest) {
    return this.rideService.getUpcoming(req.user.userId);
  }

  @Get('history')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get completed/cancelled ride history' })
  getHistory(@Req() req: AuthRequest) {
    return this.rideService.getHistory(req.user.userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get ride details' })
  @ApiResponse({ status: 200, description: 'Trip details returned' })
  getRide(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.rideService.getRide(req.user.userId, id);
  }

  @Post(':id/cancel')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a ride' })
  @ApiResponse({ status: 200, description: 'Trip cancelled' })
  cancelRide(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: CancelRideDto,
  ) {
    return this.rideService.cancelRide(req.user.userId, id, dto.reason);
  }

  @Post(':id/rebook')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rebook a previous ride' })
  @ApiResponse({ status: 201, description: 'New trip created from rebook' })
  rebookRide(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.rideService.rebookRide(req.user.userId, id);
  }
}
