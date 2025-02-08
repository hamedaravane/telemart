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

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  paymentId: string;

  @ManyToOne(() => Order, (order) => order.payments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  order: Order;

  @ManyToOne(() => User, (user) => user.payments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user: User;

  @Column({ type: 'bigint' })
  amount: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ nullable: true })
  @Index()
  transactionHash: string;

  @Column({ nullable: true })
  fromWalletAddress: string;

  @Column({ nullable: true })
  toWalletAddress: string;

  @Column({ type: 'bigint', nullable: true })
  gasFee: string;

  @Column({ type: 'bigint', nullable: true })
  commission: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
