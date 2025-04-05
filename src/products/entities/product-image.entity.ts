import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('product_images')
@Index(['product', 'isPrimary'], { unique: true, where: '"isPrimary" = true' })
export class ProductImage {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({ type: () => Product })
  product: Product;

  @Column()
  @ApiProperty()
  url: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  alt?: string;

  @Column({ default: false })
  @ApiProperty({ default: false })
  isPrimary: boolean;

  @Column({ default: 0 })
  @ApiProperty()
  order: number;
}
