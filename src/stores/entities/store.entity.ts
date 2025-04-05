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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '@/users/user.entity';
import { Product } from '@/products/entities/product.entity';
import { Order } from '@/orders/entities/order.entity';
import { Address } from '@/locations/entities/address.entity';
import { StoreSocialLink } from '@/stores/entities/social-media-link.entity';

type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

type WorkingHours = Record<Weekday, { open: string; close: string }>;

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
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ type: () => User, description: 'Owner of the store' })
  @ManyToOne(() => User, (user) => user.stores, { onDelete: 'CASCADE' })
  @JoinColumn()
  owner: User;

  @ApiProperty({
    type: () => User,
    isArray: true,
    description: 'Store admins (pending StoreMember refactor)',
  })
  @ManyToMany(() => User)
  @JoinTable()
  admins: User[];

  @OneToMany(() => Product, (product) => product.store)
  products: Product[];

  @OneToMany(() => Order, (order) => order.store)
  orders: Order[];

  @ApiPropertyOptional({ example: '+1234567890' })
  @Column({ length: 20, nullable: true })
  contactNumber?: string;

  @ApiPropertyOptional({ example: 'store@example.com' })
  @Column({ nullable: true })
  email?: string;

  @OneToMany(() => Address, (address) => address.store)
  addresses?: Address[];

  @OneToMany(() => StoreSocialLink, (link) => link.store, { cascade: true })
  @ApiProperty({ type: () => [StoreSocialLink] })
  socialMediaLinks?: StoreSocialLink[];

  @ApiProperty({
    example: 4.7,
    description: 'Store reputation score (1.0 – 5.0)',
    minimum: 1,
    maximum: 5,
  })
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 5.0 })
  reputation: number;

  @ApiPropertyOptional({
    description: 'Weekly working hours by day',
    example: {
      monday: { open: '09:00', close: '18:00' },
      sunday: { open: '11:00', close: '15:00' },
    },
  })
  @Column({ type: 'json', nullable: true })
  workingHours?: WorkingHours;

  @ApiPropertyOptional({
    example: ['tech', 'gaming'],
    description: 'Store tags (categories, topics)',
  })
  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @ApiProperty({ example: true, description: 'Is the store currently active?' })
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
