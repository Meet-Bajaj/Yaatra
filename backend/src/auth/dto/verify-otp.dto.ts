import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Matches,
  IsEnum,
  IsOptional,
} from 'class-validator';

export enum OtpPurpose {
  LOGIN = 'LOGIN',
  VERIFY_DOC = 'VERIFY_DOC',
  RESET = 'RESET',
}

export class VerifyOtpDto {
  @ApiProperty({ example: '+919876543210' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{9,14}$/, {
    message: 'Phone must be in international format: +91XXXXXXXXXX',
  })
  phone: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'OTP must be exactly 6 digits' })
  code: string;

  @ApiProperty({ enum: OtpPurpose, required: false, default: OtpPurpose.LOGIN })
  @IsOptional()
  @IsEnum(OtpPurpose)
  purpose?: OtpPurpose;
}
