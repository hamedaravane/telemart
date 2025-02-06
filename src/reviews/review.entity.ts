import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { ReviewReply } from './review-reply.entity';
import { ReviewReport } from './review-report.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  buyer: User; // Only a buyer who purchased the product can review it

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column({ type: 'int', default: 5 })
  rating: number; // 1 to 5 stars

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'simple-array', nullable: true })
  images: string[]; // URLs for uploaded review images

  @Column({ type: 'simple-array', nullable: true })
  videos: string[]; // URLs for uploaded review videos

  @OneToMany(() => ReviewReply, (reply) => reply.review, { cascade: true })
  replies: ReviewReply[];

  @OneToMany(() => ReviewReport, (report) => report.review, { cascade: true })
  reports: ReviewReport[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
