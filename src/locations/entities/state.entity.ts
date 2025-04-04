import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Country } from './country.entity';
import { City } from './city.entity';

/**
 * Represents a first-level administrative division (e.g., state or province)
 * belonging to a specific country.
 */
@Entity({ name: 'states' })
@Unique(['name', 'country'])
export class State {
  /**
   * Unique identifier for the state.
   */
  @ApiProperty({ example: 10, description: 'Unique ID of the state' })
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Official name of the state or province.
   */
  @ApiProperty({ example: 'California', description: 'State name' })
  @Column({ length: 100 })
  @Index()
  name: string;

  /**
   * Slugified URL-friendly version of the state name.
   * Useful for filtering, routing, and search.
   */
  @ApiProperty({
    example: 'california',
    description: 'Slug for URL-friendly names',
    required: false,
  })
  @Column({ nullable: true, unique: true, length: 100 })
  @Index()
  slug?: string;

  /**
   * Abbreviated state code (e.g., 'CA').
   */
  @ApiProperty({
    example: 'CA',
    description: 'Two-letter or short code for the state',
    required: false,
  })
  @Column({ nullable: true, length: 10 })
  code?: string;

  /**
   * Localized name translations (e.g., { en: 'California', fr: 'Californie' }).
   */
  @ApiProperty({
    example: { en: 'California', es: 'California' },
    description: 'Local name translations by language code',
    required: false,
  })
  @Column({ type: 'json', nullable: true })
  nameLocal?: Record<string, string>;

  /**
   * Country to which this state belongs.
   */
  @ApiProperty({
    description: 'Reference to the parent country',
    type: () => Country,
  })
  @ManyToOne(() => Country, (country) => country.states, {
    onDelete: 'CASCADE',
  })
  country: Country;

  /**
   * Foreign key for `country` (auto-managed by TypeORM).
   */
  @ApiProperty({ example: 1, description: 'Parent country ID' })
  @RelationId((state: State) => state.country)
  countryId: number;

  /**
   * Cities that exist within this state.
   */
  @ApiProperty({
    description: 'List of cities under this state',
    type: () => [City],
  })
  @OneToMany(() => City, (city) => city.state)
  cities: City[];
}
