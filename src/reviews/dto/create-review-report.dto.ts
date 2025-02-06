import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReportReason } from '../review-report.entity';

export class CreateReviewReportDto {
  @IsEnum(ReportReason, { message: 'Invalid report reason' })
  reason: ReportReason;

  @IsOptional()
  @IsString()
  comment?: string;
}
