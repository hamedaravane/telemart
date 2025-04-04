import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../user.entity';
import { AddressDto } from '@/locations/dto';
import { StorePreviewDto } from '@/stores/dto';
import { OrderSummaryDto } from '@/orders/dto';

export class MediaDto {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  alt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  width?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  height?: number;
}

/**
 * Lightweight public-facing preview of a user.
 * Shown in listings, reviews, or product displays.
 */
export class UserPublicPreviewDto {
  @ApiProperty({ description: 'Internal user ID or Telegram ID' })
  @IsString()
  id: number | string;

  @ApiPropertyOptional({ description: 'Telegram username (e.g. @handle)' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ description: 'Optional public handle/alias' })
  @IsOptional()
  @IsString()
  handle?: string;

  @ApiPropertyOptional({ type: () => MediaDto, description: 'User avatar' })
  @IsOptional()
  @Type(() => MediaDto)
  photo?: MediaDto;
}

/**
 * Extended version of public preview — adds name and role info.
 */
export class UserSummaryDto extends UserPublicPreviewDto {
  @ApiProperty({ description: 'First name' })
  @IsString()
  firstName: string;

  @ApiPropertyOptional({ description: 'Last name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ enum: UserRole, description: 'User role' })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    type: () => AddressDto,
    isArray: true,
    description: 'List of associated addresses (optional)',
  })
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  addresses: AddressDto[];
}

/**
 * Full private profile returned to the authenticated user.
 */
export class UserPrivateProfileDto extends UserSummaryDto {
  @ApiProperty({ description: 'Telegram ID (required)', example: '123456789' })
  @IsString()
  telegramId: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsOptional()
  @IsPhoneNumber(undefined)
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'User’s TON wallet address',
    example: 'EQB7UXzFdlf...ABC',
  })
  @IsOptional()
  @IsString()
  walletAddress?: string;

  @ApiPropertyOptional({ type: () => StorePreviewDto, isArray: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => StorePreviewDto)
  stores?: StorePreviewDto[];

  @ApiPropertyOptional({ type: () => OrderSummaryDto, isArray: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrderSummaryDto)
  orders?: OrderSummaryDto[];
}

/**
 * DTO for updating user’s contact + location information.
 * Expected during onboarding or checkout.
 */
export class UpdateContactLocationDto {
  @ApiProperty({ example: '+1234567890' })
  @IsPhoneNumber(undefined)
  phoneNumber: string;

  @ApiProperty({ example: 'alice@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  countryId: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  stateId: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  cityId: number;
}

/**
 * Updates preferred language.
 * Should match Telegram's `language_code` field (e.g. "en", "ru", "fa").
 */
export class UpdateLanguageDto {
  @ApiProperty({ example: 'en' })
  @IsString()
  languageCode: string;
}

/**
 * Updates editable parts of the user’s profile.
 */
export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Alice' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Smith' })
  @IsOptional()
  @IsString()
  lastName?: string;
}
