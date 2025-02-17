import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPhoneNumber,
  Length,
} from 'class-validator';

export class UpdateContactLocationDto {
  @IsNotEmpty()
  @IsPhoneNumber(undefined)
  @Length(10, 20)
  phoneNumber: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsInt()
  countryId: number;

  @IsNotEmpty()
  @IsInt()
  stateId: number;

  @IsNotEmpty()
  @IsInt()
  cityId: number;
}
