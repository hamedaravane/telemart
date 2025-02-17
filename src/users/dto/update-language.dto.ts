import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateLanguageDto {
  @IsNotEmpty()
  @IsString()
  languageCode: string;
}
