import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderShipment } from './order-shipment.entity';
import { Payment } from '../payments/payment.entity';
import { Store } from '../stores/store.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  REFUNDED = 'refunded',
}

@Entity({ name: 'orders' })
export class Order {
  @ApiProperty({ description: 'Order ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Buyer who placed the order' })
  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  buyer: User;

  @ApiProperty({ description: 'Store where the order was placed' })
  @ManyToOne(() => Store, (store) => store.orders, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  store: Store;

  @ApiProperty({ description: 'Order status', enum: OrderStatus })
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @ApiProperty({ description: 'List of items in the order', type: [OrderItem] })
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];

  @OneToOne(() => OrderShipment, (shipment) => shipment.order, {
    cascade: true,
  })
  shipment: OrderShipment;

  @ApiProperty({
    description: 'Payments related to this order',
    type: [Payment],
  })
  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];

  @ApiProperty({ description: 'Total amount for the order', example: 250.5 })
  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @ApiPropertyOptional({
    description: 'Transaction ID for payment',
    example: 'txn_123456',
  })
  @Column({ nullable: true })
  paymentTransactionId: string;

  @ApiPropertyOptional({
    description: 'Shipping address',
    example: '123 Main St, City, Country',
  })
  @Column({ nullable: true })
  shippingAddress: string;

  @ApiPropertyOptional({
    description: 'Delivery date',
    example: '2024-05-10T12:00:00Z',
  })
  @Column({ type: 'timestamp', nullable: true })
  deliveryDate: Date;

  @ApiProperty({ description: 'Timestamp when the order was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp when the order was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
