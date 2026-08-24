import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum UserRole {
  RIDER = 'RIDER',
  CARPOOL = 'CARPOOL',
  PROFESSIONAL = 'PROFESSIONAL',
  BOTH = 'BOTH',
  ADMIN = 'ADMIN',
}

export class SetRoleDto {
  @ApiProperty({ enum: UserRole, example: UserRole.RIDER })
  @IsEnum(UserRole)
  role: UserRole;
}
