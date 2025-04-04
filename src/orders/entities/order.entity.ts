import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Store } from '../../stores/store.entity';
import { OrderItem } from './order-item.entity';
import { OrderShipment } from './order-shipment.entity';
import { Payment } from '../../payments/payment.entity';
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
  @ApiProperty({ example: 1001 })
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

  @ApiProperty({ enum: OrderStatus })
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @ApiProperty({ type: () => [OrderItem] })
  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @ApiProperty({ type: () => OrderShipment })
  @OneToOne(() => OrderShipment, (shipment) => shipment.order, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  shipment?: OrderShipment;

  @ApiProperty({ type: () => Payment })
  @OneToOne(() => Payment, (payment) => payment.order, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  payment?: Payment;

  @ApiProperty({ example: 250.5 })
  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @ApiPropertyOptional({ example: '2024-06-15T14:00:00Z' })
  @Column({ type: 'timestamp', nullable: true })
  deliveryDate?: Date;

  @ApiProperty({ type: Date })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: Date })
  @UpdateDateColumn()
  updatedAt: Date;
}
