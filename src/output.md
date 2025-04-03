# TypeScript Files Documentation

- File: ./locations/address.entity.ts

```typescript
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';
import { Country } from './country.entity';
import { State } from './state.entity';
import { City } from './city.entity';
import { Store } from '../stores/store.entity';

export enum AddressType {
  USER = 'user',
  STORE = 'store',
  SHIPPING = 'shipping',
  BILLING = 'billing',
  PICKUP = 'pickup',
}

@Entity('addresses')
export class Address {
  @ApiProperty({ example: 1, description: 'Unique address ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '221B Baker Street' })
  @Column()
  streetLine1: string;

  @ApiProperty({ example: 'Flat B', required: false })
  @Column({ nullable: true })
  streetLine2?: string;

  @ApiProperty({ example: 'NW1 6XE', required: false })
  @Column({ nullable: true })
  postalCode?: string;

  @ApiProperty({ example: 48.8566 })
  @Column({ type: 'decimal', precision: 10, scale: 6 })
  @Index()
  latitude: number;

  @ApiProperty({ example: 2.3522 })
  @Column({ type: 'decimal', precision: 10, scale: 6 })
  @Index()
  longitude: number;

  @ApiProperty({ example: 'Home', required: false })
  @Column({ nullable: true })
  label?: string;

  @ApiProperty({ enum: AddressType })
  @Column({ type: 'enum', enum: AddressType })
  type: AddressType;

  @ApiProperty({ example: true })
  @Column({ default: false })
  isDefault: boolean;

  @ApiProperty({ type: () => Country, required: false })
  @ManyToOne(() => Country, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  country?: Country;

  @ApiProperty({ type: () => State, required: false })
  @ManyToOne(() => State, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  state?: State;

  @ApiProperty({ type: () => City, required: false })
  @ManyToOne(() => City, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  city?: City;

  @ApiProperty({ type: () => User, required: false })
  @ManyToOne(() => User, (user) => user.addresses, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: User;

  @ApiProperty({ type: () => Store, required: false })
  @ManyToOne(() => Store, (store) => store.addresses, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  store?: Store;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
```

- File: ./locations/city.entity.ts

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  Unique,
  RelationId,
} from 'typeorm';
import { State } from './state.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'cities' })
@Unique(['name', 'state'])
export class City {
  @ApiProperty({ description: 'City ID', example: 100 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'City name', example: 'San Francisco' })
  @Column()
  @Index()
  name: string;

  @ApiProperty({ description: 'Slug for the city', example: 'san-francisco' })
  @Column({ nullable: true, unique: true })
  @Index()
  slug?: string;

  @ApiProperty({ description: 'Local name translations' })
  @Column({ type: 'json', nullable: true })
  nameLocal: Record<string, string>;

  @ApiProperty({ description: 'Postal code', example: '94103' })
  @Column({ nullable: true })
  postalCode: string;

  @ApiProperty({ description: 'Latitude', example: 37.7749 })
  @Column({ type: 'float', nullable: true })
  latitude: number;

  @ApiProperty({ description: 'Longitude', example: -122.4194 })
  @Column({ type: 'float', nullable: true })
  longitude: number;

  @ApiProperty({ description: 'State this city belongs to' })
  @ManyToOne(() => State, (state) => state.cities, { onDelete: 'CASCADE' })
  state: State;

  @RelationId((city: City) => city.state)
  stateId: number;
}
```

- File: ./locations/country.entity.ts

```typescript
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
```

- File: ./locations/state.entity.ts

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  Unique,
  RelationId,
} from 'typeorm';
import { Country } from './country.entity';
import { City } from './city.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'states' })
@Unique(['name', 'country'])
export class State {
  @ApiProperty({ description: 'State ID', example: 10 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'State name', example: 'California' })
  @Column()
  @Index()
  name: string;

  @ApiProperty({
    description: 'Slug for URL-friendly names',
    example: 'california',
  })
  @Column({ nullable: true, unique: true })
  @Index()
  slug?: string;

  @ApiProperty({ description: 'State code', example: 'CA' })
  @Column({ nullable: true })
  code: string;

  @ApiProperty({ description: 'Local name translations' })
  @Column({ type: 'json', nullable: true })
  nameLocal: Record<string, string>;

  @ApiProperty({ description: 'Country this state belongs to' })
  @ManyToOne(() => Country, (country) => country.states, {
    onDelete: 'CASCADE',
  })
  country: Country;

  @RelationId((state: State) => state.country)
  countryId: number;

  @ApiProperty({ description: 'Cities in this state', type: () => [City] })
  @OneToMany(() => City, (city) => city.state)
  cities: City[];
}
```

