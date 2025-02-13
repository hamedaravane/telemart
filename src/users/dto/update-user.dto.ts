import {
  IsBoolean,
  IsEmail,
  IsEnum,
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

  @IsString()
  @IsOptional()
  telegramUsername?: string;

  @IsString()
  @IsOptional()
  telegramLanguageCode?: string;

  @IsBoolean()
  @IsOptional()
  isTelegramPremium?: boolean;

  @IsString()
  @IsOptional()
  telegramPhotoUrl?: string;

  @IsPhoneNumber(undefined, { message: 'Invalid phone number format' })
  @IsOptional()
  @Length(10, 20)
  phoneNumber?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be buyer, seller, or both' })
  role?: UserRole;

  @IsString()
  @IsOptional()
  walletAddress?: string;
}
