import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'product_attributes' })
@Unique(['product', 'attributeName'])
export class ProductAttribute {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.attributes, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ApiProperty({ example: 'Color' })
  @Column({ length: 50 })
  attributeName: string;

  @ApiProperty({ example: 'Black' })
  @Column({ length: 255 })
  attributeValue: string;
}
