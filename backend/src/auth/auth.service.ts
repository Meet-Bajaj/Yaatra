import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { OtpService } from './otp.service';
import { SmsService } from './sms.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly smsService: SmsService,
  ) {}

  // ─── OTP Flow ─────────────────────────────────────────────────

  async sendOtp(phone: string) {
    const { code } = await this.otpService.generateOtp(phone);
    await this.smsService.sendOtp(phone, code);

    return {
      message: 'OTP sent successfully',
      phone: this.maskPhone(phone),
      expiresIn: 300,
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { phone, code } = verifyOtpDto;

    await this.otpService.verifyOtp(phone, code);

    // Upsert user by phone
    let user = await this.prisma.user.findUnique({
      where: { phone },
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    let isNewUser = false;

    if (!user) {
      // Create new user with default role
      user = await this.prisma.user.create({
        data: {
          phone,
          name: `User ${phone.slice(-4)}`,
          role: 'RIDER',
        },
        select: {
          id: true,
          phone: true,
          name: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      isNewUser = true;

      // Create wallet for new user
      await this.prisma.wallet.create({
        data: { userId: user.id },
      });
    }

    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException('Account is not active');
    }

    const payload = { sub: user.id, phone: user.phone, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      user,
      access_token,
      isNewUser,
    };
  }

  async resendOtp(phone: string) {
    const cooldown = await this.otpService.getResendCooldown(phone);
    if (cooldown > 0) {
      throw new BadRequestException(
        `Please wait ${cooldown} seconds before requesting a new OTP`,
      );
    }

    const { code } = await this.otpService.generateOtp(phone);
    await this.smsService.sendOtp(phone, code);

    return {
      message: 'OTP resent successfully',
      phone: this.maskPhone(phone),
      expiresIn: 300,
    };
  }

  // ─── Password Flow (admin/web fallback) ───────────────────────

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { phone: registerDto.phone },
    });

    if (existingUser) {
      throw new ConflictException('User with this phone number already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        phone: registerDto.phone,
        name: registerDto.name,
        email: registerDto.email,
        role: registerDto.role,
        password: hashedPassword,
      },
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const payload = { sub: user.id, phone: user.phone, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return { user, access_token };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { phone: loginDto.phone },
      omit: { password: false },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException('Account is not active');
    }

    const { password: _, ...userWithoutPassword } = user;

    const payload = { sub: user.id, phone: user.phone, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return { user: userWithoutPassword, access_token };
  }

  async validateUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        role: true,
        status: true,
        gender: true,
        city: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, data: { name?: string; email?: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });
  }

  private maskPhone(phone: string): string {
    if (phone.length <= 4) return '****';
    return `${phone.slice(0, 3)}****${phone.slice(-2)}`;
  }
}
