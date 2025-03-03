import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Review } from './review.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'review_replies' })
export class ReviewReply {
  @ApiProperty({ description: 'Unique ID of the reply', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Review to which this reply belongs' })
  @ManyToOne(() => Review, (review) => review.replies, { onDelete: 'CASCADE' })
  review: Review;

  @ApiProperty({ description: 'Seller who replied to the review' })
  @ManyToOne(() => User, { eager: true })
  seller: User;

  @ApiProperty({
    description: 'Reply text',
    example: 'Thank you for your feedback!',
  })
  @Column({ type: 'text' })
  replyText: string;

  @ApiProperty({ description: 'Timestamp when the reply was created' })
  @CreateDateColumn()
  createdAt: Date;
}
