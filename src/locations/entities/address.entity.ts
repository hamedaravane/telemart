import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '@/users/user.entity';
import { Store } from '@/stores/entities/store.entity';
import { Country } from './country.entity';
import { State } from './state.entity';
import { City } from './city.entity';

/**
 * Enum to distinguish different address use cases in the system.
 */
export enum AddressType {
  /** Personal address associated with a user */
  USER = 'user',

  /** Location tied to a store */
  STORE = 'store',

  /** Destination for order deliveries */
  SHIPPING = 'shipping',

  /** Location for invoice and billing info */
  BILLING = 'billing',

  /** Pickup location for in-person retrieval */
  PICKUP = 'pickup',
}

@Entity('addresses')
export class Address {
  /**
   * Auto-incremented internal address ID.
   */
  @ApiProperty({
    example: 1,
    description: 'Unique address ID (primary key)',
  })
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * First line of the street address (e.g. house number, street name).
   */
  @ApiProperty({
    example: '221B Baker Street',
    description: 'Primary street address line',
  })
  @Column()
  streetLine1: string;

  /**
   * Second line of the street address (e.g. apartment number).
   */
  @ApiPropertyOptional({
    example: 'Flat B',
    description: 'Additional address line (optional)',
  })
  @Column({ nullable: true })
  streetLine2?: string;

  /**
   * Postal code or ZIP code associated with the address.
   */
  @ApiPropertyOptional({
    example: 'NW1 6XE',
    description: 'ZIP or postal code',
  })
  @Column({ nullable: true })
  postalCode?: string;

  /**
   * Latitude of the address location (WGS84).
   */
  @ApiProperty({
    example: 48.8566,
    description: 'Latitude coordinate (decimal degrees)',
  })
  @Column({ type: 'decimal', precision: 10, scale: 6 })
  @Index()
  latitude: number;

  /**
   * Longitude of the address location (WGS84).
   */
  @ApiProperty({
    example: 2.3522,
    description: 'Longitude coordinate (decimal degrees)',
  })
  @Column({ type: 'decimal', precision: 10, scale: 6 })
  @Index()
  longitude: number;

  /**
   * Optional label to help users recognize this address (e.g. Home, Work).
   */
  @ApiPropertyOptional({
    example: 'Home',
    description: 'User-defined label for the address',
  })
  @Column({ nullable: true })
  label?: string;

  /**
   * Defines the type and purpose of the address.
   */
  @ApiProperty({
    enum: AddressType,
    example: AddressType.USER,
    description: 'Usage category of this address',
  })
  @Column({ type: 'enum', enum: AddressType })
  type: AddressType;

  /**
   * Indicates if this is the default address for the associated user/store.
   */
  @ApiProperty({
    example: true,
    description: 'Whether this is the default address',
  })
  @Column({ default: false })
  isDefault: boolean;

  /**
   * Country part of the address (e.g. United States, France).
   */
  @ApiPropertyOptional({
    type: () => Country,
    description: 'Country for this address',
  })
  @ManyToOne(() => Country, { onDelete: 'SET NULL' })
  @JoinColumn()
  country: Country;

  /**
   * State or province within the country.
   */
  @ApiPropertyOptional({
    type: () => State,
    description: 'State or province (optional)',
  })
  @ManyToOne(() => State, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  state?: State;

  /**
   * City or town within the state.
   */
  @ApiPropertyOptional({
    type: () => City,
    description: 'City or town (optional)',
  })
  @ManyToOne(() => City, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  city?: City;

  /**
   * Optional link to the user that owns this address.
   */
  @ApiPropertyOptional({
    type: () => User,
    description: 'User associated with this address (if applicable)',
  })
  @ManyToOne(() => User, (user) => user.addresses, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: User;

  /**
   * Optional link to the store that owns this address.
   */
  @ApiPropertyOptional({
    type: () => Store,
    description: 'Store associated with this address (if applicable)',
  })
  @ManyToOne(() => Store, (store) => store.addresses, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  store?: Store;

  /**
   * Timestamp of when the address record was created.
   */
  @ApiProperty({
    type: Date,
    description: 'Creation timestamp',
  })
  @CreateDateColumn()
  createdAt: Date;
}
