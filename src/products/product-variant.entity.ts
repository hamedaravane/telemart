import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column()
  variantName: string; // e.g., "Size", "Color"

  @Column()
  variantValue: string; // e.g., "M", "Red"

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  additionalPrice: number; // Optional price addition for specific variants
}
