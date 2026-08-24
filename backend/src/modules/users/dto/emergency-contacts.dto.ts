import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  ValidateNested,
  IsString,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

class EmergencyContactDto {
  @ApiProperty({ example: '+919876543210' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Mom' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  label: string;
}

export class EmergencyContactsDto {
  @ApiProperty({ type: [EmergencyContactDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmergencyContactDto)
  contacts: EmergencyContactDto[];
}
