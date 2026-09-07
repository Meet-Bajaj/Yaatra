import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
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
import { ScheduleService } from './schedule.service';

interface AuthRequest {
  user: { userId: string; phone: string; role: string };
}

@ApiTags('ride-schedules')
@Controller('rides/schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get my recurring commute subscriptions',
    description: 'Retrieve all active and paused scheduled ride subscriptions for the current user.',
  })
  @ApiResponse({ status: 200, description: 'Scheduled rides returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  getSchedules(@Req() req: AuthRequest) {
    return this.scheduleService.getMySubscriptions(req.user.userId);
  }

  @Get('matches')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Find matching carpool offers for a route/schedule',
    description: 'Search for available carpool offers that match the given pickup/drop locations and optional date/time.',
  })
  @ApiResponse({ status: 200, description: 'Matching offers returned' })
  @ApiResponse({ status: 400, description: 'Invalid location parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  getMatches(
    @Req() req: AuthRequest,
    @Query('pickupLat') pickupLat: string,
    @Query('pickupLng') pickupLng: string,
    @Query('dropLat') dropLat: string,
    @Query('dropLng') dropLng: string,
    @Query('date') date?: string,
    @Query('time') time?: string,
  ) {
    return this.scheduleService.findMatches(
      req.user.userId,
      parseFloat(pickupLat),
      parseFloat(pickupLng),
      parseFloat(dropLat),
      parseFloat(dropLng),
      date,
      time,
    );
  }

  @Patch(':id')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Pause/edit a schedule',
    description: 'Update a scheduled ride subscription – pause, resume, or modify schedule parameters.',
  })
  @ApiResponse({ status: 200, description: 'Schedule updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid update payload' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  updateSchedule(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: { status?: string },
  ) {
    return this.scheduleService.updateSchedule(req.user.userId, id, body);
  }

  @Post('instances/:id/cancel')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cancel a single ride instance',
    description: 'Cancel one specific instance of a scheduled ride without affecting the overall subscription.',
  })
  @ApiResponse({ status: 200, description: 'Ride instance cancelled' })
  @ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid token' })
  @ApiResponse({ status: 404, description: 'Ride instance not found' })
  cancelInstance(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.scheduleService.cancelInstance(req.user.userId, id);
  }
}
