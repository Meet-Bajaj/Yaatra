import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum UserRole {
  RIDER = 'RIDER',
  DRIVER = 'DRIVER',
  CARPOOL = 'CARPOOL',
  PROFESSIONAL = 'PROFESSIONAL',
  BOTH = 'BOTH',
}

export class SetRoleDto {
  @ApiProperty({ enum: UserRole, example: UserRole.RIDER })
  @IsEnum(UserRole)
  role: UserRole;
}
