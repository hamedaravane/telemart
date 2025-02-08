import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { Order } from '../orders/order.entity';
import { StoreCategory } from './category.entity';

@Entity({ name: 'stores' })
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true })
  logoUrl?: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({
    type: 'enum',
    enum: StoreCategory,
    default: StoreCategory.OTHER,
  })
  category: StoreCategory;

  @ManyToOne(() => User, (user) => user.stores, { onDelete: 'CASCADE' })
  owner: User;

  @ManyToMany(() => User)
  @JoinTable()
  admins: User[];

  @OneToMany(() => Product, (product) => product.store)
  products: Product[];

  @OneToMany(() => Order, (order) => order.store)
  orders: Order[];

  @Column({ nullable: true, length: 20 })
  contactNumber?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true, type: 'simple-json' })
  socialMediaLinks?: { [platform: string]: string };

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 5.0 })
  reputation: number;

  @Column({ nullable: true })
  workingHours?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
