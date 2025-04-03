import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressType } from '../entities/address.entity';

export class CanonicalLocationDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: ['country', 'state', 'city'] })
  @IsEnum(['country', 'state', 'city'])
  type: 'country' | 'state' | 'city';

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  parentId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  longitude?: number;
}

export class AddressDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({ type: () => CanonicalLocationDto })
  @ValidateNested()
  @Type(() => CanonicalLocationDto)
  country: CanonicalLocationDto;

  @ApiPropertyOptional({ type: () => CanonicalLocationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CanonicalLocationDto)
  state?: CanonicalLocationDto;

  @ApiPropertyOptional({ type: () => CanonicalLocationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CanonicalLocationDto)
  city?: CanonicalLocationDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullText?: string;

  @ApiProperty()
  @IsString()
  streetLine1: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  streetLine2?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  longitude: number;

  @ApiProperty({ enum: AddressType })
  @IsEnum(AddressType)
  type: AddressType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty()
  @IsDate()
  createdAt: Date;
}

export class RegionFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  countryId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  stateId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  cityId?: number;
}

class GeoCenter {
  @ApiProperty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  longitude: number;
}

export class GeoFilterDto {
  @ApiProperty({ type: () => GeoCenter })
  @ValidateNested()
  @Type(() => GeoCenter)
  center: GeoCenter;

  @ApiProperty()
  @IsNumber()
  radiusKm: number;
}

export class NearestLocationResponseDto {
  @ApiProperty({ type: () => CanonicalLocationDto })
  @ValidateNested()
  @Type(() => CanonicalLocationDto)
  country: CanonicalLocationDto;

  @ApiProperty({ type: () => CanonicalLocationDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CanonicalLocationDto)
  state?: CanonicalLocationDto;

  @ApiProperty({ type: () => CanonicalLocationDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CanonicalLocationDto)
  city?: CanonicalLocationDto;
}
