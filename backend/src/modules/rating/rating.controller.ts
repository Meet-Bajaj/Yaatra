import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { RatingService } from './rating.service';

interface AuthRequest {
  user: { userId: string; phone: string; role: string };
}

@ApiTags('ratings')
@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a rating', description: 'Rates a completed trip with a score (1–5), optional comment, and tags. Both rider and driver can rate each other after trip completion.' })
  @ApiResponse({ status: 201, description: 'Rating submitted successfully.' })
  @ApiResponse({ status: 409, description: 'You have already rated this trip.' })
  create(
    @Req() req: AuthRequest,
    @Body()
    body: {
      revieweeId: string;
      tripId?: string;
      rideInstanceId?: string;
      score: number;
      comment?: string;
      tags?: string[];
    },
  ) {
    return this.ratingService.create(req.user.userId, body);
  }

  @Get('user/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user ratings', description: 'Returns all ratings received by a user, including average score, total count, and individual review details.' })
  @ApiResponse({ status: 200, description: 'User ratings returned successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  getUserRatings(@Param('id') id: string) {
    return this.ratingService.getUserRatings(id);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all ratings', description: 'Returns all ratings in the system. Admin-only endpoint for platform moderation.' })
  @ApiResponse({ status: 200, description: 'Ratings list returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized – valid JWT token required.' })
  findAll() {
    return this.ratingService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get rating by ID', description: 'Returns a single rating record with reviewer, reviewee, score, and comment details.' })
  @ApiResponse({ status: 200, description: 'Rating returned successfully.' })
  @ApiResponse({ status: 404, description: 'Rating not found.' })
  findOne(@Param('id') id: string) {
    return this.ratingService.findOne(id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a rating', description: 'Deletes a rating by ID. Admin-only operation for moderation purposes.' })
  @ApiResponse({ status: 200, description: 'Rating deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Rating not found.' })
  remove(@Param('id') id: string) {
    return this.ratingService.remove(id);
  }
}
