import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReportReason } from '@/reviews/entities/review-report.entity';
import { UserPublicPreviewDto } from '@/users/dto';

export class CreateReviewDto {
  @ApiProperty({ minimum: 1, maximum: 5, example: 4 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'Great quality and fast delivery.' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  videos?: string[];
}

export class CreateReviewReplyDto {
  @ApiProperty({ example: 'Thanks for your feedback!' })
  @IsString()
  replyText: string;
}

export class CreateReviewReportDto {
  @ApiProperty({ enum: ReportReason })
  @IsEnum(ReportReason)
  reason: ReportReason;

  @ApiPropertyOptional({ example: 'This seems like a fake review.' })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class ReviewPreviewDto {
  @ApiProperty({ example: 123 })
  id: number | string;

  @ApiProperty({ example: 5 })
  rating: number;

  @ApiProperty({ example: 'Amazing product!' })
  comment?: string;

  @ApiProperty({ example: 99 })
  productId: number | string;

  @ApiProperty({ type: () => UserPublicPreviewDto })
  @Type(() => UserPublicPreviewDto)
  buyer: UserPublicPreviewDto;

  @ApiProperty()
  createdAt: Date;
}

export class ReviewReplyPreviewDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ type: () => UserPublicPreviewDto })
  @Type(() => UserPublicPreviewDto)
  seller: UserPublicPreviewDto;

  @ApiProperty({ example: 'Thanks, we hope to see you again!' })
  replyText: string;

  @ApiProperty()
  createdAt: Date;
}

export class ReviewReportPreviewDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ type: () => UserPublicPreviewDto })
  @Type(() => UserPublicPreviewDto)
  reportedBy: UserPublicPreviewDto;

  @ApiProperty({ enum: ReportReason })
  reason: ReportReason;

  @ApiPropertyOptional()
  comment?: string;

  @ApiProperty()
  reportedAt: Date;
}

export class ReviewDetailDto extends ReviewPreviewDto {
  @ApiPropertyOptional({ type: [String] })
  images?: string[];

  @ApiPropertyOptional({ type: [String] })
  videos?: string[];

  @ApiProperty({ type: () => [ReviewReplyPreviewDto] })
  @Type(() => ReviewReplyPreviewDto)
  replies: ReviewReplyPreviewDto[];

  @ApiProperty({ type: () => [ReviewReportPreviewDto] })
  @Type(() => ReviewReportPreviewDto)
  reports: ReviewReportPreviewDto[];

  @ApiProperty({ example: false })
  isFlagged?: boolean;
}
