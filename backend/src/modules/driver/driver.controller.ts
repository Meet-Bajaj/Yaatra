import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DriverService } from './driver.service';

@ApiTags('driver')
@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get driver profile' })
  getProfile() {
    return { message: 'TODO: implement driver profile' };
  }

  @Post('offer')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish carpool commute offer' })
  createOffer() {
    return { message: 'TODO: implement create offer' };
  }

  @Get('offers')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List my carpool offers' })
  getOffers() {
    return { message: 'TODO: implement get offers' };
  }

  @Patch('offers/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update carpool offer' })
  updateOffer(@Param('id') id: string) {
    return { message: `TODO: implement update offer ${id}` };
  }

  @Delete('offers/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete carpool offer' })
  deleteOffer(@Param('id') id: string) {
    return { message: `TODO: implement delete offer ${id}` };
  }

  @Get('offers/:id/requests')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get incoming rider requests for an offer' })
  getOfferRequests(@Param('id') id: string) {
    return { message: `TODO: implement get requests for offer ${id}` };
  }

  @Post('requests/:id/accept')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept a rider request' })
  acceptRequest(@Param('id') id: string) {
    return { message: `TODO: implement accept request ${id}` };
  }

  @Post('requests/:id/reject')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a rider request' })
  rejectRequest(@Param('id') id: string) {
    return { message: `TODO: implement reject request ${id}` };
  }

  @Post('go-online')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Professional driver go online' })
  goOnline() {
    return { message: 'TODO: implement go online' };
  }

  @Post('go-offline')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Professional driver go offline' })
  goOffline() {
    return { message: 'TODO: implement go offline' };
  }

  @Get('requests')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pooled ride requests for pro driver' })
  getRequests() {
    return { message: 'TODO: implement get pro driver requests' };
  }

  @Post('accept')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept a trip request (pro driver)' })
  acceptTrip() {
    return { message: 'TODO: implement accept trip' };
  }

  @Post('reject')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a trip request (pro driver)' })
  rejectTrip() {
    return { message: 'TODO: implement reject trip' };
  }

  @Get('earnings')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get driver earnings overview' })
  getEarnings() {
    return { message: 'TODO: implement earnings' };
  }

  @Post('trips/:id/arrive')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Driver arrived at pickup location' })
  arriveAtPickup(@Param('id') id: string) {
    return { message: `TODO: implement arrive at pickup for trip ${id}` };
  }

  @Post('trips/:id/complete')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Driver completes trip' })
  completeTrip(@Param('id') id: string) {
    return { message: `TODO: implement complete trip ${id}` };
  }
}
