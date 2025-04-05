import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AddressDto } from '@/locations/dto';
import { UserSummaryDto } from '@/users/dto';
import { ProductPreviewDto } from '@/products/dto';
import { SocialPlatform } from '@/stores/entities/social-media-link.entity';

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

export class WorkingHourDto {
  @ApiProperty({ example: '09:00' })
  @IsString()
  open: string;

  @ApiProperty({ example: '18:00' })
  @IsString()
  close: string;
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

  @ApiPropertyOptional({ type: () => WorkingHourDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => WorkingHourDto)
  workingHours?: Record<string, WorkingHourDto>;

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
  @ApiPropertyOptional({
    type: () => WorkingHourDto,
    example: {
      monday: { open: '09:00', close: '18:00' },
      sunday: { open: '11:00', close: '15:00' },
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => WorkingHourDto)
  workingHours?: Record<string, WorkingHourDto>;
}

export class CreateStoreLogoDto {
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  logoFile?: any;
}

export class UpdateStore {
  // You can define patchable fields for admin panel later
}
