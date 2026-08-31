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
import { AuthGuard } from '@nestjs/passport';
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
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my recurring commute subscriptions' })
  @ApiResponse({ status: 200, description: 'Subscriptions returned' })
  getSchedules(@Req() req: AuthRequest) {
    return this.scheduleService.getMySubscriptions(req.user.userId);
  }

  @Get('matches')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Find matching carpool offers for a route/schedule',
  })
  @ApiResponse({ status: 200, description: 'Matching offers returned' })
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
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Pause/edit a schedule' })
  @ApiResponse({ status: 200, description: 'Schedule updated' })
  updateSchedule(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: { status?: string },
  ) {
    return this.scheduleService.updateSchedule(req.user.userId, id, body);
  }

  @Post('instances/:id/cancel')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a single ride instance' })
  @ApiResponse({ status: 200, description: 'Instance cancelled' })
  cancelInstance(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.scheduleService.cancelInstance(req.user.userId, id);
  }
}
