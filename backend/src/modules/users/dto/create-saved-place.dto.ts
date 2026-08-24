import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateSavedPlaceDto {
  @ApiProperty({ enum: ['home', 'work', 'custom'], example: 'home' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ example: 'Home Address' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({ example: '123 MG Road, Bangalore' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  address: string;

  @ApiProperty({ example: 12.9716 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiProperty({ example: 77.5946 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;
}
