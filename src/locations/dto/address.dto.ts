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
import { CanonicalLocationDto } from './canonical-location.dto';

export enum AddressType {
  USER = 'user',
  STORE = 'store',
  SHIPPING = 'shipping',
  BILLING = 'billing',
  PICKUP = 'pickup',
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
