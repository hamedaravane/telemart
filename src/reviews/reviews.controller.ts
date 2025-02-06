import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Create a new review
  @Post()
  async createReview(
    @Body('customerId') customerId: number,
    @Body('productId') productId: number,
    @Body('rating') rating: number,
    @Body('comment') comment?: string,
  ): Promise<Review> {
    return this.reviewsService.createReview(
      customerId,
      productId,
      rating,
      comment,
    );
  }

  // Get all reviews
  @Get()
  async getAllReviews(): Promise<Review[]> {
    return this.reviewsService.getAllReviews();
  }

  // Get reviews for a specific product
  @Get('product/:productId')
  async getReviewsByProduct(
    @Param('productId') productId: number,
  ): Promise<Review[]> {
    return this.reviewsService.getReviewsByProduct(productId);
  }

  // Get a review by ID
  @Get(':id')
  async getReviewById(@Param('id') id: number): Promise<Review> {
    return this.reviewsService.getReviewById(id);
  }

  // Delete a review
  @Delete(':id')
  async deleteReview(@Param('id') id: number): Promise<{ message: string }> {
    await this.reviewsService.deleteReview(id);
    return { message: 'Review deleted successfully' };
  }
}
