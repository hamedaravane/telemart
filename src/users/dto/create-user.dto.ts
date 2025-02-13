import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  telegramId: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
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

  @IsOptional()
  @IsPhoneNumber(undefined, { message: 'Invalid phone number format' })
  @Length(10, 20)
  phoneNumber?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsString()
  @IsOptional()
  walletAddress?: string;
}
