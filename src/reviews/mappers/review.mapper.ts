import { Review } from '../entities/review.entity';
import { ReviewReply } from '../entities/review-reply.entity';
import { ReviewReport } from '../entities/review-report.entity';
import {
  ReviewDetailDto,
  ReviewPreviewDto,
  ReviewReplyPreviewDto,
  ReviewReportPreviewDto,
} from '@/reviews/dto';
import { mapUserToPublicPreview } from '@/users/mappers/user.mapper';

export function mapReviewToPreview(review: Review): ReviewPreviewDto {
  return {
    id: review.id,
    rating: review.rating,
    comment: review.comment ?? undefined,
    productId: review.product.id,
    buyer: mapUserToPublicPreview(review.buyer),
    createdAt: review.createdAt,
  };
}

export function mapReviewToDetail(review: Review): ReviewDetailDto {
  return {
    ...mapReviewToPreview(review),
    images: review.images ?? undefined,
    videos: review.videos ?? undefined,
    replies: review.replies?.map(mapReviewReplyToPreview) ?? [],
    reports: review.reports?.map(mapReviewReportToPreview) ?? [],
    isFlagged: review.reports?.length > 0 || undefined,
  };
}

export function mapReviewReplyToPreview(
  reply: ReviewReply,
): ReviewReplyPreviewDto {
  return {
    id: reply.id,
    seller: mapUserToPublicPreview(reply.seller),
    replyText: reply.replyText,
    createdAt: reply.createdAt,
  };
}

export function mapReviewReportToPreview(
  report: ReviewReport,
): ReviewReportPreviewDto {
  return {
    id: report.id,
    reportedBy: mapUserToPublicPreview(report.reportedBy),
    reason: report.reason,
    comment: report.comment ?? undefined,
    reportedAt: report.reportedAt,
  };
}
