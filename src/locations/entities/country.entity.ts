import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
  Unique,
} from 'typeorm';
import { State } from './state.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'countries' })
@Unique(['code'])
export class Country {
  @ApiProperty({ description: 'Country ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Unique country code', example: 'US' })
  @Column({ unique: true })
  @Index()
  code: string;

  @ApiProperty({ description: 'Country name', example: 'United States' })
  @Column()
  @Index()
  name: string;

  @ApiProperty({
    description: 'Slug for URL-friendly names',
    example: 'united-states',
  })
  @Column({ nullable: true, unique: true })
  @Index()
  slug?: string;

  @ApiProperty({ description: 'Local name translations' })
  @Column({ type: 'json', nullable: true })
  nameLocal: Record<string, string>;

  @ApiProperty({ description: 'Phone code', example: '+1' })
  @Column({ nullable: true })
  phoneCode: string;

  @ApiProperty({ description: 'Currency', example: 'USD' })
  @Column({ nullable: true })
  currency: string;

  @ApiProperty({ description: 'Region or continent', example: 'North America' })
  @Column({ nullable: true })
  region: string;

  @ApiProperty({ description: 'Capital city', example: 'Washington D.C.' })
  @Column({ nullable: true })
  capital: string;

  @ApiProperty({ description: 'States in this country', type: () => [State] })
  @OneToMany(() => State, (state) => state.country)
  states: State[];
}
