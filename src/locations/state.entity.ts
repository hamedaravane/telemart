import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Country } from './country.entity';
import { City } from './city.entity';

@Entity({ name: 'states' })
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  code: string;

  @Column({ type: 'json', nullable: true })
  nameLocal: Record<string, string>;

  @ManyToOne(() => Country, (country) => country.states, {
    onDelete: 'CASCADE',
  })
  country: Country;

  @OneToMany(() => City, (city) => city.state)
  cities: City[];
}
