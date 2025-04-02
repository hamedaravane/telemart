import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  Unique,
  RelationId,
} from 'typeorm';
import { Country } from './country.entity';
import { City } from './city.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'states' })
@Unique(['name', 'country'])
export class State {
  @ApiProperty({ description: 'State ID', example: 10 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'State name', example: 'California' })
  @Column()
  @Index()
  name: string;

  @ApiProperty({
    description: 'Slug for URL-friendly names',
    example: 'california',
  })
  @Column({ nullable: true, unique: true })
  @Index()
  slug?: string;

  @ApiProperty({ description: 'State code', example: 'CA' })
  @Column({ nullable: true })
  code: string;

  @ApiProperty({ description: 'Local name translations' })
  @Column({ type: 'json', nullable: true })
  nameLocal: Record<string, string>;

  @ApiProperty({ description: 'Country this state belongs to' })
  @ManyToOne(() => Country, (country) => country.states, {
    onDelete: 'CASCADE',
  })
  country: Country;

  @RelationId((state: State) => state.country)
  countryId: number;

  @ApiProperty({ description: 'Cities in this state', type: () => [City] })
  @OneToMany(() => City, (city) => city.state)
  cities: City[];
}
