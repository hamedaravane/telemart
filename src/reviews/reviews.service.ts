import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { ReviewReply } from './review-reply.entity';
import { ReviewReport } from './review-report.entity';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { Order } from '../orders/order.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewsRepository: Repository<Review>,
    @InjectRepository(ReviewReply)
    private repliesRepository: Repository<ReviewReply>,
    @InjectRepository(ReviewReport)
    private reportsRepository: Repository<ReviewReport>,
    private usersService: UsersService,
    private productsService: ProductsService,
  ) {}

  async createReview(
    buyerId: number,
    productId: number,
    rating: number,
    comment?: string,
    images?: string[],
    videos?: string[],
  ): Promise<Review> {
    const buyer = await this.usersService.findByTelegramId(buyerId.toString());
    if (!buyer)
      throw new NotFoundException(`User with ID ${buyerId} not found`);

    const product = await this.productsService.getProductById(productId);
    if (!product)
      throw new NotFoundException(`Product with ID ${productId} not found`);

    const existingOrder = await this.reviewsRepository.manager.findOne(Order, {
      where: { buyer, items: { product } },
    });
    if (!existingOrder)
      throw new ForbiddenException(
        `You must purchase this product before reviewing it`,
      );

    if (rating < 1 || rating > 5) {
      throw new BadRequestException(`Rating must be between 1 and 5`);
    }

    const review = this.reviewsRepository.create({
      buyer,
      product,
      rating,
      comment,
      images,
      videos,
    });

    return this.reviewsRepository.save(review);
  }

  async addReviewReply(
    sellerId: number,
    reviewId: number,
    replyText: string,
  ): Promise<ReviewReply> {
    const review = await this.reviewsRepository.findOne({
      where: { id: reviewId },
      relations: ['product'],
    });
    if (!review) throw new NotFoundException(`Review not found`);

    const seller = await this.usersService.findByTelegramId(
      sellerId.toString(),
    );
    if (!seller) throw new NotFoundException(`Seller not found`);

    if (review.product.store.owner.id !== seller.id) {
      throw new ForbiddenException(
        `Only the store owner can reply to this review`,
      );
    }

    const reply = this.repliesRepository.create({
      review,
      seller,
      replyText,
    });

    return this.repliesRepository.save(reply);
  }
}
