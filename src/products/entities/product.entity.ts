import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Store } from '@/stores/entities/store.entity';
import { ProductVariant } from './product-variant.entity';
import { Review } from '@/reviews/entities/review.entity';
import { ProductImage } from './product-image.entity';
import { InventoryEvent } from './inventory-event.entity';
import { AttributeType } from './attribute-type.entity';

export enum ProductType {
  PHYSICAL = 'physical',
  DIGITAL = 'digital',
  SERVICE = 'service',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ length: 150 })
  @ApiProperty()
  name: string;

  @Column({ nullable: true, unique: true })
  @Index()
  @ApiPropertyOptional()
  slug?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @ApiProperty()
  price: number;

  @Column({ type: 'text', nullable: true })
  @ApiPropertyOptional()
  description?: string;

  @OneToMany(() => ProductImage, (img) => img.product, { cascade: true })
  @ApiProperty({ type: () => [ProductImage] })
  images: ProductImage[];

  @ManyToOne(() => Store, (store) => store.products, { onDelete: 'CASCADE' })
  @ApiProperty({ type: () => Store })
  store: Store;

  @Column({ type: 'enum', enum: ProductType, default: ProductType.PHYSICAL })
  @ApiProperty({ enum: ProductType })
  productType: ProductType;

  @OneToMany(() => ProductVariant, (v) => v.product, { cascade: true })
  @ApiProperty({ type: () => [ProductVariant] })
  variants: ProductVariant[];

  @OneToMany(() => AttributeType, (t) => t.product, { cascade: true })
  @ApiProperty({ type: () => [AttributeType] })
  attributeTypes: AttributeType[];

  @OneToMany(() => Review, (r) => r.product)
  @ApiProperty({ type: () => [Review] })
  reviews: Review[];

  @Column({ nullable: true })
  @ApiPropertyOptional()
  downloadLink?: string;

  @OneToMany(() => InventoryEvent, (e) => e.product)
  @ApiProperty({ type: () => [InventoryEvent] })
  inventoryEvents: InventoryEvent[];

  @Column({ default: false })
  @ApiProperty()
  isApproved: boolean;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