- File: ./market/market.entity.ts

```typescript
import { ProductPreview, ProductType } from '../products/product.entity';
import { StorePreview } from '../stores/store.entity';
import { ApiProperty } from '@nestjs/swagger';

export class MarketPageResponse {
  @ApiProperty({
    type: [ProductPreview],
    description: 'List of featured products',
  })
  featuredProducts: ProductPreview[];

  @ApiProperty({
    properties: {
      [ProductType.SERVICE]: {
        type: [ProductPreview],
        description: 'List of services',
      },
      [ProductType.PHYSICAL]: {
        type: [ProductPreview],
        description: 'List of physical products',
      },
      [ProductType.DIGITAL]: {
        type: [ProductPreview],
        description: 'List of digital products',
      },
    },
    description: 'Products categorized by type',
  })
  categoryProducts: {
    [ProductType.SERVICE]: ProductPreview[];
    [ProductType.PHYSICAL]: ProductPreview[];
    [ProductType.DIGITAL]: ProductPreview[];
  };

  @ApiProperty({
    type: [StorePreview],
    description: 'List of top-rated stores',
  })
  topRatedStores: StorePreview[];

  @ApiProperty({
    type: [ProductPreview],
    description: 'List of recent products',
  })
  recentProducts: ProductPreview[];
}
```

- File: ./orders/order-item.entity.ts

```typescript
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../products/product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'order_items' })
export class OrderItem {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @ApiProperty({ example: 2 })
  @Column()
  quantity: number;

  @ApiProperty({ example: 99.99 })
  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;
}
```

- File: ./orders/order-shipment.entity.ts

```typescript
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity({ name: 'order_shipments' })
export class OrderShipment {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => Order })
  @OneToOne(() => Order, (order) => order.shipment, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: Order;

  @ApiProperty({ example: 'TRACK123456789' })
  @Column()
  trackingNumber: string;

  @ApiProperty({ example: 'DHL' })
  @Column()
  courierService: string;

  @ApiPropertyOptional({ example: '2024-06-20T12:00:00Z' })
  @Column({ type: 'timestamp', nullable: true })
  deliveryEstimate?: Date;

  @ApiProperty({ type: Date })
  @CreateDateColumn()
  shippedAt: Date;
}
```

- File: ./orders/order.entity.ts

```typescript
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Store } from '../stores/store.entity';
import { OrderItem } from './order-item.entity';
import { OrderShipment } from './order-shipment.entity';
import { Payment } from '../payments/payment.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  @ApiProperty({ example: 1001 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Buyer who placed the order' })
  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  buyer: User;

  @ApiProperty({ description: 'Store where the order was placed' })
  @ManyToOne(() => Store, (store) => store.orders, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  store: Store;

  @ApiProperty({ enum: OrderStatus })
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @ApiProperty({ type: () => [OrderItem] })
  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @ApiProperty({ type: () => OrderShipment })
  @OneToOne(() => OrderShipment, (shipment) => shipment.order, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  shipment?: OrderShipment;

  @ApiProperty({ type: () => Payment })
  @OneToOne(() => Payment, (payment) => payment.order, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  payment?: Payment;

  @ApiProperty({ example: 250.5 })
  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @ApiPropertyOptional({ example: '2024-06-15T14:00:00Z' })
  @Column({ type: 'timestamp', nullable: true })
  deliveryDate?: Date;

  @ApiProperty({ type: Date })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: Date })
  @UpdateDateColumn()
  updatedAt: Date;
}
```

