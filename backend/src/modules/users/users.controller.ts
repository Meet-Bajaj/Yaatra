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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { S3Service } from '../kyc/s3.service';
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
  constructor(
    private readonly usersService: UsersService,
    private readonly s3Service: S3Service,
  ) {}

  // ─── Current User Profile ──────────────────────────────────────

  @Get('me')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns the full profile of the currently authenticated user including saved places and vehicles.',
  })
  @ApiResponse({ status: 200, description: 'User profile returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Valid JWT token required.' })
  getMe(@Req() req: AuthRequest) {
    return this.usersService.getMe(req.user.userId);
  }

  @Patch('me')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update current user profile',
    description: 'Updates profile fields such as name, email, and notification preferences.',
  })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  @ApiResponse({ status: 400, description: 'Validation failed. Check request body.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Valid JWT token required.' })
  updateMe(
    @Req() req: AuthRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.userId, updateProfileDto);
  }

  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({
    summary: 'Upload profile avatar',
    description: 'Uploads an image file (JPEG, PNG, WebP, GIF) as the user profile avatar. Max 5MB.',
  })
  @ApiResponse({ status: 200, description: 'Avatar uploaded and profile updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid file type or file size exceeds 5MB limit.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Valid JWT token required.' })
  async uploadAvatar(
    @Req() req: AuthRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG, PNG, WebP, and GIF images are allowed');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File size must be less than 5MB');
    }

    const result = await this.s3Service.uploadFile(
      { buffer: file.buffer, originalname: file.originalname, mimetype: file.mimetype },
      'avatars',
    );

    return this.usersService.updateProfile(req.user.userId, { avatarUrl: result.url });
  }

  @Delete('me')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Soft-delete own account',
    description: 'Marks the current user account as deleted. The account can be recovered within 30 days.',
  })
  @ApiResponse({ status: 200, description: 'Account soft-deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Valid JWT token required.' })
  removeMe(@Req() req: AuthRequest) {
    return this.usersService.softDelete(req.user.userId);
  }

  // ─── Admin-only User Management ────────────────────────────────

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user by ID (admin)',
    description: 'Retrieves the full profile of any user by their unique identifier. Admin only.',
  })
  @ApiResponse({ status: 200, description: 'User details returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Admin role required.' })
  @ApiResponse({ status: 404, description: 'User not found with the provided ID.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user by ID (admin)',
    description: 'Updates any user profile fields by ID. Admin only.',
  })
  @ApiResponse({ status: 200, description: 'User profile updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Admin role required.' })
  @ApiResponse({ status: 404, description: 'User not found with the provided ID.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateProfileDto) {
    return this.usersService.updateProfile(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Soft-delete user (admin)',
    description: 'Marks a user account as deleted by ID. Admin only. Account can be recovered within 30 days.',
  })
  @ApiResponse({ status: 200, description: 'User soft-deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Admin role required.' })
  @ApiResponse({ status: 404, description: 'User not found with the provided ID.' })
  remove(@Param('id') id: string) {
    return this.usersService.softDelete(id);
  }

  // ─── Role Management ────────────────────────────────────────────

  @Post('me/role')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Set/switch current user role',
    description: 'Switches the current user role between available roles (e.g., PASSENGER, DRIVER).',
  })
  @ApiResponse({ status: 200, description: 'Role switched successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid role specified.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Valid JWT token required.' })
  setRole(@Req() req: AuthRequest, @Body() setRoleDto: SetRoleDto) {
    return this.usersService.setRole(req.user.userId, setRoleDto.role);
  }

  // ─── Emergency Contacts ─────────────────────────────────────────

  @Put('me/emergency-contacts')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update emergency contacts',
    description: 'Replaces the current user emergency contacts list with the provided contacts.',
  })
  @ApiResponse({ status: 200, description: 'Emergency contacts updated successfully.' })
  @ApiResponse({ status: 400, description: 'Validation failed. Check contact details.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Valid JWT token required.' })
  updateEmergencyContacts(
    @Req() req: AuthRequest,
    @Body() dto: EmergencyContactsDto,
  ) {
    return this.usersService.updateEmergencyContacts(req.user.userId, dto);
  }

  // ─── Saved Places ───────────────────────────────────────────────

  @Get('me/places')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get saved places',
    description: 'Returns all saved places (home, work, favorites) for the current user.',
  })
  @ApiResponse({ status: 200, description: 'Saved places list returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Valid JWT token required.' })
  getSavedPlaces(@Req() req: AuthRequest) {
    return this.usersService.getSavedPlaces(req.user.userId);
  }

  @Post('me/places')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add a saved place',
    description: 'Adds a new saved place (home, work, custom) to the current user profile.',
  })
  @ApiResponse({ status: 201, description: 'Saved place created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation failed. Check place details.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Valid JWT token required.' })
  createSavedPlace(@Req() req: AuthRequest, @Body() dto: CreateSavedPlaceDto) {
    return this.usersService.createSavedPlace(req.user.userId, dto);
  }

  @Delete('me/places/:placeId')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a saved place',
    description: 'Removes a saved place from the current user profile by place ID.',
  })
  @ApiResponse({ status: 200, description: 'Saved place deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Valid JWT token required.' })
  @ApiResponse({ status: 404, description: 'Saved place not found.' })
  deleteSavedPlace(@Req() req: AuthRequest, @Param('placeId') placeId: string) {
    return this.usersService.deleteSavedPlace(req.user.userId, placeId);
  }

  // ─── Driver Profile ─────────────────────────────────────────────

  @Get('me/driver-profile')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user driver profile',
    description: 'Returns the driver-specific profile including license info, ratings, and availability status.',
  })
  @ApiResponse({ status: 200, description: 'Driver profile returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Valid JWT token required.' })
  @ApiResponse({ status: 404, description: 'Driver profile not found. User may not be registered as a driver.' })
  getDriverProfile(@Req() req: AuthRequest) {
    return this.usersService.getDriverProfile(req.user.userId);
  }

  @Get('me/earnings')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get driver earnings overview',
    description: 'Returns the driver earnings summary including today, this week, and total earnings.',
  })
  @ApiResponse({ status: 200, description: 'Driver earnings overview returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Valid JWT token required.' })
  @ApiResponse({ status: 404, description: 'No earnings data found. User may not be registered as a driver.' })
  getDriverEarnings(@Req() req: AuthRequest) {
    return this.usersService.getDriverEarnings(req.user.userId);
  }

  // ─── Driver Vehicles ────────────────────────────────────────────

  @Get('me/vehicles')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user vehicles',
    description: 'Returns all vehicles registered to the current driver user.',
  })
  @ApiResponse({ status: 200, description: 'Vehicle list returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Valid JWT token required.' })
  getVehicles(@Req() req: AuthRequest) {
    return this.usersService.getDriverVehicles(req.user.userId);
  }

  @Post('me/vehicles')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add a vehicle',
    description: 'Registers a new vehicle to the current driver account with make, model, and license plate.',
  })
  @ApiResponse({ status: 201, description: 'Vehicle added successfully.' })
  @ApiResponse({ status: 400, description: 'Validation failed. Check vehicle details.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Valid JWT token required.' })
  createVehicle(@Req() req: AuthRequest, @Body() dto: CreateVehicleDto) {
    return this.usersService.createVehicle(req.user.userId, dto);
  }

  @Patch('me/vehicles/:vehicleId')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a vehicle',
    description: 'Updates vehicle details (make, model, license plate, color) by vehicle ID.',
  })
  @ApiResponse({ status: 200, description: 'Vehicle updated successfully.' })
  @ApiResponse({ status: 400, description: 'Validation failed. Check vehicle details.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Valid JWT token required.' })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  updateVehicle(
    @Req() req: AuthRequest,
    @Param('vehicleId') vehicleId: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    return this.usersService.updateVehicle(req.user.userId, vehicleId, dto);
  }

  @Delete('me/vehicles/:vehicleId')

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a vehicle',
    description: 'Removes a vehicle from the current driver account by vehicle ID.',
  })
  @ApiResponse({ status: 200, description: 'Vehicle deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Valid JWT token required.' })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  deleteVehicle(
    @Req() req: AuthRequest,
    @Param('vehicleId') vehicleId: string,
  ) {
    return this.usersService.deleteVehicle(req.user.userId, vehicleId);
  }
}
