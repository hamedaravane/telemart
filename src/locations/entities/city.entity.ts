import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  Unique,
  RelationId,
} from 'typeorm';
import { State } from './state.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'cities' })
@Unique(['name', 'state'])
export class City {
  @ApiProperty({ description: 'City ID', example: 100 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'City name', example: 'San Francisco' })
  @Column()
  @Index()
  name: string;

  @ApiProperty({ description: 'Slug for the city', example: 'san-francisco' })
  @Column({ nullable: true, unique: true })
  @Index()
  slug?: string;

  @ApiProperty({ description: 'Local name translations' })
  @Column({ type: 'json', nullable: true })
  nameLocal: Record<string, string>;

  @ApiProperty({ description: 'Postal code', example: '94103' })
  @Column({ nullable: true })
  postalCode: string;

  @ApiProperty({ description: 'Latitude', example: 37.7749 })
  @Column({ type: 'float', nullable: true })
  latitude: number;

  @ApiProperty({ description: 'Longitude', example: -122.4194 })
  @Column({ type: 'float', nullable: true })
  longitude: number;

  @ApiProperty({ description: 'State this city belongs to' })
  @ManyToOne(() => State, (state) => state.cities, { onDelete: 'CASCADE' })
  state: State;

  @RelationId((city: City) => city.state)
  stateId: number;
}
