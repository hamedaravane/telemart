import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class MediaDto {
  @ApiProperty({ example: 'https://cdn.example.com/logo.png' })
  @IsUrl()
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  alt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  width?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  height?: number;
}
