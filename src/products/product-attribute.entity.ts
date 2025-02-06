import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.attributes, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column()
  attributeName: string; // e.g., "Size", "Color", "Material", "Brand"

  @Column()
  attributeValue: string; // e.g., "42", "Red", "Cotton", "Nike"
}
