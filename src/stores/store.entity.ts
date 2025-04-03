import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '@/users/user.entity';
import { Product } from '@/products/product.entity';
import { Order } from '@/orders/order.entity';
import { Address } from '@/locations/entities/address.entity';

@Entity('stores')
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

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.stores, { onDelete: 'CASCADE' })
  owner: User;

  @ApiProperty({ type: () => User, isArray: true })
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

  @ApiProperty({ example: ['tech', 'gaming'], required: false })
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
