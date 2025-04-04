import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Address } from '@/locations/entities/address.entity';
import { Order } from '@/orders/entities/order.entity';
import { Review } from '@/reviews/entities/review.entity';
import { Store } from '@/stores/store.entity';
import { Payment } from '@/payments/payment.entity';

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  BOTH = 'both',
}

@Entity('users')
@Unique(['telegramId'])
@Unique(['phoneNumber'])
@Unique(['email'])
export class User {
  @ApiProperty({ example: 1, description: 'Auto-incremented internal ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '123456789',
    description: 'Telegram ID (unique identifier from Telegram)',
  })
  @Index()
  @Column({ unique: true })
  telegramId: string;

  @ApiProperty({ example: 'Alice' })
  @Column({ length: 50 })
  firstName: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @Column({ nullable: true, length: 50 })
  lastName?: string;

  @ApiPropertyOptional({
    example: 'alice_handle',
    description: 'Telegram username (optional)',
  })
  @Column({ nullable: true })
  username?: string;

  @ApiPropertyOptional({ example: 'en' })
  @Column({ nullable: true, length: 5 })
  languageCode?: string;

  @ApiPropertyOptional({ example: true })
  @Column({ nullable: true })
  hasTelegramPremium?: boolean;

  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg' })
  @Column({ nullable: true })
  photoUrl?: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @Column({ unique: true, nullable: true, length: 20 })
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'alice@example.com' })
  @Column({ unique: true, nullable: true })
  email?: string;

  @ApiProperty({
    enum: UserRole,
    default: UserRole.BUYER,
    description: 'User role: buyer, seller, or both',
  })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.BUYER })
  role: UserRole;

  @ApiPropertyOptional({
    example: 'EQC2h4KQczx7df0xv5M7...',
    description: 'TON wallet address (optional)',
  })
  @Index()
  @Column({ nullable: true, length: 100 })
  walletAddress?: string;

  @ApiPropertyOptional({ type: () => [Address] })
  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => Order, (order) => order.buyer)
  orders: Order[];

  @OneToMany(() => Review, (review) => review.buyer)
  reviews: Review[];

  @OneToMany(() => Store, (store) => store.owner)
  stores: Store[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

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
