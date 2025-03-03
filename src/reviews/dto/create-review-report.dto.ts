import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReportReason } from '../review-report.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewReportDto {
  @ApiProperty({
    description: 'Reason for reporting the review',
    enum: ReportReason,
  })
  @IsEnum(ReportReason)
  reason: ReportReason;

  @ApiPropertyOptional({
    description: 'Additional comments',
    example: 'This review contains misleading information.',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
