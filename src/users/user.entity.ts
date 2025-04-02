import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Order } from '../orders/order.entity';
import { Review } from '../reviews/review.entity';
import { Store } from '../stores/store.entity';
import { Payment } from '../payments/payment.entity';
import { Country } from '../locations/country.entity';
import { State } from '../locations/state.entity';
import { City } from '../locations/city.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  BOTH = 'both',
}

@Entity({ name: 'users' })
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

  @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
  @Column({ nullable: true })
  lastName?: string;

  @ApiProperty({ example: 'alice_handle', required: false })
  @Column({ nullable: true })
  username?: string;

  @ApiProperty({ example: 'en', required: false })
  @Column({ nullable: true })
  languageCode?: string;

  @ApiProperty({ example: true, required: false })
  @Column({ nullable: true })
  hasTelegramPremium?: boolean;

  @ApiProperty({ example: 'https://example.com/photo.jpg', required: false })
  @Column({ nullable: true })
  photoUrl?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @Column({ unique: true, nullable: true, length: 20 })
  phoneNumber?: string;

  @ApiProperty({ example: 'alice@example.com', required: false })
  @Column({ unique: true, nullable: true })
  email?: string;

  @ApiProperty({ enum: UserRole, example: UserRole.BUYER })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.BUYER })
  role: UserRole;

  @ApiProperty({ example: '0xABC123...', required: false })
  @Column({ nullable: true })
  walletAddress?: string;

  @ApiProperty({ description: 'User country (if available)', required: false })
  @ManyToOne(() => Country, { nullable: true })
  country?: Country;

  @ApiProperty({ description: 'User state (if available)', required: false })
  @ManyToOne(() => State, { nullable: true })
  state?: State;

  @ApiProperty({ description: 'User city (if available)', required: false })
  @ManyToOne(() => City, { nullable: true })
  city?: City;

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

  @DeleteDateColumn()
  deletedAt?: Date;
}
