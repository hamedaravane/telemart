import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPhoneNumber,
  Length,
} from 'class-validator';

export class UpdateContactLocationDto {
  @ApiProperty({
    description: 'Phone number with country code',
    example: '+1234567890',
  })
  @IsNotEmpty()
  @IsPhoneNumber(undefined)
  @Length(10, 20)
  phoneNumber: string;

  @ApiProperty({
    description: 'Email address',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Country ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  countryId: number;

  @ApiProperty({
    description: 'State ID',
    example: 10,
  })
  @IsNotEmpty()
  @IsInt()
  stateId: number;

  @ApiProperty({
    description: 'City ID',
    example: 100,
  })
  @IsNotEmpty()
  @IsInt()
  cityId: number;
}
