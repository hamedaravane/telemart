import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { State } from './state.entity';

@Entity({ name: 'countries' })
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'json', nullable: true })
  nameLocal: Record<string, string>;

  @Column({ nullable: true })
  phoneCode: string;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  region: string;

  @Column({ nullable: true })
  capital: string;

  @OneToMany(() => State, (state) => state.country)
  states: State[];
}
