import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { State } from './state.entity';

/**
 * Represents a country and its relevant metadata used throughout the app.
 * Used for regional grouping, address construction, and filtering.
 */
@Entity({ name: 'countries' })
@Unique(['code'])
export class Country {
  /**
   * Auto-incremented internal identifier for the country.
   */
  @ApiProperty({ example: 1, description: 'Unique country ID' })
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * ISO 3166-1 alpha-2 code for the country (e.g., 'US', 'FR').
   */
  @ApiProperty({
    description: 'Two-letter ISO country code (e.g., US)',
    example: 'US',
  })
  @Column({ unique: true, length: 2 })
  @Index()
  code: string;

  /**
   * English name of the country.
   */
  @ApiProperty({
    description: 'Official country name in English',
    example: 'United States',
  })
  @Column({ length: 100 })
  @Index()
  name: string;

  /**
   * Slugified URL-friendly version of the country name (e.g., 'united-states').
   * Useful for search/filter URLs and SEO.
   */
  @ApiProperty({
    description: 'Slug used for URL-friendly country names',
    example: 'united-states',
    required: false,
  })
  @Column({ nullable: true, unique: true })
  @Index()
  slug?: string;

  /**
   * Localized country names in different languages.
   * Example: `{ en: "United States", es: "Estados Unidos" }`
   */
  @ApiProperty({
    description: 'Localized names in different languages',
    example: { en: 'United States', fr: 'États-Unis' },
    required: false,
  })
  @Column({ type: 'json', nullable: true })
  nameLocal?: Record<string, string>;

  /**
   * Dialing code for the country (e.g., '+1').
   */
  @ApiProperty({
    description: 'International phone dialing code',
    example: '+1',
    required: false,
  })
  @Column({ nullable: true, length: 6 })
  phoneCode?: string;

  /**
   * Currency code used in the country (e.g., 'USD', 'EUR').
   */
  @ApiProperty({
    description: 'Currency code (ISO 4217)',
    example: 'USD',
    required: false,
  })
  @Column({ nullable: true, length: 3 })
  currency?: string;

  /**
   * Continent or region to which the country belongs (e.g., 'North America').
   * Can be used for geographic filters or grouping.
   */
  @ApiProperty({
    description: 'Geographical region or continent',
    example: 'North America',
    required: false,
  })
  @Column({ nullable: true })
  region?: string;

  /**
   * Capital city of the country.
   */
  @ApiProperty({
    description: 'Capital city name',
    example: 'Washington D.C.',
    required: false,
  })
  @Column({ nullable: true, length: 100 })
  capital?: string;

  /**
   * List of states or provinces that belong to this country.
   */
  @ApiProperty({
    description: 'States/provinces that are part of this country',
    type: () => [State],
  })
  @OneToMany(() => State, (state) => state.country)
  states: State[];
}