- File: ./payments/payment.entity.ts

```typescript
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Payment ID (UUID)',
    example: 'd4378b50-9cd9-47ee-b733-bec04e8af001',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Unique payment reference ID',
    example: 'pay_20250402_abc',
  })
  @Column({ unique: true })
  paymentId: string;

  @ApiPropertyOptional({ description: 'Associated order (nullable)' })
  @OneToOne(() => Order, (order) => order.payment, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  order?: Order;

  @ApiPropertyOptional({ description: 'User who made the payment (nullable)' })
  @ManyToOne(() => User, (user) => user.payments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user?: User;

  @ApiProperty({
    description: 'Payment amount in smallest unit (e.g. cents)',
    example: '1000',
  })
  @Column({ type: 'bigint' })
  amount: string;

  @ApiProperty({ enum: PaymentStatus, description: 'Status of the payment' })
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @ApiPropertyOptional({
    description: 'Transaction hash on blockchain',
    example: '0xabc123...',
  })
  @Column({ nullable: true })
  @Index()
  transactionHash?: string;

  @ApiPropertyOptional({
    description: 'Sender wallet address',
    example: '0xsender123...',
  })
  @Column({ nullable: true })
  fromWalletAddress?: string;

  @ApiPropertyOptional({
    description: 'Receiver wallet address',
    example: '0xreceiver456...',
  })
  @Column({ nullable: true })
  toWalletAddress?: string;

  @ApiPropertyOptional({
    description: 'Estimated gas fee (bigint string)',
    example: '20000',
  })
  @Column({ type: 'bigint', nullable: true })
  gasFee?: string;

  @ApiPropertyOptional({
    description: 'Commission applied to payment (bigint string)',
    example: '300',
  })
  @Column({ type: 'bigint', nullable: true })
  commission?: string;

  @ApiProperty({ description: 'When the payment was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When the payment was last updated' })
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
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'product_attributes' })
@Unique(['product', 'attributeName'])
export class ProductAttribute {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.attributes, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ApiProperty({ example: 'Color' })
  @Column({ length: 50 })
  attributeName: string;

  @ApiProperty({ example: 'Black' })
  @Column({ length: 255 })
  attributeValue: string;
}
```

- File: ./products/product-variant.entity.ts

