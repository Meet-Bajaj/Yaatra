import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { Public } from '../common/decorators/public.decorator';

interface AuthRequest {
  user: {
    userId: string;
    phone: string;
    role: string;
  };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ─── OTP Endpoints ─────────────────────────────────────────────

  @Post('otp')
  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 requests per minute
  @ApiOperation({
    summary: 'Send OTP to phone number',
    description: 'Generates and sends a one-time password to the provided phone number via SMS.',
  })
  @ApiResponse({ status: 200, description: 'OTP sent successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid phone number format.' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded. Please retry after the cooldown period.' })
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto.phone);
  }

  @Post('verify')
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @ApiOperation({
    summary: 'Verify OTP and get JWT token',
    description: 'Validates the OTP against the stored value and returns a signed JWT access token.',
  })
  @ApiResponse({ status: 200, description: 'OTP verified. Returns access and refresh tokens.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP code.' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('resend-otp')
  @Public()
  @Throttle({ default: { limit: 2, ttl: 60000 } }) // 2 requests per minute
  @ApiOperation({
    summary: 'Resend OTP (30s cooldown)',
    description: 'Generates and sends a new OTP to the phone number. Enforces a 30-second cooldown between requests.',
  })
  @ApiResponse({ status: 200, description: 'OTP resent successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid phone number format.' })
  @ApiResponse({ status: 429, description: 'Cooldown active. Please wait before resending.' })
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.authService.resendOtp(resendOtpDto.phone);
  }

  // ─── Password Flow (admin/web fallback) ────────────────────────

  @Post('register')
  @Public()
  @ApiOperation({
    summary: 'Register a new user (password)',
    description: 'Creates a new user account with phone number and password. Used for admin/web fallback registration.',
  })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Validation failed. Password does not meet requirements.' })
  @ApiResponse({ status: 409, description: 'User already exists with this phone number.' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Public()
  @ApiOperation({
    summary: 'Login with phone and password',
    description: 'Authenticates a user with phone number and password, returning a signed JWT access token.',
  })
  @ApiResponse({ status: 200, description: 'Login successful. Returns access and refresh tokens.' })
  @ApiResponse({ status: 401, description: 'Invalid phone number or password.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // ─── Profile ───────────────────────────────────────────────────

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns the full profile of the currently authenticated user.',
  })
  @ApiResponse({ status: 200, description: 'User profile returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Valid JWT token required.' })
  async getProfile(@Req() req: AuthRequest) {
    return this.authService.validateUserById(req.user.userId);
  }

  @Patch('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update current user profile',
    description: 'Updates the name and/or email of the currently authenticated user.',
  })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Valid JWT token required.' })
  async updateProfile(
    @Req() req: AuthRequest,
    @Body() body: { name?: string; email?: string },
  ) {
    return this.authService.updateProfile(req.user.userId, body);
  }
}
