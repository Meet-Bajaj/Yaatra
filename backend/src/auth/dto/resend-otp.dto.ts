import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class ResendOtpDto {
  @ApiProperty({ example: '+919876543210' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{9,14}$/, {
    message: 'Phone must be in international format: +91XXXXXXXXXX',
  })
  phone: string;
}
