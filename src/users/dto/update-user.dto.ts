import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { UserRole } from '../user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  telegramUsername?: string;

  @IsOptional()
  @IsString()
  telegramLanguageCode?: string;

  @IsOptional()
  @IsBoolean()
  isTelegramPremium?: boolean;

  @IsOptional()
  @IsString()
  telegramPhotoUrl?: string;

  @IsOptional()
  @IsPhoneNumber(undefined, { message: 'Invalid phone number format' })
  @Length(10, 20)
  phoneNumber?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be buyer, seller, or both' })
  role?: UserRole;

  @IsOptional()
  @IsString()
  walletAddress?: string;

  @IsOptional()
  @IsInt()
  countryId?: number;

  @IsOptional()
  @IsInt()
  stateId?: number;

  @IsOptional()
  @IsInt()
  cityId?: number;
}
