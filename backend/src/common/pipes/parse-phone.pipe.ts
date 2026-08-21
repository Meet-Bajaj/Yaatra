import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParsePhonePipe implements PipeTransform<string> {
  transform(value: string): string {
    if (!value) {
      throw new BadRequestException('Phone number is required');
    }

    // Strip spaces, dashes, parentheses
    const cleaned = value.replace(/[\s\-()]/g, '');

    // Must start with + and contain only digits after
    if (!/^\+\d{10,15}$/.test(cleaned)) {
      throw new BadRequestException(
        'Invalid phone number format. Use international format: +91XXXXXXXXXX',
      );
    }

    return cleaned;
  }
}
