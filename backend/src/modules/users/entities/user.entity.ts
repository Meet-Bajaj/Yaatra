import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  email?: string | null;

  @ApiProperty()
  role: string;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional()
  gender?: string | null;

  @ApiPropertyOptional()
  city?: string | null;

  @ApiPropertyOptional()
  avatarUrl?: string | null;

  @ApiPropertyOptional()
  referralCode?: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
