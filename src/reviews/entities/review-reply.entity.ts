import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@/users/user.entity';
import { Review } from './review.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'review_replies' })
export class ReviewReply {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The review this reply belongs to' })
  @ManyToOne(() => Review, (review) => review.replies, { onDelete: 'CASCADE' })
  review: Review;

  @ApiProperty({ description: 'Seller responding to the review' })
  @ManyToOne(() => User, { eager: true })
  seller: User;

  @ApiProperty({ example: 'Thanks for your feedback!' })
  @Column({ type: 'text' })
  replyText: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
