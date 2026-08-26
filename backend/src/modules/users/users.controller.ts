import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { EmergencyContactsDto } from './dto/emergency-contacts.dto';
import { CreateSavedPlaceDto } from './dto/create-saved-place.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { SetRoleDto } from './dto/set-role.dto';

interface AuthRequest {
  user: { userId: string; phone: string; role: string };
}

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ─── Current User Profile ──────────────────────────────────────

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  getMe(@Req() req: AuthRequest) {
    return this.usersService.getMe(req.user.userId);
  }

  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  updateMe(
    @Req() req: AuthRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.userId, updateProfileDto);
  }

  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft-delete own account' })
  removeMe(@Req() req: AuthRequest) {
    return this.usersService.softDelete(req.user.userId);
  }

  // ─── Admin-only User Management ────────────────────────────────

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID (admin)' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user by ID (admin)' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateProfileDto) {
    return this.usersService.updateProfile(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft-delete user (admin)' })
  remove(@Param('id') id: string) {
    return this.usersService.softDelete(id);
  }

  // ─── Role Management ────────────────────────────────────────────

  @Post('me/role')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set/switch current user role' })
  setRole(@Req() req: AuthRequest, @Body() setRoleDto: SetRoleDto) {
    return this.usersService.setRole(req.user.userId, setRoleDto.role);
  }

  // ─── Emergency Contacts ─────────────────────────────────────────

  @Put('me/emergency-contacts')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update emergency contacts' })
  updateEmergencyContacts(
    @Req() req: AuthRequest,
    @Body() dto: EmergencyContactsDto,
  ) {
    return this.usersService.updateEmergencyContacts(req.user.userId, dto);
  }

  // ─── Saved Places ───────────────────────────────────────────────

  @Get('me/places')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get saved places' })
  getSavedPlaces(@Req() req: AuthRequest) {
    return this.usersService.getSavedPlaces(req.user.userId);
  }

  @Post('me/places')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a saved place' })
  createSavedPlace(@Req() req: AuthRequest, @Body() dto: CreateSavedPlaceDto) {
    return this.usersService.createSavedPlace(req.user.userId, dto);
  }

  @Delete('me/places/:placeId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a saved place' })
  deleteSavedPlace(@Req() req: AuthRequest, @Param('placeId') placeId: string) {
    return this.usersService.deleteSavedPlace(req.user.userId, placeId);
  }

  // ─── Driver Profile ─────────────────────────────────────────────

  @Get('me/driver-profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user driver profile' })
  getDriverProfile(@Req() req: AuthRequest) {
    return this.usersService.getDriverProfile(req.user.userId);
  }

  @Get('me/earnings')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get driver earnings overview' })
  getDriverEarnings(@Req() req: AuthRequest) {
    return this.usersService.getDriverEarnings(req.user.userId);
  }

  // ─── Driver Vehicles ────────────────────────────────────────────

  @Get('me/vehicles')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user vehicles' })
  getVehicles(@Req() req: AuthRequest) {
    return this.usersService.getDriverVehicles(req.user.userId);
  }

  @Post('me/vehicles')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a vehicle' })
  createVehicle(@Req() req: AuthRequest, @Body() dto: CreateVehicleDto) {
    return this.usersService.createVehicle(req.user.userId, dto);
  }

  @Patch('me/vehicles/:vehicleId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a vehicle' })
  updateVehicle(
    @Req() req: AuthRequest,
    @Param('vehicleId') vehicleId: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    return this.usersService.updateVehicle(req.user.userId, vehicleId, dto);
  }

  @Delete('me/vehicles/:vehicleId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a vehicle' })
  deleteVehicle(
    @Req() req: AuthRequest,
    @Param('vehicleId') vehicleId: string,
  ) {
    return this.usersService.deleteVehicle(req.user.userId, vehicleId);
  }
}
