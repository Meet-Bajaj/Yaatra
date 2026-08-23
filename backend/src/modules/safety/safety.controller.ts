import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SafetyService } from './safety.service';

@ApiTags('safety')
@Controller('safety')
export class SafetyController {
  constructor(private readonly safetyService: SafetyService) {}

  @Post('emergency')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Trigger emergency alert' })
  emergency() {
    return { message: 'TODO: implement emergency alert' };
  }

  @Post('report')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Report a safety issue' })
  report() {
    return { message: 'TODO: implement report issue' };
  }

  @Get('trust/:userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user trust profile' })
  getTrust(@Param('userId') userId: string) {
    return { message: `TODO: implement trust profile for ${userId}` };
  }

  @Post('trip-share/:tripId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate shareable trip link' })
  shareTrip(@Param('tripId') tripId: string) {
    return { message: `TODO: implement trip share for ${tripId}` };
  }
}
