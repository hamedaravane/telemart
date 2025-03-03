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
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateReviewReplyDto } from './dto/create-review-reply.dto';
import { CreateReviewReportDto } from './dto/create-review-report.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully',
    type: Review,
  })
  @UsePipes(new ValidationPipe())
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    return this.reviewsService.createReview(createReviewDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a review by ID' })
  @ApiParam({ name: 'id', description: 'Review ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Review retrieved successfully',
    type: Review,
  })
  async getReviewById(@Param('id') id: number): Promise<Review> {
    return this.reviewsService.getReviewById(id);
  }

  @Patch(':id/reply')
  @ApiOperation({ summary: 'Add a reply to a review' })
  @ApiParam({ name: 'id', description: 'Review ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Reply added to the review',
    type: Review,
  })
  @UsePipes(new ValidationPipe())
  async addReviewReply(
    @Param('id') id: number,
    @Body() createReviewReplyDto: CreateReviewReplyDto,
  ): Promise<Review> {
    return this.reviewsService.addReviewReply(id, createReviewReplyDto);
  }

  @Post(':id/report')
  @ApiOperation({ summary: 'Report a review' })
  @ApiParam({ name: 'id', description: 'Review ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Review reported successfully',
    type: Review,
  })
  @UsePipes(new ValidationPipe())
  async reportReview(
    @Param('id') id: number,
    @Body() createReviewReportDto: CreateReviewReportDto,
  ): Promise<Review> {
    return this.reviewsService.reportReview(id, createReviewReportDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({
    status: 200,
    description: 'List of all reviews',
    type: [Review],
  })
  async getAllReviews(): Promise<Review[]> {
    return this.reviewsService.getAllReviews();
  }
}
