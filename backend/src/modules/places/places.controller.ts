import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PlacesService } from './places.service';

@ApiTags('places')
@Controller('users/me/places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get saved places' })
  findAll() {
    return { message: 'TODO: implement get saved places' };
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a saved place' })
  create() {
    return { message: 'TODO: implement add place' };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a saved place' })
  remove(@Param('id') id: string) {
    return { message: `TODO: implement delete place ${id}` };
  }
}
