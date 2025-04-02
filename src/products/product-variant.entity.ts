import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'product_variants' })
export class ProductVariant {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ApiProperty({ example: 'Size' })
  @Column({ length: 50 })
  variantName: string;

  @ApiProperty({ example: 'M' })
  @Column({ length: 50 })
  variantValue: string;

  @ApiProperty({ example: 5.99, nullable: true })
  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  additionalPrice?: number;
}
