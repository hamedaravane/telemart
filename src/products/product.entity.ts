import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Store } from '../stores/store.entity';
import { ProductAttribute } from './product-attribute.entity';
import { ProductVariant } from './product-variant.entity';
import { Review } from '../reviews/review.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum ProductType {
  PHYSICAL = 'physical',
  DIGITAL = 'digital',
  SERVICE = 'service',
}

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column()
  imageUrl: string;

  @ManyToOne(() => Store, (store) => store.products, { onDelete: 'CASCADE' })
  store: Store;

  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.PHYSICAL,
  })
  productType: ProductType;

  @OneToMany(() => ProductAttribute, (attribute) => attribute.product, {
    cascade: true,
    eager: true,
  })
  attributes: ProductAttribute[];

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
    eager: true,
  })
  variants: ProductVariant[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @Column({ nullable: true })
  downloadLink?: string;

  @Column({ nullable: true })
  stock?: number;

  @Column({ default: false })
  isApproved: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export class ProductPreview {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the product',
  })
  id: number;

  @ApiProperty({ example: 'Laptop', description: 'The name of the product' })
  name: string;

  @ApiProperty({
    example: 100,
    description: 'The price of the product',
  })
  price: number;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'The URL of the product image',
  })
  imageUrl: string;

  @ApiProperty()
  productType: ProductType;

  @ApiProperty()
  stock?: number;
}

export function mapProductPreview(product: Product): ProductPreview {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    productType: product.productType,
    stock: product.stock,
  };
}
