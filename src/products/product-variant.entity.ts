import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'product_variants' })
export class ProductVariant {
  @ApiProperty({ description: 'Unique ID of the product variant', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Product associated with this variant' })
  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ApiProperty({ description: 'Variant name', example: 'Color' })
  @Column({ length: 50 })
  variantName: string;

  @ApiProperty({ description: 'Variant value', example: 'Red' })
  @Column({ length: 50 })
  variantValue: string;

  @ApiProperty({
    description: 'Additional price for this variant',
    example: 5.99,
    nullable: true,
  })
  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  additionalPrice?: number;
}
