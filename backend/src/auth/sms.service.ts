import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Twilio from 'twilio';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private twilioClient: Twilio.Twilio | null = null;
  private fromNumber: string;

  constructor(private readonly config: ConfigService) {
    const accountSid = this.config.get<string>('twilio.accountSid');
    const authToken = this.config.get<string>('twilio.authToken');
    this.fromNumber = this.config.get<string>('twilio.fromNumber', '');

    if (accountSid && authToken) {
      this.twilioClient = Twilio(accountSid, authToken);
      this.logger.log('Twilio SMS service initialized');
    } else {
      this.logger.warn(
        'Twilio credentials not configured — SMS will be logged only',
      );
    }
  }

  async sendOtp(phone: string, code: string): Promise<boolean> {
    const message = `Your Yaatra verification code is: ${code}. Valid for 5 minutes. Do not share this code.`;

    if (this.twilioClient && this.fromNumber) {
      try {
        await this.twilioClient.messages.create({
          body: message,
          from: this.fromNumber,
          to: phone,
        });
        this.logger.log(`SMS sent to ${this.maskPhone(phone)}`);
        return true;
      } catch (err) {
        const error = err as Error;
        this.logger.error(
          `SMS failed to ${this.maskPhone(phone)}: ${error.message}`,
        );
        // Fall through to dev mode logging
      }
    }

    // Dev mode — log the OTP
    this.logger.log(`[DEV] OTP for ${this.maskPhone(phone)}: ${code}`);
    return true;
  }

  private maskPhone(phone: string): string {
    if (phone.length <= 4) return '****';
    return `${phone.slice(0, 3)}****${phone.slice(-2)}`;
  }
}
