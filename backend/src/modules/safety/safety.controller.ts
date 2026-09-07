import { Controller, Post, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SafetyService } from './safety.service';

@ApiTags('safety')
@Controller('safety')
export class SafetyController {
  constructor(private readonly safetyService: SafetyService) {}

  @Post('emergency')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Trigger emergency alert', description: 'Sends an SOS alert to emergency contacts and platform support. Includes user location and trip details. Triggers immediate notification.' })
  @ApiResponse({ status: 201, description: 'Emergency alert sent successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized – valid JWT token required.' })
  emergency() {
    return { message: 'TODO: implement emergency alert' };
  }

  @Post('report')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Report safety issue', description: 'Files a safety incident report against a user, trip, or driver. Report is reviewed by the admin team.' })
  @ApiResponse({ status: 201, description: 'Report submitted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid report data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized – valid JWT token required.' })
  report() {
    return { message: 'TODO: implement report issue' };
  }

  @Get('trust/:userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user trust profile', description: 'Returns the trust score and profile for a user based on completed trips, ratings, and verification status.' })
  @ApiResponse({ status: 200, description: 'Trust profile returned successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  getTrust(@Param('userId') userId: string) {
    return { message: `TODO: implement trust profile for ${userId}` };
  }

  @Post('trip-share/:tripId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Share trip live location', description: 'Generates a time-limited shareable link that lets trusted contacts track the trip in real-time. Link expires when the trip ends.' })
  @ApiResponse({ status: 201, description: 'Share link generated successfully.' })
  @ApiResponse({ status: 404, description: 'Trip not found.' })
  shareTrip(@Param('tripId') tripId: string) {
    return { message: `TODO: implement trip share for ${tripId}` };
  }
}
