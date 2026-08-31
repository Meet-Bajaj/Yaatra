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
import { AuthGuard } from '@nestjs/passport';
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
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get driver profile, badges, rating, online state' })
  @ApiResponse({ status: 200, description: 'Driver profile returned' })
  getProfile(@Req() req: AuthRequest) {
    return this.driverService.getProfile(req.user.userId);
  }

  // ─── Carpool Offers ──────────────────────────────────────────

  @Post('offer')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish carpool commute offer' })
  @ApiResponse({ status: 201, description: 'Offer created' })
  createOffer(@Req() req: AuthRequest, @Body() dto: CreateOfferDto) {
    return this.driverService.createOffer(req.user.userId, dto);
  }

  @Get('offers')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List my carpool offers' })
  getOffers(@Req() req: AuthRequest) {
    return this.driverService.getOffers(req.user.userId);
  }

  @Patch('offers/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update carpool offer (pause/edit)' })
  updateOffer(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdateOfferDto,
  ) {
    return this.driverService.updateOffer(req.user.userId, id, dto);
  }

  @Delete('offers/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete carpool offer' })
  deleteOffer(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.driverService.deleteOffer(req.user.userId, id);
  }

  @Get('offers/:id/requests')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get incoming rider requests for an offer' })
  getOfferRequests(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.driverService.getOfferRequests(req.user.userId, id);
  }

  @Post('requests/:id/accept')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept a rider booking request' })
  acceptRequest(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.driverService.acceptRequest(req.user.userId, id);
  }

  @Post('requests/:id/reject')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a rider booking request' })
  rejectRequest(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.driverService.rejectRequest(req.user.userId, id);
  }

  // ─── Professional Driver — Online/Offline ────────────────────

  @Post('go-online')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Professional driver go online + add to Redis pool',
  })
  @ApiResponse({ status: 200, description: 'Driver is now online' })
  goOnline(@Req() req: AuthRequest, @Body() dto: GoOnlineDto) {
    return this.driverService.goOnline(req.user.userId, dto);
  }

  @Post('go-offline')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Professional driver go offline' })
  goOffline(@Req() req: AuthRequest) {
    return this.driverService.goOffline(req.user.userId);
  }

  @Get('requests')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pooled ride requests (pro driver)' })
  getRequests(@Req() req: AuthRequest) {
    return this.driverService.getProDriverRequests(req.user.userId);
  }

  @Post('accept')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept a trip request (pro driver)' })
  acceptTrip(@Req() req: AuthRequest, @Body() dto: AcceptTripDto) {
    return this.driverService.acceptTrip(req.user.userId, dto.tripId);
  }

  @Post('reject')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a trip request (pro driver)' })
  rejectTrip(@Req() req: AuthRequest, @Body() dto: AcceptTripDto) {
    return this.driverService.rejectTrip(req.user.userId, dto.tripId);
  }

  // ─── Trip Lifecycle ──────────────────────────────────────────

  @Post('trips/:id/arrive')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Driver arrived at pickup location' })
  arriveAtPickup(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.driverService.arriveAtPickup(req.user.userId, id);
  }

  @Post('trips/:id/complete')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Driver completes trip' })
  completeTrip(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.driverService.completeTrip(req.user.userId, id);
  }

  // ─── Earnings ────────────────────────────────────────────────

  @Get('earnings')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get driver earnings overview' })
  getEarnings(@Req() req: AuthRequest) {
    return this.driverService.getEarnings(req.user.userId);
  }
}
