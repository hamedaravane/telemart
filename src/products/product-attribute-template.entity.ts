import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { StoreCategory } from '../stores/store.entity';

@Entity()
export class ProductAttributeTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g., "Size", "Color", "Material", "Brand"

  @Column({
    type: 'enum',
    enum: StoreCategory,
  })
  storeCategory: StoreCategory;
}
