import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { randomInt } from 'crypto';

const OTP_TTL_SECONDS = 300; // 5 minutes
const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 600; // 10 minutes
const RESEND_COOLDOWN_SECONDS = 30;

@Injectable()
export class OtpService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OtpService.name);
  private redis: Redis;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const redisUrl = this.config.get<string>(
      'redis.url',
      'redis://localhost:6379',
    );
    this.redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times: number) {
        if (times > 3) return null;
        return Math.min(times * 200, 1000);
      },
    });

    this.redis.on('connect', () => {
      this.logger.log('Redis connected for OTP service');
    });

    this.redis.on('error', (err: Error) => {
      this.logger.warn(`Redis connection error: ${err.message}`);
    });
  }

  onModuleDestroy() {
    this.redis?.disconnect();
  }

  private otpKey(phone: string): string {
    return `otp:${phone}`;
  }

  private attemptsKey(phone: string): string {
    return `otp:attempts:${phone}`;
  }

  private lockoutKey(phone: string): string {
    return `otp:lockout:${phone}`;
  }

  private cooldownKey(phone: string): string {
    return `otp:cooldown:${phone}`;
  }

  /**
   * Generate and store a 6-digit OTP for the given phone number.
   * Returns the code (for dev/testing) and TTL.
   */
  async generateOtp(
    phone: string,
  ): Promise<{ code: string; expiresIn: number }> {
    // Check lockout
    const isLocked = await this.redis.get(this.lockoutKey(phone));
    if (isLocked) {
      throw new Error(
        'Account locked due to too many failed attempts. Try again later.',
      );
    }

    // Check resend cooldown
    const cooldown = await this.redis.ttl(this.cooldownKey(phone));
    if (cooldown > 0) {
      throw new Error(
        `Please wait ${cooldown} seconds before requesting a new OTP.`,
      );
    }

    const code = randomInt(100000, 999999).toString();

    // Store OTP with TTL
    await this.redis.setex(this.otpKey(phone), OTP_TTL_SECONDS, code);

    // Reset attempts
    await this.redis.setex(this.attemptsKey(phone), OTP_TTL_SECONDS, '0');

    // Set resend cooldown
    await this.redis.setex(
      this.cooldownKey(phone),
      RESEND_COOLDOWN_SECONDS,
      '1',
    );

    this.logger.log(`OTP generated for ${this.maskPhone(phone)}`);

    return { code, expiresIn: OTP_TTL_SECONDS };
  }

  /**
   * Verify the OTP code for a phone number.
   * Returns true if valid, throws on failure.
   */
  async verifyOtp(phone: string, code: string): Promise<boolean> {
    // Check lockout
    const isLocked = await this.redis.get(this.lockoutKey(phone));
    if (isLocked) {
      const ttl = await this.redis.ttl(this.lockoutKey(phone));
      throw new Error(`Account locked. Try again in ${ttl} seconds.`);
    }

    // Get stored OTP
    const storedCode = await this.redis.get(this.otpKey(phone));
    if (!storedCode) {
      throw new Error('OTP expired or not found. Please request a new one.');
    }

    // Check attempts
    const attemptsStr = await this.redis.get(this.attemptsKey(phone));
    const attempts = parseInt(attemptsStr || '0', 10);

    if (attempts >= MAX_ATTEMPTS) {
      // Lock the account
      await this.redis.setex(this.lockoutKey(phone), LOCKOUT_SECONDS, '1');
      await this.redis.del(this.otpKey(phone));
      await this.redis.del(this.attemptsKey(phone));
      throw new Error(
        'Too many failed attempts. Account locked for 10 minutes.',
      );
    }

    if (storedCode !== code) {
      // Increment attempts
      await this.redis.incr(this.attemptsKey(phone));
      await this.redis.expire(this.attemptsKey(phone), OTP_TTL_SECONDS);

      const remaining = MAX_ATTEMPTS - attempts - 1;
      throw new Error(`Invalid OTP. ${remaining} attempts remaining.`);
    }

    // OTP valid — clean up
    await this.redis.del(this.otpKey(phone));
    await this.redis.del(this.attemptsKey(phone));
    await this.redis.del(this.cooldownKey(phone));

    this.logger.log(`OTP verified for ${this.maskPhone(phone)}`);

    return true;
  }

  /**
   * Check if the phone is currently locked out.
   */
  async isLocked(phone: string): Promise<boolean> {
    const isLocked = await this.redis.get(this.lockoutKey(phone));
    return isLocked === '1';
  }

  /**
   * Get remaining cooldown seconds for resend.
   */
  async getResendCooldown(phone: string): Promise<number> {
    const ttl = await this.redis.ttl(this.cooldownKey(phone));
    return ttl > 0 ? ttl : 0;
  }

  private maskPhone(phone: string): string {
    if (phone.length <= 4) return '****';
    return `${phone.slice(0, 3)}****${phone.slice(-2)}`;
  }
}
