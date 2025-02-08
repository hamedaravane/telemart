import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsObject,
  Max,
  Min,
  IsUrl,
} from 'class-validator';
import { StoreCategory } from '../category.entity';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsUrl({}, { message: 'Invalid logo URL' })
  logoUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(StoreCategory, { message: 'Invalid store category' })
  category: StoreCategory;

  @IsOptional()
  @IsPhoneNumber(undefined, { message: 'Invalid phone number' })
  contactNumber?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsObject({ message: 'Social media links must be an object' })
  socialMediaLinks?: { [platform: string]: string };

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  reputation?: number;

  @IsOptional()
  @IsString()
  workingHours?: string;
}
