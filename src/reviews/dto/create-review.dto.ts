import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Rating between 1 and 5',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({
    description: 'Optional review comment',
    example: 'Great product!',
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional({
    description: 'List of image URLs',
    example: ['https://example.com/image1.jpg'],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => String)
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiPropertyOptional({
    description: 'List of video URLs',
    example: ['https://example.com/video1.mp4'],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => String)
  @IsUrl({}, { each: true })
  videos?: string[];
}
