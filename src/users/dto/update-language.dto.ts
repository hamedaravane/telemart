import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateLanguageDto {
  @ApiProperty({
    description: 'Language code (ISO 639-1 format)',
    example: 'en',
  })
  @IsNotEmpty()
  @IsString()
  languageCode: string;
}