```typescript
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'product_variants' })
export class ProductVariant {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ApiProperty({ example: 'Size' })
  @Column({ length: 50 })
  variantName: string;

  @ApiProperty({ example: 'M' })
  @Column({ length: 50 })
  variantValue: string;

  @ApiProperty({ example: 5.99, nullable: true })
  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  additionalPrice?: number;
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
  Index,
} from 'typeorm';
import { Store } from '../stores/store.entity';
import { ProductAttribute } from './product-attribute.entity';
import { ProductVariant } from './product-variant.entity';
import { Review } from '../reviews/review.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum ProductType {
  PHYSICAL = 'physical',
  DIGITAL = 'digital',
  SERVICE = 'service',
}

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({ example: 1, description: 'Product ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Wireless Headphones' })
  @Column({ length: 150 })
  name: string;

  @ApiProperty({ example: 'wireless-headphones', required: false })
  @Column({ nullable: true, unique: true })
  @Index()
  slug?: string;

  @ApiProperty({ example: 199.99 })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ required: false })
  @Column({ nullable: true, type: 'text' })
  description?: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @Column()
  imageUrl: string;

  @ApiProperty({ type: () => Store })
  @ManyToOne(() => Store, (store) => store.products, { onDelete: 'CASCADE' })
  store: Store;

  @ApiProperty({ enum: ProductType })
  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.PHYSICAL,
  })
  productType: ProductType;

  @ApiProperty({ type: () => [ProductAttribute] })
  @OneToMany(() => ProductAttribute, (attribute) => attribute.product, {
    cascade: true,
    eager: true,
  })
  attributes: ProductAttribute[];

  @ApiProperty({ type: () => [ProductVariant] })
  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
    eager: true,
  })
  variants: ProductVariant[];

  @ApiProperty({ type: () => [Review] })
  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  downloadLink?: string;

  @ApiProperty({ example: 10, required: false })
  @Column({ nullable: true })
  stock?: number;

  @ApiProperty({ example: true })
  @Column({ default: false })
  isApproved: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
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
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'review_replies' })
export class ReviewReply {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The review this reply belongs to' })
  @ManyToOne(() => Review, (review) => review.replies, { onDelete: 'CASCADE' })
  review: Review;

  @ApiProperty({ description: 'Seller responding to the review' })
  @ManyToOne(() => User, { eager: true })
  seller: User;

  @ApiProperty({ example: 'Thanks for your feedback!' })
  @Column({ type: 'text' })
  replyText: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ReportReason {
  SPAM = 'Spam',
  INAPPROPRIATE = 'Inappropriate Content',
  FAKE_REVIEW = 'Fake Review',
  HARASSMENT = 'Harassment or Hate Speech',
  OFFENSIVE_LANGUAGE = 'Offensive or Abusive Language',
  MISLEADING_INFORMATION = 'Misleading or False Information',
  PRIVACY_VIOLATION = 'Privacy Violation (Personal Information)',
  COPYRIGHT_INFRINGEMENT = 'Copyright or Trademark Violation',
  SCAM = 'Scam or Fraudulent Activity',
  UNAUTHORIZED_ADVERTISING = 'Unauthorized Advertising or Promotion',
  IRRELEVANT_CONTENT = 'Irrelevant or Off-Topic Content',
  BULLYING = 'Bullying or Threats',
  VIOLENCE = 'Violence or Dangerous Content',
  SELF_PROMOTION = 'Excessive Self-Promotion',
  ILLEGAL_ACTIVITY = 'Illegal or Unlawful Content',
  OTHER = 'Other',
}

@Entity({ name: 'review_reports' })
export class ReviewReport {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Review being reported' })
  @ManyToOne(() => Review, (review) => review.reports, { onDelete: 'CASCADE' })
  review: Review;

  @ApiProperty({ description: 'User who submitted the report' })
  @ManyToOne(() => User, { eager: true })
  reportedBy: User;

  @ApiProperty({ enum: ReportReason })
  @Column({ type: 'enum', enum: ReportReason })
  reason: ReportReason;

  @ApiPropertyOptional({ type: String, nullable: true })
  @Column({ type: 'text', nullable: true })
  comment?: string;

  @ApiProperty()
  @CreateDateColumn()
  reportedAt: Date;
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
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'reviews' })
export class Review {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'User who wrote the review' })
  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  buyer: User;

  @ApiProperty({ description: 'Product being reviewed' })
  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ApiProperty({ minimum: 1, maximum: 5, example: 4 })
  @Column({ type: 'int', default: 5 })
  rating: number;

  @ApiProperty({ description: 'Optional comment', nullable: true })
  @Column({ type: 'text', nullable: true })
  comment?: string;

  @ApiProperty({ type: [String], nullable: true })
  @Column({ type: 'simple-array', nullable: true })
  images?: string[];

  @ApiProperty({ type: [String], nullable: true })
  @Column({ type: 'simple-array', nullable: true })
  videos?: string[];

  @ApiProperty({ type: () => [ReviewReply] })
  @OneToMany(() => ReviewReply, (reply) => reply.review, { cascade: true })
  replies: ReviewReply[];

  @ApiProperty({ type: () => [ReviewReport] })
  @OneToMany(() => ReviewReport, (report) => report.review, { cascade: true })
  reports: ReviewReport[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
```

- File: ./stores/store.entity.ts

