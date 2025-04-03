import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/user.entity';
import { Country } from './country.entity';
import { State } from './state.entity';
import { City } from './city.entity';
import { Store } from '../../stores/store.entity';

export enum AddressType {
  USER = 'user',
  STORE = 'store',
  SHIPPING = 'shipping',
  BILLING = 'billing',
  PICKUP = 'pickup',
}

@Entity('addresses')
export class Address {
  @ApiProperty({ example: 1, description: 'Unique address ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '221B Baker Street' })
  @Column()
  streetLine1: string;

  @ApiProperty({ example: 'Flat B', required: false })
  @Column({ nullable: true })
  streetLine2?: string;

  @ApiProperty({ example: 'NW1 6XE', required: false })
  @Column({ nullable: true })
  postalCode?: string;

  @ApiProperty({ example: 48.8566 })
  @Column({ type: 'decimal', precision: 10, scale: 6 })
  @Index()
  latitude: number;

  @ApiProperty({ example: 2.3522 })
  @Column({ type: 'decimal', precision: 10, scale: 6 })
  @Index()
  longitude: number;

  @ApiProperty({ example: 'Home', required: false })
  @Column({ nullable: true })
  label?: string;

  @ApiProperty({ enum: AddressType })
  @Column({ type: 'enum', enum: AddressType })
  type: AddressType;

  @ApiProperty({ example: true })
  @Column({ default: false })
  isDefault: boolean;

  @ApiProperty({ type: () => Country, required: false })
  @ManyToOne(() => Country, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  country?: Country;

  @ApiProperty({ type: () => State, required: false })
  @ManyToOne(() => State, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  state?: State;

  @ApiProperty({ type: () => City, required: false })
  @ManyToOne(() => City, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  city?: City;

  @ApiProperty({ type: () => User, required: false })
  @ManyToOne(() => User, (user) => user.addresses, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: User;

  @ApiProperty({ type: () => Store, required: false })
  @ManyToOne(() => Store, (store) => store.addresses, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  store?: Store;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
