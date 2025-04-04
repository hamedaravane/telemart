import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressType } from '../entities/address.entity';

/**
 * Defines the type of canonical location entity.
 * Used for categorizing countries, states, and cities.
 */
export enum CanonicalLocationType {
  COUNTRY = 'country',
  STATE = 'state',
  CITY = 'city',
}

/**
 * A geographic point consisting of latitude and longitude coordinates.
 */
export class GeoPoint {
  /** Latitude of the point */
  @ApiProperty({ example: 48.8566 })
  @IsLatitude()
  latitude: number;

  /** Longitude of the point */
  @ApiProperty({ example: 2.3522 })
  @IsLongitude()
  longitude: number;
}

/**
 * A standardized representation of a location, such as a country, state, or city.
 */
export class CanonicalLocationDto {
  /** Unique identifier for the location */
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  /** Name of the location */
  @ApiProperty({ example: 'France' })
  @IsString()
  name: string;

  /** The type of this location (country, state, or city) */
  @ApiProperty({ enum: CanonicalLocationType })
  @IsEnum(CanonicalLocationType)
  type: CanonicalLocationType;

  /** ID of the parent location (e.g., country for state, state for city) */
  @ApiPropertyOptional({ example: 101 })
  @IsOptional()
  @IsNumber()
  parentId?: number;

  /** Optional postal code for this location */
  @ApiPropertyOptional({ example: '75001' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  /** Latitude coordinate (optional) */
  @ApiPropertyOptional({ example: 48.8566 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  /** Longitude coordinate (optional) */
  @ApiPropertyOptional({ example: 2.3522 })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}

/**
 * Full address with location hierarchy and metadata.
 */
export class AddressDto {
  /** Unique ID of the address */
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  /** Optional user-defined label for the address (e.g., 'Home', 'Work') */
  @ApiPropertyOptional({ example: 'Home' })
  @IsOptional()
  @IsString()
  label?: string;

  /** Country location node */
  @ApiPropertyOptional({ type: () => CanonicalLocationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CanonicalLocationDto)
  country?: CanonicalLocationDto;

  /** State/province location node */
  @ApiPropertyOptional({ type: () => CanonicalLocationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CanonicalLocationDto)
  state?: CanonicalLocationDto;

  /** City location node */
  @ApiPropertyOptional({ type: () => CanonicalLocationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CanonicalLocationDto)
  city?: CanonicalLocationDto;

  /** First line of the street address */
  @ApiProperty({ example: '221B Baker Street' })
  @IsString()
  streetLine1: string;

  /** Optional second line of the street address (e.g., apartment number) */
  @ApiPropertyOptional({ example: 'Flat B' })
  @IsOptional()
  @IsString()
  streetLine2?: string;

  /** Optional postal or ZIP code */
  @ApiPropertyOptional({ example: 'NW1 6XE' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  /** Latitude and longitude of the address */
  @ApiProperty({ type: () => GeoPoint })
  @ValidateNested()
  @Type(() => GeoPoint)
  geoPoint: GeoPoint;

  /** The purpose of the address (e.g., billing, shipping, etc.) */
  @ApiProperty({ enum: AddressType })
  @IsEnum(AddressType)
  type: AddressType;

  /** Indicates whether this address is the user's/store's default */
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

/**
 * Filters for narrowing by region (country, state, city).
 */
export class RegionFilterDto {
  /** Country ID */
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  countryId?: number;

  /** State ID */
  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  stateId?: number;

  /** City ID */
  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsNumber()
  cityId?: number;
}

/**
 * Represents a geo-based filter centered around a point and a radius.
 */
export class GeoFilterDto {
  /** Geographic center of the filter area */
  @ApiProperty({ type: () => GeoPoint })
  @ValidateNested()
  @Type(() => GeoPoint)
  center: GeoPoint;

  /** Radius of the filter area in kilometers */
  @ApiProperty({ example: 25 })
  @IsNumber()
  radiusKm: number;
}

/**
 * Represents the best-guess location for a user/device, e.g., based on geolocation or IP.
 */
export class NearestLocationResponseDto {
  /** Country based on location guess */
  @ApiProperty({ type: () => CanonicalLocationDto })
  @ValidateNested()
  @Type(() => CanonicalLocationDto)
  country: CanonicalLocationDto;

  /** Optional matched state */
  @ApiPropertyOptional({ type: () => CanonicalLocationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CanonicalLocationDto)
  state?: CanonicalLocationDto;

  /** Optional matched city */
  @ApiPropertyOptional({ type: () => CanonicalLocationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CanonicalLocationDto)
  city?: CanonicalLocationDto;
}
