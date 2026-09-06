import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { DriverService } from './driver.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { GoOnlineDto, AcceptTripDto } from './dto/go-online.dto';

interface AuthRequest {
  user: { userId: string; phone: string; role: string };
}

@ApiTags('driver')
@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  // ─── Profile ─────────────────────────────────────────────────

  @Get('profile')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get driver profile, badges, rating, online state',
    description: 'Retrieve the current driver\'s profile including badges, average rating, and online/offline status.',
  })
  @ApiResponse({ status: 200, description: 'Driver profile returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  getProfile(@Req() req: AuthRequest) {
    return this.driverService.getProfile(req.user.userId);
  }

  // ─── Carpool Offers ──────────────────────────────────────────

  @Post('offer')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Publish carpool commute offer',
    description: 'Create a new recurring carpool offer for a commute route with schedule details.',
  })
  @ApiResponse({ status: 201, description: 'Offer created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid offer data' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  createOffer(@Req() req: AuthRequest, @Body() dto: CreateOfferDto) {
    return this.driverService.createOffer(req.user.userId, dto);
  }

  @Get('offers')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List my carpool offers',
    description: 'Retrieve all active and inactive carpool offers created by the current driver.',
  })
  @ApiResponse({ status: 200, description: 'Driver offers returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  getOffers(@Req() req: AuthRequest) {
    return this.driverService.getOffers(req.user.userId);
  }

  @Patch('offers/:id')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update carpool offer (pause/edit)',
    description: 'Modify an existing carpool offer – update route, schedule, seats, or pause/resume it.',
  })
  @ApiResponse({ status: 200, description: 'Offer updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid update data' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  @ApiResponse({ status: 404, description: 'Offer not found' })
  updateOffer(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdateOfferDto,
  ) {
    return this.driverService.updateOffer(req.user.userId, id, dto);
  }

  @Delete('offers/:id')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cancel a ride offer',
    description: 'Permanently cancel and remove a carpool offer. Booked riders will be notified.',
  })
  @ApiResponse({ status: 200, description: 'Offer cancelled successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  @ApiResponse({ status: 404, description: 'Offer not found' })
  deleteOffer(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.driverService.deleteOffer(req.user.userId, id);
  }

  @Get('offers/:id/requests')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get booking requests for an offer',
    description: 'Retrieve all pending, accepted, and rejected rider booking requests for a specific carpool offer.',
  })
  @ApiResponse({ status: 200, description: 'Booking requests returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  @ApiResponse({ status: 404, description: 'Offer not found' })
  getOfferRequests(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.driverService.getOfferRequests(req.user.userId, id);
  }

  @Post('requests/:id/accept')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Accept a booking request',
    description: 'Accept a rider\'s booking request for a carpool offer. The rider will be notified of acceptance.',
  })
  @ApiResponse({ status: 200, description: 'Booking request accepted' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  @ApiResponse({ status: 404, description: 'Booking request not found' })
  acceptRequest(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.driverService.acceptRequest(req.user.userId, id);
  }

  @Post('requests/:id/reject')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Reject a booking request',
    description: 'Reject a rider\'s booking request for a carpool offer. The rider will be notified of rejection.',
  })
  @ApiResponse({ status: 200, description: 'Booking request rejected' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  @ApiResponse({ status: 404, description: 'Booking request not found' })
  rejectRequest(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.driverService.rejectRequest(req.user.userId, id);
  }

  // ─── Professional Driver — Online/Offline ────────────────────

  @Post('go-online')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Professional driver go online + add to Redis pool',
    description: 'Set the driver\'s status to online and register them in the location-based ride matching pool.',
  })
  @ApiResponse({ status: 200, description: 'Driver is now online' })
  @ApiResponse({ status: 400, description: 'Invalid zone or location data' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  goOnline(@Req() req: AuthRequest, @Body() dto: GoOnlineDto) {
    return this.driverService.goOnline(req.user.userId, dto);
  }

  @Post('go-offline')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Professional driver go offline',
    description: 'Set the driver\'s status to offline and remove them from the ride matching pool.',
  })
  @ApiResponse({ status: 200, description: 'Driver is now offline' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  goOffline(@Req() req: AuthRequest) {
    return this.driverService.goOffline(req.user.userId);
  }

  @Get('requests')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all incoming ride requests',
    description: 'Retrieve all pending on-demand ride requests available to the professional driver from the matching pool.',
  })
  @ApiResponse({ status: 200, description: 'Ride requests returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  getRequests(@Req() req: AuthRequest) {
    return this.driverService.getProDriverRequests(req.user.userId);
  }

  @Post('accept')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Accept an on-demand ride request',
    description: 'Accept an available on-demand ride request. The rider is notified and trip status changes to accepted.',
  })
  @ApiResponse({ status: 200, description: 'Trip accepted successfully' })
  @ApiResponse({ status: 400, description: 'Trip no longer available' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  acceptTrip(@Req() req: AuthRequest, @Body() dto: AcceptTripDto) {
    return this.driverService.acceptTrip(req.user.userId, dto.tripId);
  }

  @Post('reject')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Reject an on-demand ride request',
    description: 'Reject an available on-demand ride request. The request returns to the pool for other drivers.',
  })
  @ApiResponse({ status: 200, description: 'Trip rejected successfully' })
  @ApiResponse({ status: 400, description: 'Trip no longer available' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  rejectTrip(@Req() req: AuthRequest, @Body() dto: AcceptTripDto) {
    return this.driverService.rejectTrip(req.user.userId, dto.tripId);
  }

  // ─── Trip Lifecycle ──────────────────────────────────────────

  @Post('trips/:id/arrive')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Mark arrival at pickup',
    description: 'Notify the rider that the driver has arrived at the pickup location. Trip status updates to arrived.',
  })
  @ApiResponse({ status: 200, description: 'Arrival confirmed' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  arriveAtPickup(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.driverService.arriveAtPickup(req.user.userId, id);
  }

  @Post('trips/:id/complete')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Complete an ongoing trip',
    description: 'Mark the trip as completed after reaching the drop-off location. Fare is calculated and payment processed.',
  })
  @ApiResponse({ status: 200, description: 'Trip completed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  completeTrip(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.driverService.completeTrip(req.user.userId, id);
  }

  // ─── Earnings ────────────────────────────────────────────────

  @Get('earnings')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get driver earnings summary',
    description: 'Retrieve the driver\'s earnings overview including total earnings, trips completed, and period breakdowns.',
  })
  @ApiResponse({ status: 200, description: 'Earnings summary returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  getEarnings(@Req() req: AuthRequest) {
    return this.driverService.getEarnings(req.user.userId);
  }
}
