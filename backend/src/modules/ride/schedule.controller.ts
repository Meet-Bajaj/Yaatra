import { Controller, Get, Patch, Post, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ScheduleService } from './schedule.service';

@ApiTags('ride-schedules')
@Controller('rides/schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my recurring commute subscriptions' })
  getSchedules() {
    return { message: 'TODO: implement get schedules' };
  }

  @Get('matches')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Find matching carpool offers for a route/schedule',
  })
  getMatches() {
    return { message: 'TODO: implement schedule matches' };
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Pause/edit/cancel a schedule' })
  updateSchedule(@Param('id') id: string) {
    return { message: `TODO: implement update schedule ${id}` };
  }

  @Post('instances/:id/cancel')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a single occurrence' })
  cancelInstance(@Param('id') id: string) {
    return { message: `TODO: implement cancel instance ${id}` };
  }
}
