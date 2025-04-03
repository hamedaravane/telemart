import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from '@/locations/dto';
import { UserSummaryDto } from '@/users/dto';
import { ProductPreviewDto } from '@/products/dto';

class MediaDto {
  @ApiProperty() @IsString() url: string;
  @ApiPropertyOptional() @IsOptional() @IsString() alt?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() width?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() height?: number;
}

export class StorePreviewDto {
  @ApiProperty() @IsString() id: string | number;

  @ApiProperty() @IsString() name: string;

  @ApiPropertyOptional() @IsOptional() @IsString() slug?: string;

  @ApiPropertyOptional({ type: () => MediaDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => MediaDto)
  logo?: MediaDto;

  @ApiProperty() @IsNumber() reputation: number;

  @ApiProperty() @IsBoolean() isActive: boolean;
}

export class StoreSummaryDto extends StorePreviewDto {
  @ApiPropertyOptional()
  @IsOptional()
  tags?: string[];

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  addresses?: AddressDto[];

  @ApiPropertyOptional()
  @IsOptional()
  description?: string;
}

class WorkingHourDto {
  @ApiProperty() open: string;
  @ApiProperty() close: string;
}

export class StoreDetailDto extends StoreSummaryDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => UserSummaryDto)
  owner: UserSummaryDto;

  @ApiPropertyOptional()
  @IsOptional()
  contactNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  socialMediaLinks?: Record<string, string>;

  @ApiPropertyOptional({ type: () => WorkingHourDto, isArray: true })
  @IsOptional()
  workingHours?: Record<string, WorkingHourDto>;

  @ApiProperty({ type: () => [ProductPreviewDto] })
  @ValidateNested({ each: true })
  @Type(() => ProductPreviewDto)
  products: ProductPreviewDto[];

  @ApiProperty()
  createdAt: Date;
}

export class CreateStoreBasicDto {
  @ApiProperty() @IsString() name: string;

  @ApiProperty() @IsString() description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;
}

export class CreateAddressDto {
  @ApiProperty() @IsNumber() countryId: number;

  @ApiPropertyOptional() @IsOptional() @IsNumber() stateId?: number;

  @ApiPropertyOptional() @IsOptional() @IsNumber() cityId?: number;

  @ApiProperty() @IsString() streetLine1: string;

  @ApiPropertyOptional() @IsOptional() @IsString() streetLine2?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() postalCode?: string;

  @ApiPropertyOptional() @IsOptional() @IsNumber() latitude?: number;

  @ApiPropertyOptional() @IsOptional() @IsNumber() longitude?: number;
}

export class CreateStoreTagsDto {
  @ApiPropertyOptional({ isArray: true, example: ['tech', 'fitness'] })
  @IsOptional()
  tags?: string[];
}

class WorkingHour {
  @ApiPropertyOptional() open: string;
  @ApiPropertyOptional() close: string;
}

export class CreateStoreWorkingHoursDto {
  @ApiPropertyOptional({ type: () => WorkingHour, isArray: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => WorkingHour)
  workingHours?: Record<string, WorkingHour>;
}

export class CreateStoreLogoDto {
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  logoFile?: any;
}

export class UpdateStore {}
