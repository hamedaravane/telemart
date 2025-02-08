# TypeScript Files Documentation

- File: ./payments/payment.entity.ts

```typescript
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  paymentId: string;

  @ManyToOne(() => Order, (order) => order.payments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  order: Order;

  @ManyToOne(() => User, (user) => user.payments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user: User;

  @Column({ type: 'bigint' })
  amount: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ nullable: true })
  @Index()
  transactionHash: string;

  @Column({ nullable: true })
  fromWalletAddress: string;

  @Column({ nullable: true })
  toWalletAddress: string;

  @Column({ type: 'bigint', nullable: true })
  gasFee: string;

  @Column({ type: 'bigint', nullable: true })
  commission: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

- File: ./products/product.entity.ts

```typescript
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Store } from '../stores/store.entity';
import { ProductAttribute } from './product-attribute.entity';
import { ProductVariant } from './product-variant.entity';
import { Review } from '../reviews/review.entity';

export enum ProductType {
  PHYSICAL = 'physical',
  DIGITAL = 'digital',
  SERVICE = 'service',
}

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column()
  imageUrl: string;

  @ManyToOne(() => Store, (store) => store.products, { onDelete: 'CASCADE' })
  store: Store;

  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.PHYSICAL,
  })
  productType: ProductType;

  @OneToMany(() => ProductAttribute, (attribute) => attribute.product, {
    cascade: true,
    eager: true,
  })
  attributes: ProductAttribute[];

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
    eager: true,
  })
  variants: ProductVariant[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @Column({ nullable: true })
  downloadLink?: string;

  @Column({ nullable: true })
  stock?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

- File: ./products/product-attribute.entity.ts

```typescript
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_attributes' })
@Unique(['product', 'attributeName'])
export class ProductAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.attributes, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column({ length: 50 })
  attributeName: string;

  @Column({ length: 255 })
  attributeValue: string;
}
```

- File: ./products/product-variant.entity.ts

```typescript
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_variants' })
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column({ length: 50 })
  variantName: string;

  @Column({ length: 50 })
  variantValue: string;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  additionalPrice?: number;
}
```

- File: ./stores/category.entity.ts

```typescript
export enum StoreCategory {
  ELECTRONICS = 'Electronics',
  CLOTHING = 'Clothing & Fashion',
  GROCERY = 'Grocery & Supermarket',
  HOME_APPLIANCES = 'Home Appliances',
  FURNITURE = 'Furniture & Home Decor',
  JEWELRY = 'Jewelry & Watches',
  SPORTS = 'Sports & Fitness',
  TOYS = 'Toys & Games',
  BEAUTY = 'Beauty & Personal Care',
  PHARMACY = 'Pharmacy & Medical Supplies',
  PET_SUPPLIES = 'Pet Supplies',
  BOOKS = 'Books & Stationery',
  HARDWARE = 'Hardware & Tools',
  AUTOMOTIVE = 'Automotive & Accessories',

  RESTAURANT = 'Restaurant & Fast Food',
  CAFE = 'Cafe & Coffee Shop',
  BAKERY = 'Bakery & Pastry Shop',
  FARMERS_MARKET = 'Farmers Market & Organic Produce',
  LIQUOR_STORE = 'Liquor & Beverage Store',

  SOFTWARE = 'Software & SaaS',
  FREELANCE = 'Freelance Services',
  GRAPHIC_DESIGN = 'Graphic & Web Design',
  MARKETING_AGENCY = 'Marketing & Advertising Agency',
  IT_SERVICES = 'IT & Technical Support',
  ONLINE_COURSES = 'Online Courses & Education',
  SUBSCRIPTIONS = 'Subscription-based Services',

  LEGAL = 'Legal Services',
  FINANCIAL_SERVICES = 'Financial & Accounting Services',
  CONSULTING = 'Business & Management Consulting',
  REAL_ESTATE = 'Real Estate Services',
  HEALTHCARE = 'Healthcare & Medical Consultation',
  FITNESS_TRAINING = 'Personal Training & Coaching',

  EVENT_PLANNING = 'Event Planning & Wedding Services',
  PHOTOGRAPHY = 'Photography & Videography',
  MUSIC_PRODUCTION = 'Music Production & DJ Services',
  ART_GALLERY = 'Art Gallery & Handmade Crafts',
  GAMING = 'Gaming & eSports',
  FILM_PRODUCTION = 'Film & Video Production',

  CLEANING = 'Cleaning Services',
  HOME_REPAIR = 'Home Repair & Maintenance',
  MOVING_SERVICE = 'Moving & Relocation Services',
  BEAUTY_SALON = 'Beauty Salon & Spa',
  TUTORING = 'Tutoring & Private Lessons',
  CHILDCARE = 'Childcare & Babysitting',

  CAR_RENTAL = 'Car Rental & Taxi Services',
  MECHANIC = 'Car Repair & Mechanic Services',
  TRAVEL_AGENCY = 'Travel Agency & Tour Guides',
  COURIER = 'Courier & Delivery Services',

  MANUFACTURING = 'Manufacturing & Production',
  WHOLESALE = 'Wholesale & Bulk Supply',
  AGRICULTURE = 'Agriculture & Farming Supplies',
  CONSTRUCTION = 'Construction & Engineering Services',

  OTHER = 'Other',
}
```

- File: ./stores/store.entity.ts

```typescript
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
```

- File: ./users/user.entity.ts

```typescript
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../orders/order.entity';
import { Review } from '../reviews/review.entity';
import { Store } from '../stores/store.entity';
import { Payment } from '../payments/payment.entity';

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  BOTH = 'both',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  telegramId: string;

  @Column()
  name: string;

  @Column({ unique: true, nullable: true, length: 20 })
  phoneNumber?: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.BUYER })
  role: UserRole;

  @Column({ nullable: true })
  walletAddress?: string;

  @OneToMany(() => Order, (order) => order.buyer)
  orders: Order[];

  @OneToMany(() => Review, (review) => review.buyer)
  reviews: Review[];

  @OneToMany(() => Store, (store) => store.owner)
  stores: Store[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
```

- File: ./reviews/review.entity.ts

```typescript
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { ReviewReply } from './review-reply.entity';
import { ReviewReport } from './review-report.entity';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  buyer: User;

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column({ type: 'int', default: 5 })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ type: 'simple-array', nullable: true })
  images?: string[];

  @Column({ type: 'simple-array', nullable: true })
  videos?: string[];

  @OneToMany(() => ReviewReply, (reply) => reply.review, { cascade: true })
  replies: ReviewReply[];

  @OneToMany(() => ReviewReport, (report) => report.review, { cascade: true })
  reports: ReviewReport[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

- File: ./reviews/review-report.entity.ts

```typescript
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Review } from './review.entity';

