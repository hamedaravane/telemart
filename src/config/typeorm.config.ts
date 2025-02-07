import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Payment } from '../payments/payment.entity';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { Review } from '../reviews/review.entity';
import { Store } from '../stores/store.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'ecommerce_db',
  entities: [Order, Payment, Product, Review, Store, User],
  synchronize: true,
  logging: true,
};
