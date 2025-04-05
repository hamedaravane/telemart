import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum InventoryEventType {
  INITIAL = 'initial',
  MANUAL_ADJUSTMENT = 'manual',
  SALE = 'sale',
  RETURN = 'return',
  RESTOCK = 'restock',
  CANCELLED = 'cancelled',
}

@Entity('inventory_events')
export class InventoryEvent {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ManyToOne(() => Product, (p) => p.inventoryEvents, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({ type: () => Product })
  product: Product;

  @ManyToOne(() => ProductVariant, (v) => v.inventoryEvents)
  @ApiProperty({ type: () => ProductVariant })
  variant: ProductVariant;

  @Column({ type: 'enum', enum: InventoryEventType })
  @ApiProperty({ enum: InventoryEventType })
  type: InventoryEventType;

  @Column()
  @ApiProperty()
  quantity: number;

  @Column({ type: 'text', nullable: true })
  @ApiPropertyOptional()
  note?: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;
}
