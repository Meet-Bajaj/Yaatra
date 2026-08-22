import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LocationService } from './location.service';

@ApiTags('location')
@Controller('trips')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get(':id/location')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get live location of a trip' })
  getLocation(@Param('id') id: string) {
    return { message: `TODO: implement get location for trip ${id}` };
  }
}
