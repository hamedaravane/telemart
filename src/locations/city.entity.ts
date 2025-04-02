import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  Unique,
} from 'typeorm';
import { State } from './state.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'cities' })
@Unique(['name', 'state'])
export class City {
  @ApiProperty({ example: 1, description: 'City ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'San Francisco', description: 'City name' })
  @Column()
  @Index()
  name: string;

  @ApiProperty({ description: 'Localized city names' })
  @Column({ type: 'json', nullable: true })
  nameLocal: Record<string, string>;

  @ApiProperty({ example: '94105', description: 'Postal code' })
  @Column({ nullable: true })
  postalCode: string;

  @ApiProperty({ example: 37.7749, description: 'Latitude of the city' })
  @Column({ type: 'float', nullable: true })
  latitude: number;

  @ApiProperty({ example: -122.4194, description: 'Longitude of the city' })
  @Column({ type: 'float', nullable: true })
  longitude: number;

  @ManyToOne(() => State, (state) => state.cities, { onDelete: 'CASCADE' })
  state: State;
}
