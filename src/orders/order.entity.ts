import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderShipment } from './order-shipment.entity';

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

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  buyer: User;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];

  @OneToMany(() => OrderShipment, (shipment) => shipment.order, {
    cascade: true,
  })
  shipments: OrderShipment[];

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ nullable: true })
  paymentTransactionId: string;

  @Column({ nullable: true })
  shippingAddress: string;

  @Column({ nullable: true })
  deliveryDate: Date;

  @CreateDateColumn()
  createdAt: Date;
}
