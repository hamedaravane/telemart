import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity({ name: 'payments' })
export class Payment {
  @ApiProperty({ description: 'Unique payment ID', example: '1234-abcd' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Unique payment identifier',
    example: 'pay-56789',
  })
  @Column({ unique: true })
  paymentId: string;

  @ApiProperty({ description: 'Order associated with the payment' })
  @ManyToOne(() => Order, (order) => order.payments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  order: Order;

  @ApiProperty({ description: 'User associated with the payment' })
  @ManyToOne(() => User, (user) => user.payments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user: User;

  @ApiProperty({ description: 'Amount of the payment', example: '1000' })
  @Column({ type: 'bigint' })
  amount: string;

  @ApiProperty({ description: 'Current payment status', enum: PaymentStatus })
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @ApiPropertyOptional({
    description: 'Transaction hash',
    example: '0xabcdef123456',
  })
  @Column({ nullable: true })
  @Index()
  transactionHash: string;

  @ApiPropertyOptional({
    description: 'Sender wallet address',
    example: '0x1234567890abcdef',
  })
  @Column({ nullable: true })
  fromWalletAddress: string;

  @ApiPropertyOptional({
    description: 'Receiver wallet address',
    example: '0xfedcba0987654321',
  })
  @Column({ nullable: true })
  toWalletAddress: string;

  @ApiPropertyOptional({ description: 'Gas fee', example: '0.01' })
  @Column({ type: 'bigint', nullable: true })
  gasFee: string;

  @ApiPropertyOptional({ description: 'Commission charged', example: '2.5' })
  @Column({ type: 'bigint', nullable: true })
  commission: string;

  @ApiProperty({ description: 'Timestamp when the payment was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp when the payment was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
