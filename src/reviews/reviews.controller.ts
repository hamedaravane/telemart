import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateReviewReplyDto } from './dto/create-review-reply.dto';
import { CreateReviewReportDto } from './dto/create-review-report.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    return this.reviewsService.createReview(createReviewDto);
  }

  @Get(':id')
  async getReviewById(@Param('id') id: number): Promise<Review> {
    return this.reviewsService.getReviewById(id);
  }

  @Patch(':id/reply')
  @UsePipes(new ValidationPipe())
  async addReviewReply(
    @Param('id') id: number,
    @Body() createReviewReplyDto: CreateReviewReplyDto,
  ): Promise<Review> {
    return this.reviewsService.addReviewReply(id, createReviewReplyDto);
  }

  @Post(':id/report')
  @UsePipes(new ValidationPipe())
  async reportReview(
    @Param('id') id: number,
    @Body() createReviewReportDto: CreateReviewReportDto,
  ): Promise<Review> {
    return this.reviewsService.reportReview(id, createReviewReportDto);
  }

  @Get()
  async getAllReviews(): Promise<Review[]> {
    return this.reviewsService.getAllReviews();
  }
}
