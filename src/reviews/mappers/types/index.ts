import { ReportReason } from '../../review-report.entity';
import { UserPublicPreview } from '../../../users/mappers/types';

export interface ReviewReplyPreview {
  id: number;
  seller: UserPublicPreview;
  replyText: string;
  createdAt: Date;
}

export interface ReviewReportPreview {
  id: number;
  reportedBy: UserPublicPreview;
  reason: ReportReason;
  comment?: string;
  reportedAt: Date;
}

export interface ReviewPreview {
  id: number;
  rating: number;
  comment?: string;
  productId: number;
  buyer: UserPublicPreview;
  createdAt: Date;
}

export interface ReviewDetail extends ReviewPreview {
  images?: string[];
  videos?: string[];
  replies: ReviewReplyPreview[];
  reports: ReviewReportPreview[];
  isFlagged?: boolean;
}
