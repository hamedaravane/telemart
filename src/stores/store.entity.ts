import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
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
import { Address } from '../locations/address.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity({ name: 'stores' })
export class Store {
  @ApiProperty({ example: 1, description: 'Store ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'MegaTech Store', description: 'Store name' })
  @Column({ length: 100 })
  name: string;

  @ApiPropertyOptional({
    example: 'mega-tech-store',
    description: 'Store slug',
  })
  @Column({ nullable: true, unique: true })
  @Index()
  slug?: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @Column({ nullable: true })
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'Store description' })
  @Column({ nullable: true, type: 'text' })
  description?: string;

  @ApiProperty({ enum: StoreCategory, default: StoreCategory.OTHER })
  @Column({
    type: 'enum',
    enum: StoreCategory,
    default: StoreCategory.OTHER,
  })
  category: StoreCategory;

  @ApiProperty({ description: 'Store owner' })
  @ManyToOne(() => User, (user) => user.stores, { onDelete: 'CASCADE' })
  @JoinColumn()
  owner: User;

  @ApiProperty({ type: () => [User], description: 'Store admins' })
  @ManyToMany(() => User)
  @JoinTable()
  admins: User[];

  @OneToMany(() => Product, (product) => product.store)
  products: Product[];

  @OneToMany(() => Order, (order) => order.store)
  orders: Order[];

  @ApiPropertyOptional({ example: '+1234567890' })
  @Column({ nullable: true, length: 20 })
  contactNumber?: string;

  @ApiPropertyOptional({ example: 'store@example.com' })
  @Column({ nullable: true })
  email?: string;

  @ApiPropertyOptional({ type: () => Country })
  @ManyToOne(() => Country, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  country?: Country;

  @ApiPropertyOptional({ type: () => State })
  @ManyToOne(() => State, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  state?: State;

  @ApiPropertyOptional({ type: () => City })
  @ManyToOne(() => City, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  city?: City;

  @ApiPropertyOptional({ type: () => [Address] })
  @OneToMany(() => Address, (address) => address.store)
  addresses?: Address[];

  @ApiPropertyOptional({
    description: 'Store social media links',
    example: {
      instagram: 'https://instagram.com/store',
      facebook: 'https://facebook.com/store',
    },
  })
  @Column({ nullable: true, type: 'simple-json' })
  socialMediaLinks?: Record<string, string>;

  @ApiProperty({ example: 4.7, description: 'Reputation score (1–5)' })
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 5.0 })
  reputation: number;

  @ApiPropertyOptional({
    example: {
      monday: { open: '09:00', close: '18:00' },
      sunday: { open: '11:00', close: '15:00' },
    },
    description: 'Working hours by weekday',
  })
  @Column({ nullable: true, type: 'json' })
  workingHours?: Record<string, { open: string; close: string }>;

  @ApiPropertyOptional({
    example: ['tech', 'gaming', 'electronics'],
    description: 'Tags for filtering or search',
  })
  @Column({ nullable: true, type: 'simple-array' })
  tags?: string[];

  @ApiProperty({ example: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiPropertyOptional()
  @DeleteDateColumn()
  deletedAt?: Date;
}
