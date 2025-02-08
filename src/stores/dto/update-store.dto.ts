import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { StoreCategory } from '../category.entity';

export class UpdateStoreDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Invalid logo URL' })
  logoUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(StoreCategory, { message: 'Invalid store category' })
  category?: StoreCategory;

  @IsOptional()
  @IsPhoneNumber(undefined, { message: 'Invalid phone number' })
  contactNumber?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  /* TODO: make sure your DTO (update & create) match that type (currently, they expect a URL string). */
  @IsOptional()
  @IsUrl({}, { message: 'Invalid social media link' })
  socialMediaLinks?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  reputation?: number;

  @IsOptional()
  @IsString()
  workingHours?: string;
}
