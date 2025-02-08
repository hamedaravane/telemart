import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'order_shipments' })
export class OrderShipment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.shipments, { onDelete: 'CASCADE' })
  order: Order;

  @Column()
  trackingNumber: string;

  @Column()
  courierService: string;

  @Column({ type: 'timestamp', nullable: true })
  deliveryEstimate: Date;

  @CreateDateColumn()
  shippedAt: Date;
}
