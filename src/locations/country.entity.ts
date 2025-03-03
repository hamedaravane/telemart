import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { State } from './state.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'countries' })
export class Country {
  @ApiProperty({ description: 'Country ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Country code', example: 'US' })
  @Column({ unique: true })
  code: string;

  @ApiProperty({ description: 'Country name', example: 'United States' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Local name translations' })
  @Column({ type: 'json', nullable: true })
  nameLocal: Record<string, string>;

  @ApiProperty({ description: 'Phone code', example: '+1' })
  @Column({ nullable: true })
  phoneCode: string;

  @ApiProperty({ description: 'Currency', example: 'USD' })
  @Column({ nullable: true })
  currency: string;

  @ApiProperty({ description: 'Geographical region', example: 'North America' })
  @Column({ nullable: true })
  region: string;

  @ApiProperty({ description: 'Capital city', example: 'Washington D.C.' })
  @Column({ nullable: true })
  capital: string;

  @ApiProperty({ description: 'List of states in the country', type: [State] })
  @OneToMany(() => State, (state) => state.country)
  states: State[];
}
