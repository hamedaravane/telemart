import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Store } from '../stores/store.entity';
import { User } from '../users/user.entity';
import { City } from './city.entity';
import { State } from './state.entity';
import { Country } from './country.entity';

export enum AddressType {
  USER = 'user',
  STORE = 'store',
  SHIPPING = 'shipping',
  BILLING = 'billing',
  PICKUP = 'pickup',
}

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() streetLine1: string;
  @Column({ nullable: true }) streetLine2?: string;
  @Column({ nullable: true }) postalCode?: string;
  @Column({ type: 'decimal', precision: 10, scale: 6 }) latitude: number;
  @Column({ type: 'decimal', precision: 10, scale: 6 }) longitude: number;

  @Column({ nullable: true }) label?: string;
  @Column({ type: 'enum', enum: AddressType }) type:
    | 'user'
    | 'store'
    | 'shipping'
    | 'billing'
    | 'pickup';
  @Column({ default: false }) isDefault: boolean;

  @ManyToOne(() => Country, { nullable: true }) country?: Country;
  @ManyToOne(() => State, { nullable: true }) state?: State;
  @ManyToOne(() => City, { nullable: true }) city?: City;

  @ManyToOne(() => User, (user) => user.addresses, { nullable: true })
  user?: User;
  @ManyToOne(() => Store, (store) => store.addresses, { nullable: true })
  store?: Store;

  @CreateDateColumn() createdAt: Date;
}
