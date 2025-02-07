import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Review } from './review.entity';

@Entity()
export class ReviewReply {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Review, (review) => review.replies, { onDelete: 'CASCADE' })
  review: Review;

  @ManyToOne(() => User, { eager: true })
  seller: User;

  @Column({ type: 'text' })
  replyText: string;

  @CreateDateColumn()
  createdAt: Date;
}
