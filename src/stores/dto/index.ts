import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AddressDto } from '@/locations/dto';
import { UserSummaryDto } from '@/users/dto';
import { ProductPreviewDto } from '@/products/dto';
import { SocialPlatform } from '@/stores/entities/social-media-link.entity';
import { Weekday } from '@/stores/entities/working-hour.entity';

export class MediaDto {
  @ApiProperty({ example: 'https://cdn.example.com/logo.png' })
  @IsString()
  url: string;

  @ApiPropertyOptional({ example: 'Store logo' })
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

export class SocialLinkDto {
  @ApiProperty({ enum: SocialPlatform })
  @IsEnum(SocialPlatform)
  platform: SocialPlatform;

  @ApiProperty({ example: 'https://t.me/yourstore' })
  @IsUrl()
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  label?: string;
}

export class StoreWorkingHourDto {
  @ApiProperty({ enum: Weekday })
  @IsEnum(Weekday)
  day: Weekday;

  @ApiProperty({ example: '09:00' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format. Must be HH:mm',
  })
  open: string;

  @ApiProperty({ example: '13:00' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format. Must be HH:mm',
  })
  close: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  @Max(2)
  interval: number;
}

export class StorePreviewDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ type: MediaDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => MediaDto)
  logo?: MediaDto;

  @ApiProperty({ example: 4.9, description: 'Reputation score (1–5)' })
  @IsNumber()
  reputation: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  isActive: boolean;
}

export class StoreSummaryDto extends StorePreviewDto {
  @ApiPropertyOptional({ example: ['tech', 'fitness'] })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ type: () => [AddressDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  addresses?: AddressDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class StoreDetailDto extends StoreSummaryDto {
  @ApiProperty({ type: UserSummaryDto })
  @ValidateNested()
  @Type(() => UserSummaryDto)
  owner: UserSummaryDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber(undefined)
  contactNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: {
      instagram: 'https://instagram.com/store',
    },
    type: [SocialLinkDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SocialLinkDto)
  socialMediaLinks?: SocialLinkDto[];

  @ApiPropertyOptional({ type: () => [StoreWorkingHourDto] })
  @IsOptional()
  @ValidateNested()
  @Type(() => StoreWorkingHourDto)
  workingHours?: StoreWorkingHourDto[];

  @ApiProperty({ type: [ProductPreviewDto] })
  @ValidateNested({ each: true })
  @Type(() => ProductPreviewDto)
  products: ProductPreviewDto[];

  @ApiProperty()
  @IsDate()
  createdAt: Date;
}

export class CreateStoreBasicDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber(undefined)
  contactNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class CreateStoreTagsDto {
  @ApiPropertyOptional({ isArray: true, example: ['tech', 'fitness'] })
  @IsOptional()
  tags?: string[];
}

export class CreateStoreWorkingHoursDto {
  @ApiPropertyOptional({ type: () => [StoreWorkingHourDto] })
  @IsOptional()
  @ValidateNested()
  @Type(() => StoreWorkingHourDto)
  workingHours?: StoreWorkingHourDto[];
}

export class CreateStoreLogoDto {
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  logoFile?: any;
}

export class UpdateStore {}
