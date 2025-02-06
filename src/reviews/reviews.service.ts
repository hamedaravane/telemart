import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    private usersService: UsersService,
    private productsService: ProductsService,
  ) {}

  async createReview(
    customerId: number,
    productId: number,
    rating: number,
    comment?: string,
  ): Promise<Review> {
    if (rating < 1 || rating > 5) {
      throw new BadRequestException(`Rating must be between 1 and 5`);
    }

    const customer = await this.usersService.findByTelegramId(
      customerId.toString(),
    );
    if (!customer) {
      throw new NotFoundException(`User with ID ${customerId} not found`);
    }

    const product = await this.productsService.getProductById(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const review = this.reviewsRepository.create({
      customer,
      product,
      rating,
      comment,
    });

    return this.reviewsRepository.save(review);
  }

  async getAllReviews(): Promise<Review[]> {
    return this.reviewsRepository.find({ relations: ['customer', 'product'] });
  }

  async getReviewsByProduct(productId: number): Promise<Review[]> {
    return this.reviewsRepository.find({
      where: { product: { id: productId } },
      relations: ['customer', 'product'],
    });
  }

  async getReviewById(reviewId: number): Promise<Review> {
    const review = await this.reviewsRepository.findOne({
      where: { id: reviewId },
      relations: ['customer', 'product'],
    });
    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }
    return review;
  }

  async deleteReview(reviewId: number): Promise<void> {
    const result = await this.reviewsRepository.delete(reviewId);
    if (result.affected === 0) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }
  }
}
