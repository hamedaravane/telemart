import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { Order } from '../orders/order.entity';
import { StoreCategory } from './categories';
import { Country } from '../locations/country.entity';
import { State } from '../locations/state.entity';
import { City } from '../locations/city.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'stores' })
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true })
  logoUrl?: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({
    type: 'enum',
    enum: StoreCategory,
    default: StoreCategory.OTHER,
  })
  category: StoreCategory;

  @ManyToOne(() => User, (user) => user.stores, { onDelete: 'CASCADE' })
  owner: User;

  @ManyToMany(() => User)
  @JoinTable()
  admins: User[];

  @OneToMany(() => Product, (product) => product.store)
  products: Product[];

  @OneToMany(() => Order, (order) => order.store)
  orders: Order[];

  @Column({ nullable: true, length: 20 })
  contactNumber?: string;

  @Column({ nullable: true })
  email?: string;

  @ManyToOne(() => Country, { nullable: true })
  country?: Country;

  @ManyToOne(() => State, { nullable: true })
  state?: State;

  @ManyToOne(() => City, { nullable: true })
  city?: City;

  @Column({ nullable: true, type: 'simple-json' })
  socialMediaLinks?: { [platform: string]: string };

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 5.0 })
  reputation: number;

  @Column({ nullable: true, type: 'json' })
  workingHours?: Record<string, { open: string; close: string }>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

export class StorePreview {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the store',
  })
  id: number;

  @ApiProperty({ example: 'Tech Store', description: 'The name of the store' })
  name: string;

  @ApiProperty({
    example: 'https://example.com/logo.png',
    description: 'The URL of the store logo',
    nullable: true,
  })
  logoUrl?: string;

  @ApiProperty({ example: 4.5, description: 'The rating of the store' })
  reputation: number;
}

export function mapStorePreview(store: Store): StorePreview {
  return {
    id: store.id,
    name: store.name,
    logoUrl: store.logoUrl,
    reputation: store.reputation,
  };
}
