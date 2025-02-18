import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StoreCategory } from '../categories';

/**
 * STEP 1: Basic Info
 *
 * - Required: name, description
 * - Optional: contactNumber, email
 */
export class CreateStoreBasicDto {
  @ApiProperty({
    description: 'Name of the store',
    maxLength: 100,
    example: 'My Awesome Store',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'A short description of the store',
    example: 'We offer the best products in town.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

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
}

/**
 * STEP 2: Location Info
 *
 * All fields are optional. These can be used to relate to your Country, State, and City entities.
 */
export class CreateStoreLocationDto {
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
}

/**
 * STEP 3: Category Selection
 *
 * The user must choose a category.
 */
export class CreateStoreCategoryDto {
  @ApiProperty({
    description: 'Category of the store',
    enum: StoreCategory,
    example: StoreCategory.ELECTRONICS,
  })
  @IsEnum(StoreCategory, { message: 'Invalid store category' })
  category: StoreCategory;
}

/**
 * STEP 4: Working Hours
 *
 * The working hours are optional. Use a nested DTO to validate time formats.
 */
export class WorkingHourDto {
  @ApiProperty({
    description: 'Opening time in HH:mm format',
    example: '08:00',
  })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid open time format. Use HH:mm format',
  })
  open: string;

  @ApiProperty({
    description: 'Closing time in HH:mm format',
    example: '17:00',
  })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid close time format. Use HH:mm format',
  })
  close: string;
}

export class CreateStoreWorkingHoursDto {
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
}

/**
 * STEP 5: Logo/Photo
 *
 * Expecting a URL (or you might handle file uploads differently via a dedicated file endpoint).
 */
export class CreateStoreLogoDto {
  @ApiProperty({
    description: 'URL for the store logo or photo',
    example: 'https://example.com/logo.png',
  })
  @IsString()
  @IsNotEmpty()
  logoUrl: string;
}
