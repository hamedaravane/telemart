import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../user.entity';
import { AddressDto } from '@/locations/dto';
import { StorePreviewDto } from '@/stores/dto';
import { OrderSummaryDto } from '@/orders/dto';

export class UserPublicPreviewDto {
  @ApiProperty()
  @IsString()
  id: number | string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  handle?: string;

  @ApiPropertyOptional({
    example: {
      url: 'https://example.com/avatar.jpg',
      alt: 'Profile Photo',
    },
  })
  @IsOptional()
  photo?: {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  };
}

export class UserSummaryDto extends UserPublicPreviewDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ type: () => AddressDto })
  @Type(() => AddressDto)
  address: AddressDto;
}

export class UserPrivateProfileDto extends UserSummaryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telegramId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  walletAddress?: string;

  @ApiPropertyOptional({ type: () => [StorePreviewDto] })
  @IsOptional()
  @Type(() => StorePreviewDto)
  stores?: StorePreviewDto[];

  @ApiPropertyOptional({ type: () => [OrderSummaryDto] })
  @IsOptional()
  @Type(() => OrderSummaryDto)
  orders?: OrderSummaryDto[];
}

export class UpdateContactLocationDto {
  @ApiProperty()
  @IsPhoneNumber(undefined)
  phoneNumber: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNumber()
  countryId: number;

  @ApiProperty()
  @IsNumber()
  stateId: number;

  @ApiProperty()
  @IsNumber()
  cityId: number;
}

export class UpdateLanguageDto {
  @ApiProperty()
  @IsString()
  languageCode: string;
}

export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;
}
