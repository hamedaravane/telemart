import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AttributeType } from './attribute-type.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('attribute_values')
export class AttributeValue {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  value: string;

  @ManyToOne(() => AttributeType, (type) => type.values, {
    onDelete: 'CASCADE',
  })
  attributeType: AttributeType;
}
