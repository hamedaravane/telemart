import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateReviewReplyDto } from './dto/create-review-reply.dto';
import { CreateReviewReportDto } from './dto/create-review-report.dto';
import { ReviewReply } from './entities/review-reply.entity';
import { ReviewReport } from './entities/review-report.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(ReviewReply)
    private repliesRepository: Repository<ReviewReply>,
    @InjectRepository(ReviewReport)
    private reportsRepository: Repository<ReviewReport>,
  ) {}

  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const { rating, comment, images, videos } = createReviewDto;
    const review = this.reviewsRepository.create({
      rating,
      comment,
      images,
      videos,
    });
    return this.reviewsRepository.save(review);
  }

  async getReviewById(id: number): Promise<Review> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: ['replies', 'reports'],
    });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async addReviewReply(
    reviewId: number,
    createReviewReplyDto: CreateReviewReplyDto,
  ): Promise<Review> {
    const review = await this.getReviewById(reviewId);
    const reply = this.repliesRepository.create({
      review,
      replyText: createReviewReplyDto.replyText,
    });
    await this.repliesRepository.save(reply);
    return this.getReviewById(reviewId);
  }

  async reportReview(
    reviewId: number,
    createReviewReportDto: CreateReviewReportDto,
  ): Promise<Review> {
    const review = await this.getReviewById(reviewId);
    const report = this.reportsRepository.create({
      review,
      reason: createReviewReportDto.reason,
      comment: createReviewReportDto.comment,
    });
    await this.reportsRepository.save(report);
    return this.getReviewById(reviewId);
  }

  async getAllReviews(): Promise<Review[]> {
    return this.reviewsRepository.find({ relations: ['replies', 'reports'] });
  }
}
