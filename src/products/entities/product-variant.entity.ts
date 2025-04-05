import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { AttributeValue } from './attribute-values.entity';
import { InventoryEvent } from './inventory-event.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  sku?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  @ApiProperty({ required: false })
  additionalPrice?: number;

  @Column({ default: true })
  @ApiProperty()
  isActive: boolean;

  @ManyToMany(() => AttributeValue)
  @JoinTable()
  @ApiProperty({ type: () => [AttributeValue] })
  attributeValues: AttributeValue[];

  @OneToMany(() => InventoryEvent, (e) => e.variant)
  @ApiProperty({ type: () => [InventoryEvent] })
  inventoryEvents: InventoryEvent[];
}
