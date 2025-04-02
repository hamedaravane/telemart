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
  Index,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { Order } from '../orders/order.entity';
import { StoreCategory } from './categories';
import { Country } from '../locations/country.entity';
import { State } from '../locations/state.entity';
import { City } from '../locations/city.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Address } from '../locations/address.entity';

@Entity({ name: 'stores' })
export class Store {
  @ApiProperty({ example: 1, description: 'Store ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'MegaTech Store', description: 'Store name' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ example: 'tech-store', description: 'Slug (optional)' })
  @Column({ nullable: true, unique: true })
  @Index()
  slug?: string;

  @ApiProperty({ example: 'https://example.com/logo.png' })
  @Column({ nullable: true })
  logoUrl?: string;

  @ApiProperty({
    type: 'string',
    description: 'Store description',
    required: false,
  })
  @Column({ nullable: true, type: 'text' })
  description?: string;

  @ApiProperty({ enum: StoreCategory, example: StoreCategory.ELECTRONICS })
  @Column({
    type: 'enum',
    enum: StoreCategory,
    default: StoreCategory.OTHER,
  })
  category: StoreCategory;

  @ApiProperty({ description: 'Store owner' })
  @ManyToOne(() => User, (user) => user.stores, { onDelete: 'CASCADE' })
  owner: User;

  @ApiProperty({ description: 'Admin users of the store' })
  @ManyToMany(() => User)
  @JoinTable()
  admins: User[];

  @OneToMany(() => Product, (product) => product.store)
  products: Product[];

  @OneToMany(() => Order, (order) => order.store)
  orders: Order[];

  @ApiProperty({ example: '+1234567890', required: false })
  @Column({ nullable: true, length: 20 })
  contactNumber?: string;

  @ApiProperty({ example: 'store@example.com', required: false })
  @Column({ nullable: true })
  email?: string;

  @ApiProperty({ type: () => Country, required: false })
  @ManyToOne(() => Country, { nullable: true })
  country?: Country;

  @ApiProperty({ type: () => State, required: false })
  @ManyToOne(() => State, { nullable: true })
  state?: State;

  @ApiProperty({ type: () => City, required: false })
  @ManyToOne(() => City, { nullable: true })
  city?: City;

  @OneToMany(() => Address, (address) => address.store)
  addresses?: Address[];

  @ApiProperty({
    type: 'object',
    properties: {},
    example: {
      instagram: 'https://instagram.com/store',
      facebook: 'https://facebook.com/store',
    },
  })
  @Column({ nullable: true, type: 'simple-json' })
  socialMediaLinks?: { [platform: string]: string };

  @ApiProperty({ example: 4.7, description: 'Store reputation rating' })
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 5.0 })
  reputation: number;

  @ApiProperty({
    description: 'Working hours as key-value pairs by day',
    example: {
      monday: { open: '09:00', close: '18:00' },
      sunday: { open: '11:00', close: '15:00' },
    },
  })
  @Column({ nullable: true, type: 'json' })
  workingHours?: Record<string, { open: string; close: string }>;

  @ApiProperty({
    example: ['tech', 'gaming', 'electronics'],
    description: 'Tags for filtering/search',
  })
  @Column({ nullable: true, type: 'simple-array' })
  tags?: string[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ required: false })
  @DeleteDateColumn()
  deletedAt: Date;

  @ApiProperty({ example: true })
  @Column({ default: true })
  isActive: boolean;
}
