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
import { Store } from '../../stores/entities/store.entity';
import { ProductAttribute } from './product-attribute.entity';
import { ProductVariant } from './product-variant.entity';
import { Review } from '../../reviews/entities/review.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum ProductType {
  PHYSICAL = 'physical',
  DIGITAL = 'digital',
  SERVICE = 'service',
}

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({ example: 1, description: 'Product ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Wireless Headphones' })
  @Column({ length: 150 })
  name: string;

  @ApiProperty({ example: 'wireless-headphones', required: false })
  @Column({ nullable: true, unique: true })
  @Index()
  slug?: string;

  @ApiProperty({ example: 199.99 })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ required: false })
  @Column({ nullable: true, type: 'text' })
  description?: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @Column()
  imageUrl: string;

  @ApiProperty({ type: () => Store })
  @ManyToOne(() => Store, (store) => store.products, { onDelete: 'CASCADE' })
  store: Store;

  @ApiProperty({ enum: ProductType })
  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.PHYSICAL,
  })
  productType: ProductType;

  @ApiProperty({ type: () => [ProductAttribute] })
  @OneToMany(() => ProductAttribute, (attribute) => attribute.product, {
    cascade: true,
    eager: true,
  })
  attributes: ProductAttribute[];

  @ApiProperty({ type: () => [ProductVariant] })
  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
    eager: true,
  })
  variants: ProductVariant[];

  @ApiProperty({ type: () => [Review] })
  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  downloadLink?: string;

  @ApiProperty({ example: 10, required: false })
  @Column({ nullable: true })
  stock?: number;

  @ApiProperty({ example: true })
  @Column({ default: false })
  isApproved: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
