import { Review } from '../review.entity';
import {
  ReviewDetail,
  ReviewPreview,
  ReviewReplyPreview,
  ReviewReportPreview,
} from './types';
import { mapUserToPublicPreview } from '../../users/mappers/user.mapper';
import { ReviewReply } from '../review-reply.entity';
import { ReviewReport } from '../review-report.entity';

export function mapReviewToPreview(review: Review): ReviewPreview {
  return {
    id: review.id,
    rating: review.rating,
    comment: review.comment ?? undefined,
    productId: review.product.id,
    buyer: mapUserToPublicPreview(review.buyer),
    createdAt: review.createdAt,
  };
}

export function mapReviewToDetail(review: Review): ReviewDetail {
  return {
    ...mapReviewToPreview(review),
    images: review.images ?? undefined,
    videos: review.videos ?? undefined,
    replies: review.replies?.map(mapReviewReplyToPreview) ?? [],
    reports: review.reports?.map(mapReviewReportToPreview) ?? [],
    isFlagged: !!review.reports?.length,
  };
}

function mapReviewReplyToPreview(reply: ReviewReply): ReviewReplyPreview {
  return {
    id: reply.id,
    seller: mapUserToPublicPreview(reply.seller),
    replyText: reply.replyText,
    createdAt: reply.createdAt,
  };
}

function mapReviewReportToPreview(report: ReviewReport): ReviewReportPreview {
  return {
    id: report.id,
    reportedBy: mapUserToPublicPreview(report.reportedBy),
    reason: report.reason,
    comment: report.comment ?? undefined,
    reportedAt: report.reportedAt,
  };
}
