import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StoreCategory } from '../categories';

export class WorkingHourDto {
  @ApiPropertyOptional({
    description: 'Opening time in HH:mm format',
    example: '08:00',
  })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid open time format. Use HH:mm format',
  })
  open: string;

  @ApiPropertyOptional({
    description: 'Closing time in HH:mm format',
    example: '17:00',
  })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid close time format. Use HH:mm format',
  })
  close: string;
}

export class UpdateStoreDto {
  @ApiPropertyOptional({
    description: 'Name of the store',
    maxLength: 100,
    example: 'My Awesome Store',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'A short description of the store',
    example: 'We offer the best products in town.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Contact number for the store',
    example: '+1-555-1234567',
  })
  @IsOptional()
  @IsString()
  contactNumber?: string;

  @ApiPropertyOptional({
    description: 'Contact email for the store',
    example: 'contact@mystore.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Country identifier (ID)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  country?: number;

  @ApiPropertyOptional({
    description: 'State identifier (ID)',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  state?: number;

  @ApiPropertyOptional({
    description: 'City identifier (ID)',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  city?: number;

  @ApiPropertyOptional({
    description:
      'Working hours for the store. Provide an object where keys represent the day (e.g., "monday") and values are working hours.',
    example: {
      monday: { open: '08:00', close: '17:00' },
      tuesday: { open: '08:00', close: '17:00' },
    },
  })
  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => WorkingHourDto)
  workingHours?: Record<string, WorkingHourDto>;

  @ApiPropertyOptional({
    description: 'Category of the store',
    enum: StoreCategory,
    example: StoreCategory.ELECTRONICS,
  })
  @IsOptional()
  @IsEnum(StoreCategory, { message: 'Invalid store category' })
  category?: StoreCategory;

  @ApiPropertyOptional({
    description: 'URL for the store logo or photo',
    example: 'https://example.com/logo.png',
  })
  @IsOptional()
  @IsString()
  logoUrl?: string;
}
