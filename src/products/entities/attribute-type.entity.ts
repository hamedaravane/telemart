import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { AttributeValue } from './attribute-values.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('attribute_types')
export class AttributeType {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  name: string;

  @ManyToOne(() => Product, (product) => product.attributeTypes, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @OneToMany(() => AttributeValue, (v) => v.attributeType, {
    cascade: true,
  })
  @ApiProperty({ type: () => [AttributeValue] })
  values: AttributeValue[];
}
