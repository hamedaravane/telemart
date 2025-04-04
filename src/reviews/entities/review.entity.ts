import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Product } from '../../products/entities/product.entity';
import { ReviewReply } from './review-reply.entity';
import { ReviewReport } from './review-report.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'reviews' })
export class Review {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'User who wrote the review' })
  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  buyer: User;

  @ApiProperty({ description: 'Product being reviewed' })
  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ApiProperty({ minimum: 1, maximum: 5, example: 4 })
  @Column({ type: 'int', default: 5 })
  rating: number;

  @ApiProperty({ description: 'Optional comment', nullable: true })
  @Column({ type: 'text', nullable: true })
  comment?: string;

  @ApiProperty({ type: [String], nullable: true })
  @Column({ type: 'simple-array', nullable: true })
  images?: string[];

  @ApiProperty({ type: [String], nullable: true })
  @Column({ type: 'simple-array', nullable: true })
  videos?: string[];

  @ApiProperty({ type: () => [ReviewReply] })
  @OneToMany(() => ReviewReply, (reply) => reply.review, { cascade: true })
  replies: ReviewReply[];

  @ApiProperty({ type: () => [ReviewReport] })
  @OneToMany(() => ReviewReport, (report) => report.review, { cascade: true })
  reports: ReviewReport[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
