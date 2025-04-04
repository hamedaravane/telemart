import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity({ name: 'order_shipments' })
export class OrderShipment {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => Order })
  @OneToOne(() => Order, (order) => order.shipment, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: Order;

  @ApiProperty({ example: 'TRACK123456789' })
  @Column()
  trackingNumber: string;

  @ApiProperty({ example: 'DHL' })
  @Column()
  courierService: string;

  @ApiPropertyOptional({ example: '2024-06-20T12:00:00Z' })
  @Column({ type: 'timestamp', nullable: true })
  deliveryEstimate?: Date;

  @ApiProperty({ type: Date })
  @CreateDateColumn()
  shippedAt: Date;
}
