import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VehicleService } from './vehicle.service';

@ApiTags('driver-vehicles')
@Controller('driver/vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List driver vehicles' })
  findAll() {
    return { message: 'TODO: implement list vehicles' };
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a vehicle' })
  create() {
    return { message: 'TODO: implement create vehicle' };
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a vehicle' })
  update(@Param('id') id: string) {
    return { message: `TODO: implement update vehicle ${id}` };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a vehicle' })
  remove(@Param('id') id: string) {
    return { message: `TODO: implement delete vehicle ${id}` };
  }
}
