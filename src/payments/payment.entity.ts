import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity({ name: 'payments' })
export class Payment {
  @ApiProperty({
    description: 'Payment ID (UUID)',
    example: 'd4378b50-9cd9-47ee-b733-bec04e8af001',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Unique payment reference ID',
    example: 'pay_20250402_abc',
  })
  @Column({ unique: true })
  paymentId: string;

  @ApiPropertyOptional({ description: 'Associated order (nullable)' })
  @OneToOne(() => Order, (order) => order.payment, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  order?: Order;

  @ApiPropertyOptional({ description: 'User who made the payment (nullable)' })
  @ManyToOne(() => User, (user) => user.payments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user?: User;

  @ApiProperty({
    description: 'Payment amount in smallest unit (e.g. cents)',
    example: '1000',
  })
  @Column({ type: 'bigint' })
  amount: string;

  @ApiProperty({ enum: PaymentStatus, description: 'Status of the payment' })
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @ApiPropertyOptional({
    description: 'Transaction hash on blockchain',
    example: '0xabc123...',
  })
  @Column({ nullable: true })
  @Index()
  transactionHash?: string;

  @ApiPropertyOptional({
    description: 'Sender wallet address',
    example: '0xsender123...',
  })
  @Column({ nullable: true })
  fromWalletAddress?: string;

  @ApiPropertyOptional({
    description: 'Receiver wallet address',
    example: '0xreceiver456...',
  })
  @Column({ nullable: true })
  toWalletAddress?: string;

  @ApiPropertyOptional({
    description: 'Estimated gas fee (bigint string)',
    example: '20000',
  })
  @Column({ type: 'bigint', nullable: true })
  gasFee?: string;

  @ApiPropertyOptional({
    description: 'Commission applied to payment (bigint string)',
    example: '300',
  })
  @Column({ type: 'bigint', nullable: true })
  commission?: string;

  @ApiProperty({ description: 'When the payment was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When the payment was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
