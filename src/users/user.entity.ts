import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../orders/order.entity';
import { Review } from '../reviews/review.entity';
import { Store } from '../stores/store.entity';
import { Payment } from '../payments/payment.entity';
import { Address } from '../locations/address.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  BOTH = 'both',
}

@Entity('users')
export class User {
  @ApiProperty({ example: 1, description: 'User ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '123456789', description: 'Telegram ID' })
  @Column({ unique: true })
  @Index()
  telegramId: string;

  @ApiProperty({ example: 'Alice', description: 'First name' })
  @Column()
  firstName: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'Last name' })
  @Column({ nullable: true })
  lastName?: string;

  @ApiPropertyOptional({
    example: 'alice_handle',
    description: 'Telegram username',
  })
  @Column({ nullable: true })
  username?: string;

  @ApiPropertyOptional({ example: 'en', description: 'Preferred language' })
  @Column({ nullable: true })
  languageCode?: string;

  @ApiPropertyOptional({ example: true, description: 'Has Telegram Premium' })
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

  @ApiProperty({ enum: UserRole, default: UserRole.BUYER })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.BUYER })
  role: UserRole;

  @ApiPropertyOptional({
    example: '0xABC123...',
    description: 'User wallet address',
  })
  @Column({ nullable: true })
  walletAddress?: string;

  @ApiProperty({ type: () => Address, isArray: true })
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
