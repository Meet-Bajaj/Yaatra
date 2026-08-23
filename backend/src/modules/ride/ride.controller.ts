import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RideService } from './ride.service';

@ApiTags('rides')
@Controller('rides')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Get('available')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get available rides (on-demand or scheduled)' })
  getAvailable() {
    return { message: 'TODO: implement available rides search' };
  }

  @Post('book')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Book a ride' })
  bookRide() {
    return { message: 'TODO: implement book ride' };
  }

  @Get('upcoming')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get upcoming rides' })
  getUpcoming() {
    return { message: 'TODO: implement upcoming rides' };
  }

  @Get('history')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get ride history' })
  getHistory() {
    return { message: 'TODO: implement ride history' };
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get ride details' })
  getRide(@Param('id') id: string) {
    return { message: `TODO: implement get ride ${id}` };
  }

  @Post(':id/cancel')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a ride' })
  cancelRide(@Param('id') id: string) {
    return { message: `TODO: implement cancel ride ${id}` };
  }

  @Post(':id/rebook')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rebook a ride' })
  rebookRide(@Param('id') id: string) {
    return { message: `TODO: implement rebook ride ${id}` };
  }
}
