import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { State } from './state.entity';

/**
 * Represents a city or municipality within a state or province.
 * Cities are third-level geographic units under states.
 */
@Entity({ name: 'cities' })
@Unique(['name', 'state'])
export class City {
  /**
   * Unique identifier of the city.
   */
  @ApiProperty({ example: 100, description: 'Unique ID of the city' })
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Official name of the city (e.g., "San Francisco").
   */
  @ApiProperty({ example: 'San Francisco', description: 'City name' })
  @Column({ length: 100 })
  @Index()
  name: string;

  /**
   * Slugified version of the city name, used for URL-friendly paths.
   */
  @ApiProperty({
    example: 'san-francisco',
    description: 'URL-friendly slug of the city',
    required: false,
  })
  @Column({ nullable: true, unique: true, length: 100 })
  @Index()
  slug?: string;

  /**
   * Localized name translations (e.g., { en: 'San Francisco', es: 'San Francisco' }).
   */
  @ApiProperty({
    example: { en: 'San Francisco', fr: 'San Francisco' },
    description: 'Localized names of the city',
    required: false,
  })
  @Column({ type: 'json', nullable: true })
  nameLocal?: Record<string, string>;

  /**
   * Postal or ZIP code for the city (if applicable).
   */
  @ApiProperty({
    example: '94103',
    description: 'Primary postal code of the city',
    required: false,
  })
  @Column({ nullable: true, length: 20 })
  postalCode?: string;

  /**
   * Approximate latitude of the city's center.
   */
  @ApiProperty({
    example: 37.7749,
    description: 'Geographic latitude of the city center',
    required: false,
  })
  @Column({ type: 'float', nullable: true })
  latitude?: number;

  /**
   * Approximate longitude of the city's center.
   */
  @ApiProperty({
    example: -122.4194,
    description: 'Geographic longitude of the city center',
    required: false,
  })
  @Column({ type: 'float', nullable: true })
  longitude?: number;

  /**
   * State or province this city belongs to.
   */
  @ApiProperty({
    description: 'Parent state or province',
    type: () => State,
  })
  @ManyToOne(() => State, (state) => state.cities, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  state: State;

  /**
   * Foreign key reference for `state`.
   */
  @ApiProperty({ example: 10, description: 'Parent state ID' })
  @RelationId((city: City) => city.state)
  stateId: number;
}
