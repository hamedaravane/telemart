import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  Unique,
} from 'typeorm';
import { Country } from './country.entity';
import { City } from './city.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'states' })
@Unique(['name', 'country'])
export class State {
  @ApiProperty({ example: 1, description: 'State ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'California', description: 'State name' })
  @Column()
  @Index()
  name: string;

  @ApiProperty({ example: 'CA', description: 'State code' })
  @Column({ nullable: true })
  code: string;

  @ApiProperty({ description: 'Localized state names' })
  @Column({ type: 'json', nullable: true })
  nameLocal: Record<string, string>;

  @ManyToOne(() => Country, (country) => country.states, {
    onDelete: 'CASCADE',
  })
  country: Country;

  @OneToMany(() => City, (city) => city.state)
  cities: City[];
}
