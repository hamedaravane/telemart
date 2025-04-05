import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Store } from './store.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum Weekday {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

@Entity('store_working_hours')
@Index(['store', 'day'], { unique: false })
export class StoreWorkingHour {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ManyToOne(() => Store, (store) => store.workingHours, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({ type: () => Store })
  store: Store;

  @Column({ type: 'enum', enum: Weekday })
  @ApiProperty({ enum: Weekday })
  day: Weekday;

  @Column()
  @ApiProperty({ example: '09:00' })
  open: string;

  @Column()
  @ApiProperty({ example: '13:00' })
  close: string;

  @Column({ default: 1 })
  @ApiProperty({ example: 1, description: 'Order of the interval for the day' })
  interval: number;
}
