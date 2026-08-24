import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export enum VerificationAction {
  APPROVED = 'PASSED',
  REJECTED = 'FAILED',
}

export class VerifyDocDto {
  @ApiProperty({ enum: VerificationAction })
  @IsEnum(VerificationAction)
  action: VerificationAction;

  @ApiPropertyOptional({ example: 'Document is blurry' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  rejectionReason?: string;
}