```typescript
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { Order } from '../orders/order.entity';
import { Address } from '../locations/address.entity';

@Entity('stores')
export class Store {
  @ApiProperty({ example: 1, description: 'Store ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'MegaTech Store', description: 'Store name' })
  @Column({ length: 100 })
  name: string;

  @ApiPropertyOptional({
    example: 'mega-tech-store',
    description: 'Store slug',
  })
  @Column({ nullable: true, unique: true })
  @Index()
  slug?: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @Column({ nullable: true })
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'Store description' })
  @Column({ nullable: true, type: 'text' })
  description?: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.stores, { onDelete: 'CASCADE' })
  owner: User;

  @ApiProperty({ type: () => User, isArray: true })
  @ManyToMany(() => User)
  @JoinTable()
  admins: User[];

  @OneToMany(() => Product, (product) => product.store)
  products: Product[];

  @OneToMany(() => Order, (order) => order.store)
  orders: Order[];

  @ApiProperty({ example: '+1234567890', required: false })
  @Column({ nullable: true, length: 20 })
  contactNumber?: string;

  @ApiProperty({ example: 'store@example.com', required: false })
  @Column({ nullable: true })
  email?: string;

  @OneToMany(() => Address, (address) => address.store)
  addresses?: Address[];

  @ApiPropertyOptional({
    description: 'Store social media links',
    example: {
      instagram: 'https://instagram.com/store',
      facebook: 'https://facebook.com/store',
    },
  })
  @Column({ nullable: true, type: 'simple-json' })
  socialMediaLinks?: Record<string, string>;

  @ApiProperty({ example: 4.7, description: 'Reputation score (1–5)' })
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 5.0 })
  reputation: number;

  @ApiPropertyOptional({
    example: {
      monday: { open: '09:00', close: '18:00' },
      sunday: { open: '11:00', close: '15:00' },
    },
    description: 'Working hours by weekday',
  })
  @Column({ nullable: true, type: 'json' })
  workingHours?: Record<string, { open: string; close: string }>;

  @ApiProperty({ example: ['tech', 'gaming'], required: false })
  @Column({ nullable: true, type: 'simple-array' })
  tags?: string[];

  @ApiProperty({ example: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiPropertyOptional()
  @DeleteDateColumn()
  deletedAt?: Date;
}
```

- File: ./users/user.entity.ts

```typescript
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../orders/order.entity';
import { Review } from '../reviews/review.entity';
import { Store } from '../stores/store.entity';
import { Payment } from '../payments/payment.entity';
import { Address } from '../locations/address.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  BOTH = 'both',
}

@Entity('users')
export class User {
  @ApiProperty({ example: 1, description: 'User ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '123456789', description: 'Telegram ID' })
  @Column({ unique: true })
  @Index()
  telegramId: string;

  @ApiProperty({ example: 'Alice', description: 'First name' })
  @Column()
  firstName: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'Last name' })
  @Column({ nullable: true })
  lastName?: string;

  @ApiPropertyOptional({
    example: 'alice_handle',
    description: 'Telegram username',
  })
  @Column({ nullable: true })
  username?: string;

  @ApiPropertyOptional({ example: 'en', description: 'Preferred language' })
  @Column({ nullable: true })
  languageCode?: string;

  @ApiPropertyOptional({ example: true, description: 'Has Telegram Premium' })
  @Column({ nullable: true })
  hasTelegramPremium?: boolean;

  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg' })
  @Column({ nullable: true })
  photoUrl?: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @Column({ unique: true, nullable: true, length: 20 })
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'alice@example.com' })
  @Column({ unique: true, nullable: true })
  email?: string;

  @ApiProperty({ enum: UserRole, default: UserRole.BUYER })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.BUYER })
  role: UserRole;

  @ApiPropertyOptional({
    example: '0xABC123...',
    description: 'User wallet address',
  })
  @Column({ nullable: true })
  walletAddress?: string;

  @ApiProperty({ type: () => Address, isArray: true })
  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => Order, (order) => order.buyer)
  orders: Order[];

  @OneToMany(() => Review, (review) => review.buyer)
  reviews: Review[];

  @OneToMany(() => Store, (store) => store.owner)
  stores: Store[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiPropertyOptional()
  @DeleteDateColumn()
  deletedAt?: Date;
}
```