export enum ReportReason {
  SPAM = 'Spam',
  INAPPROPRIATE = 'Inappropriate Content',
  FAKE_REVIEW = 'Fake Review',
}

@Entity({ name: 'review_reports' })
export class ReviewReport {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Review, (review) => review.reports, { onDelete: 'CASCADE' })
  review: Review;

  @ManyToOne(() => User, { eager: true })
  reportedBy: User;

  @Column({ type: 'enum', enum: ReportReason })
  reason: ReportReason;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @CreateDateColumn()
  reportedAt: Date;
}
```

- File: ./reviews/review-reply.entity.ts

```typescript
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Review } from './review.entity';

@Entity({ name: 'review_replies' })
export class ReviewReply {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Review, (review) => review.replies, { onDelete: 'CASCADE' })
  review: Review;

  @ManyToOne(() => User, { eager: true })
  seller: User;

  @Column({ type: 'text' })
  replyText: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

- File: ./orders/order.entity.ts

```typescript
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderShipment } from './order-shipment.entity';
import { Payment } from '../payments/payment.entity';
import { Store } from '../stores/store.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  REFUNDED = 'refunded',
}

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  buyer: User;

  @ManyToOne(() => Store, (store) => store.orders, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  store: Store;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];

  @OneToMany(() => OrderShipment, (shipment) => shipment.order, {
    cascade: true,
  })
  shipments: OrderShipment[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ nullable: true })
  paymentTransactionId: string;

  @Column({ nullable: true })
  shippingAddress: string;

  @Column({ type: 'timestamp', nullable: true })
  deliveryDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

- File: ./orders/order-shipment.entity.ts

```typescript
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'order_shipments' })
export class OrderShipment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.shipments, { onDelete: 'CASCADE' })
  order: Order;

  @Column()
  trackingNumber: string;

  @Column()
  courierService: string;

  @Column({ type: 'timestamp', nullable: true })
  deliveryEstimate: Date;

  @CreateDateColumn()
  shippedAt: Date;
}
```

- File: ./orders/order-item.entity.ts

```typescript
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../products/product.entity';

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;
}
```

