import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { State } from './state.entity';

@Entity({ name: 'cities' })
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'json', nullable: true })
  nameLocal: Record<string, string>;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @ManyToOne(() => State, (state) => state.cities, { onDelete: 'CASCADE' })
  state: State;
}
