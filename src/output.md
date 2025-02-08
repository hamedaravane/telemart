# TypeScript Files Documentation

- File: ./app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        typeOrmConfig(configService),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

- File: ./payments/payments.controller.ts

```typescript
import {
  Body,
  Controller,
  Get,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return await this.paymentsService.create(createPaymentDto);
  }

  @Get()
  async findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    try {
      return await this.paymentsService.update(id, updatePaymentDto);
    } catch (err) {
      const error = err as Error;
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.paymentsService.remove(id);
    return { message: 'Payment deleted successfully' };
  }
}
```

- File: ./payments/dto/create-payment.dto.ts

```typescript
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumberString,
} from 'class-validator';

export class CreatePaymentDto {
  @IsOptional()
  @IsString()
  orderId?: string;

  @IsNotEmpty()
  @IsNumberString()
  amount: string;

  @IsOptional()
  @IsString()
  fromWalletAddress?: string;

  @IsOptional()
  @IsString()
  toWalletAddress?: string;

  @IsOptional()
  @IsString()
  transactionHash?: string;

  @IsOptional()
  @IsNumberString()
  gasFee?: string;

  @IsOptional()
  @IsNumberString()
  commission?: string;
}
```

- File: ./payments/dto/update-payment.dto.ts

```typescript
import { IsOptional, IsEnum, IsString, IsNumberString } from 'class-validator';
import { PaymentStatus } from '../payment.entity';

export class UpdatePaymentDto {
  @IsOptional()
  @IsEnum(PaymentStatus, { message: 'Invalid payment status' })
  status?: PaymentStatus;

  @IsOptional()
  @IsString()
  transactionHash?: string;

  @IsOptional()
  @IsNumberString()
  gasFee?: string;

  @IsOptional()
  @IsNumberString()
  commission?: string;
}
```

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

- File: ./payments/payments.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment } from './payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
```

- File: ./payments/payments.service.ts

```typescript
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentsRepository.create({
      ...createPaymentDto,
      paymentId: uuidv4(),
      status: PaymentStatus.PENDING,
    });
    this.logger.debug(`Creating new payment with ID: ${payment.paymentId}`);
    return this.paymentsRepository.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentsRepository.find();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    return payment;
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const payment = await this.findOne(id);

    if (updatePaymentDto.status) {
      if (!this.isValidTransition(payment.status, updatePaymentDto.status)) {
        throw new BadRequestException(
          `Invalid state transition from ${payment.status} to ${updatePaymentDto.status}`,
        );
      }
    }

    Object.assign(payment, updatePaymentDto);
    this.logger.debug(
      `Updating payment ${payment.paymentId} to status ${payment.status}`,
    );
    return this.paymentsRepository.save(payment);
  }

  async remove(id: string): Promise<void> {
    const result = await this.paymentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
  }

  private isValidTransition(
    current: PaymentStatus,
    next: PaymentStatus,
  ): boolean {
    const transitions: Record<PaymentStatus, PaymentStatus[]> = {
      [PaymentStatus.PENDING]: [PaymentStatus.PROCESSING, PaymentStatus.FAILED],
      [PaymentStatus.PROCESSING]: [
        PaymentStatus.COMPLETED,
        PaymentStatus.FAILED,
      ],
      [PaymentStatus.COMPLETED]: [],
      [PaymentStatus.FAILED]: [PaymentStatus.REFUNDED],
      [PaymentStatus.REFUNDED]: [],
    };

    return transitions[current].includes(next);
  }
}
```

- File: ./auth/telegram-auth.service.ts

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class TelegramAuthService {
  private secretKey: Buffer;

  validateTelegramData(authData: Record<string, any>): boolean {
    const { hash, ...data } = authData;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN environment variable is not defined');
    }

    if (!this.secretKey) {
      this.secretKey = crypto.createHash('sha256').update(botToken).digest();
    }

    const dataCheckString = Object.keys(data)
      .sort()
      .map((key) => `${key}=${data[key]}`)
      .join('\n');

    const hmac = crypto
      .createHmac('sha256', this.secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (hmac !== hash) {
      throw new UnauthorizedException('Invalid Telegram auth data');
    }
    return true;
  }
}
```

- File: ./config/typeorm.config.ts

```typescript
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: +configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'password'),
  database: configService.get<string>('DB_NAME', 'telemart'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: true,
});
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

- File: ./products/dto/create-product.dto.ts

```typescript
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductType } from '../product.entity';
import { CreateProductAttributeDto } from './create-product-attribute.dto';
import { CreateProductVariantDto } from './create-product-variant.dto';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0, { message: 'Price must be a positive number' })
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUrl({}, { message: 'Invalid image URL' })
  imageUrl: string;

  @IsEnum(ProductType, { message: 'Invalid product type' })
  productType: ProductType;

  @IsOptional()
  @IsString()
  downloadLink?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Stock cannot be negative' })
  stock?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductAttributeDto)
  attributes?: CreateProductAttributeDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants?: CreateProductVariantDto[];
}
```

- File: ./products/dto/create-product-attribute.dto.ts

```typescript
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductAttributeDto {
  @IsString()
  @IsNotEmpty()
  attributeName: string;

  @IsString()
  @IsNotEmpty()
  attributeValue: string;
}
```

- File: ./products/dto/create-product-variant.dto.ts

```typescript
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductVariantDto {
  @IsString()
  @IsNotEmpty()
  variantName: string;

  @IsString()
  @IsNotEmpty()
  variantValue: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Additional price must be a positive number' })
  additionalPrice?: number;
}
```

- File: ./products/dto/update-product.dto.ts

```typescript
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductType } from '../product.entity';
import { CreateProductAttributeDto } from './create-product-attribute.dto';
import { CreateProductVariantDto } from './create-product-variant.dto';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Invalid image URL' })
  imageUrl?: string;

  @IsOptional()
  @IsEnum(ProductType)
  productType?: ProductType;

  @IsOptional()
  @IsString()
  downloadLink?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductAttributeDto)
  attributes?: CreateProductAttributeDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants?: CreateProductVariantDto[];
}
```

- File: ./products/products.service.ts

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const {
      name,
      price,
      productType,
      imageUrl,
      description,
      downloadLink,
      stock,
      attributes,
      variants,
    } = createProductDto;

    const product = this.productsRepository.create({
      name,
      price,
      productType,
      imageUrl,
      description,
      downloadLink,
      stock,
      attributes,
      variants,
    });

    return this.productsRepository.save(product);
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['attributes', 'variants', 'store'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.getProductById(id);
    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['attributes', 'variants', 'store'],
    });
  }
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

- File: ./products/products.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './product.entity';
import { StoresModule } from '../stores/stores.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), StoresModule],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
```

- File: ./products/products.controller.ts

```typescript
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productsService.createProduct(createProductDto);
  }

  @Get(':id')
  async getProductById(@Param('id') id: number): Promise<Product> {
    return this.productsService.getProductById(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productsService.getAllProducts();
  }
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

- File: ./main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

- File: ./stores/stores.service.ts

```typescript
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
  ) {}

  async createStore(createStoreDto: CreateStoreDto): Promise<Store> {
    const {
      name,
      category,
      contactNumber,
      email,
      address,
      logoUrl,
      description,
      socialMediaLinks,
      reputation,
      workingHours,
    } = createStoreDto;

    const existingStore = await this.storesRepository.findOne({
      where: { name },
    });

    if (existingStore) {
      throw new BadRequestException(`Store with name "${name}" already exists`);
    }

    const store = this.storesRepository.create({
      name,
      category,
      contactNumber,
      email,
      address,
      logoUrl,
      description,
      socialMediaLinks,
      reputation,
      workingHours,
    });

    return this.storesRepository.save(store);
  }

  async findById(id: number): Promise<Store> {
    const store = await this.storesRepository.findOne({
      where: { id },
      relations: ['owner', 'products', 'orders', 'reviews'],
    });

    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }

    return store;
  }

  async updateStore(
    id: number,
    updateStoreDto: UpdateStoreDto,
  ): Promise<Store> {
    const store = await this.findById(id);
    Object.assign(store, updateStoreDto);
    return this.storesRepository.save(store);
  }

  async getAllStores(): Promise<Store[]> {
    return this.storesRepository.find({
      relations: ['owner', 'products', 'orders', 'reviews'],
    });
  }
}
```

- File: ./stores/dto/update-store.dto.ts

```typescript
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsObject,
  Max,
  Min,
  IsUrl,
} from 'class-validator';
import { StoreCategory } from '../category.entity';

export class UpdateStoreDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Invalid logo URL' })
  logoUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(StoreCategory, { message: 'Invalid store category' })
  category?: StoreCategory;

  @IsOptional()
  @IsPhoneNumber(undefined, { message: 'Invalid phone number' })
  contactNumber?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsObject({ message: 'Social media links must be an object' })
  socialMediaLinks?: { [platform: string]: string };

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  reputation?: number;

  @IsOptional()
  @IsString()
  workingHours?: string;
}
```

- File: ./stores/dto/create-store.dto.ts

```typescript
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsObject,
  Max,
  Min,
  IsUrl,
} from 'class-validator';
import { StoreCategory } from '../category.entity';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsUrl({}, { message: 'Invalid logo URL' })
  logoUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(StoreCategory, { message: 'Invalid store category' })
  category: StoreCategory;

  @IsOptional()
  @IsPhoneNumber(undefined, { message: 'Invalid phone number' })
  contactNumber?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsObject({ message: 'Social media links must be an object' })
  socialMediaLinks?: { [platform: string]: string };

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  reputation?: number;

  @IsOptional()
  @IsString()
  workingHours?: string;
}
```

- File: ./stores/stores.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { Store } from './store.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), UsersModule],
  providers: [StoresService],
  controllers: [StoresController],
  exports: [StoresService],
})
export class StoresModule {}
```

- File: ./stores/stores.controller.ts

```typescript
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { Store } from './store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createStore(@Body() createStoreDto: CreateStoreDto): Promise<Store> {
    return this.storesService.createStore(createStoreDto);
  }

  @Get(':id')
  async getStoreById(@Param('id') id: number): Promise<Store> {
    return this.storesService.findById(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updateStore(
    @Param('id') id: number,
    @Body() updateStoreDto: UpdateStoreDto,
  ): Promise<Store> {
    return this.storesService.updateStore(id, updateStoreDto);
  }

  @Get()
  async getAllStores(): Promise<Store[]> {
    return this.storesService.getAllStores();
  }
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

- File: ./users/dto/update-user.dto.ts

```typescript
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { UserRole } from '../user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in E.164 format',
  })
  phoneNumber?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be buyer, seller, or both' })
  role?: UserRole;
}
```

- File: ./users/dto/create-user.dto.ts

```typescript
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  telegramId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in E.164 format',
  })
  phoneNumber?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsEnum(UserRole, { message: 'Role must be buyer, seller, or both' })
  role: UserRole;
}
```

- File: ./users/users.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
```

- File: ./users/users.service.ts

```typescript
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const {
      telegramId,
      name,
      role = UserRole.BUYER,
      phoneNumber,
      email,
    } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: { telegramId },
    });

    if (existingUser) {
      throw new BadRequestException(
        `User with Telegram ID ${telegramId} already exists`,
      );
    }

    const user = this.usersRepository.create({
      telegramId,
      name,
      role,
      phoneNumber,
      email,
    });

    return this.usersRepository.save(user);
  }

  async findByTelegramId(telegramId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { telegramId },
      relations: ['stores', 'orders', 'reviews'],
    });

    if (!user) {
      throw new NotFoundException(
        `User with Telegram ID ${telegramId} not found`,
      );
    }

    return user;
  }

  async upgradeToSeller(telegramId: string): Promise<User> {
    const user = await this.findByTelegramId(telegramId);

    if (user.role === UserRole.SELLER || user.role === UserRole.BOTH) {
      throw new BadRequestException(`User is already a seller`);
    }

    user.role = UserRole.BOTH;
    return this.usersRepository.save(user);
  }

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['stores', 'orders'] });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async findOrCreate(authData: Record<string, any>): Promise<User> {
    const telegramId = authData.id as string;
    let user = await this.usersRepository.findOne({ where: { telegramId } });
    if (!user) {
      user = this.usersRepository.create({
        telegramId,
        name:
          authData.first_name +
          (authData.last_name ? ' ' + authData.last_name : ''),
        role: UserRole.BUYER,
      });
      user = await this.usersRepository.save(user);
    }
    return user;
  }
}
```

- File: ./users/users.controller.ts

```typescript
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TelegramAuthService } from '../auth/telegram-auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly telegramAuthService: TelegramAuthService,
  ) {}

  @Post('/telegram-auth')
  async authenticateUser(@Body() authData: Record<string, any>): Promise<User> {
    this.telegramAuthService.validateTelegramData(authData);
    return this.usersService.findOrCreate(authData);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Get(':telegramId')
  async getUserByTelegramId(
    @Param('telegramId') telegramId: string,
  ): Promise<User> {
    return this.usersService.findByTelegramId(telegramId);
  }

  @Patch('upgrade/:telegramId')
  async upgradeToSeller(
    @Param('telegramId') telegramId: string,
  ): Promise<User> {
    return this.usersService.upgradeToSeller(telegramId);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }
}
```

- File: ./reviews/dto/create-review.dto.ts

```typescript
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @IsInt()
  @Min(1, { message: 'Rating must be between 1 and 5' })
  @Max(5, { message: 'Rating must be between 1 and 5' })
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => String)
  @IsUrl({}, { each: true, message: 'Each image URL must be valid' })
  images?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => String)
  @IsUrl({}, { each: true, message: 'Each video URL must be valid' })
  videos?: string[];
}
```

- File: ./reviews/dto/create-review-report.dto.ts

```typescript
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReportReason } from '../review-report.entity';

export class CreateReviewReportDto {
  @IsEnum(ReportReason, { message: 'Invalid report reason' })
  reason: ReportReason;

  @IsOptional()
  @IsString()
  comment?: string;
}
```

- File: ./reviews/dto/create-review-reply.dto.ts

```typescript
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReviewReplyDto {
  @IsString()
  @IsNotEmpty({ message: 'Reply text cannot be empty' })
  replyText: string;
}
```

- File: ./reviews/reviews.controller.ts

```typescript
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateReviewReplyDto } from './dto/create-review-reply.dto';
import { CreateReviewReportDto } from './dto/create-review-report.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    return this.reviewsService.createReview(createReviewDto);
  }

  @Get(':id')
  async getReviewById(@Param('id') id: number): Promise<Review> {
    return this.reviewsService.getReviewById(id);
  }

  @Patch(':id/reply')
  @UsePipes(new ValidationPipe())
  async addReviewReply(
    @Param('id') id: number,
    @Body() createReviewReplyDto: CreateReviewReplyDto,
  ): Promise<Review> {
    return this.reviewsService.addReviewReply(id, createReviewReplyDto);
  }

  @Post(':id/report')
  @UsePipes(new ValidationPipe())
  async reportReview(
    @Param('id') id: number,
    @Body() createReviewReportDto: CreateReviewReportDto,
  ): Promise<Review> {
    return this.reviewsService.reportReview(id, createReviewReportDto);
  }

  @Get()
  async getAllReviews(): Promise<Review[]> {
    return this.reviewsService.getAllReviews();
  }
}
```

- File: ./reviews/reviews.service.ts

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateReviewReplyDto } from './dto/create-review-reply.dto';
import { CreateReviewReportDto } from './dto/create-review-report.dto';
import { ReviewReply } from './review-reply.entity';
import { ReviewReport } from './review-report.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(ReviewReply)
    private repliesRepository: Repository<ReviewReply>,
    @InjectRepository(ReviewReport)
    private reportsRepository: Repository<ReviewReport>,
  ) {}

  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const { rating, comment, images, videos } = createReviewDto;
    const review = this.reviewsRepository.create({
      rating,
      comment,
      images,
      videos,
    });
    return this.reviewsRepository.save(review);
  }

  async getReviewById(id: number): Promise<Review> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: ['replies', 'reports'],
    });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async addReviewReply(
    reviewId: number,
    createReviewReplyDto: CreateReviewReplyDto,
  ): Promise<Review> {
    const review = await this.getReviewById(reviewId);
    const reply = this.repliesRepository.create({
      review,
      replyText: createReviewReplyDto.replyText,
    });
    await this.repliesRepository.save(reply);
    return this.getReviewById(reviewId);
  }

  async reportReview(
    reviewId: number,
    createReviewReportDto: CreateReviewReportDto,
  ): Promise<Review> {
    const review = await this.getReviewById(reviewId);
    const report = this.reportsRepository.create({
      review,
      reason: createReviewReportDto.reason,
      comment: createReviewReportDto.comment,
    });
    await this.reportsRepository.save(report);
    return this.getReviewById(reviewId);
  }

  async getAllReviews(): Promise<Review[]> {
    return this.reviewsRepository.find({ relations: ['replies', 'reports'] });
  }
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

- File: ./reviews/reviews.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review } from './review.entity';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), UsersModule, ProductsModule],
  providers: [ReviewsService],
  controllers: [ReviewsController],
  exports: [ReviewsService],
})
export class ReviewsModule {}
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

- File: ./orders/dto/create-order.dto.ts

```typescript
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../order.entity';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @IsNumber()
  @Min(1, { message: 'Buyer ID must be a valid number' })
  buyerId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @IsOptional()
  @IsEnum(OrderStatus, { message: 'Invalid order status' })
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  shippingAddress?: string;
}
```

- File: ./orders/dto/update-order.dto.ts

```typescript
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../order.entity';
import { CreateOrderItemDto } from './create-order-item.dto';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus, { message: 'Invalid order status' })
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items?: CreateOrderItemDto[];
}
```

- File: ./orders/dto/create-order-item.dto.ts

```typescript
import { IsNumber, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsNumber()
  @Min(1, { message: 'Product ID must be valid' })
  productId: number;

  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}
```

- File: ./orders/dto/create-order-shipment.dto.ts

```typescript
import { IsOptional, IsString } from 'class-validator';

export class CreateOrderShipmentDto {
  @IsString()
  trackingNumber: string;

  @IsString()
  courierService: string;

  @IsOptional()
  @IsString()
  deliveryEstimate?: string;
}
```

- File: ./orders/orders.service.ts

```typescript
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderItem } from './order-item.entity';
import { ProductsService } from '../products/products.service';
import { Store } from '../stores/store.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private productsService: ProductsService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { buyerId, items, shippingAddress, status } = createOrderDto;

    if (!items.length) {
      throw new BadRequestException('An order must contain at least one item.');
    }

    let totalAmount = 0;
    let orderStore: Store | null = null;
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const product = await this.productsService.getProductById(item.productId);
      if (!orderStore) {
        orderStore = product.store;
      } else if (orderStore.id !== product.store.id) {
        throw new BadRequestException('All items must be from the same store.');
      }
      const totalPrice = product.price * item.quantity;
      const orderItem = this.orderItemsRepository.create({
        product: { id: item.productId },
        quantity: item.quantity,
        totalPrice,
      });
      totalAmount += totalPrice;
      orderItems.push(orderItem);
    }

    if (!orderStore) {
      throw new BadRequestException('Order store could not be determined.');
    }

    const order = this.ordersRepository.create({
      buyer: { id: buyerId },
      store: orderStore,
      status: status || OrderStatus.PENDING,
      items: orderItems,
      totalAmount,
      shippingAddress,
    });

    return this.ordersRepository.save(order);
  }

  async getOrderById(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['buyer', 'items', 'shipments', 'store'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updateOrder(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.getOrderById(id);
    Object.assign(order, updateOrderDto);
    return this.ordersRepository.save(order);
  }

  async getAllOrders(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['buyer', 'items', 'shipments', 'store'],
    });
  }
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

- File: ./orders/orders.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './order.entity';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { OrderItem } from './order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    UsersModule,
    ProductsModule,
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
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

- File: ./orders/orders.controller.ts

```typescript
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: number): Promise<Order> {
    return this.ordersService.getOrderById(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updateOrder(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.updateOrder(id, updateOrderDto);
  }

  @Get()
  async getAllOrders(): Promise<Order[]> {
    return this.ordersService.getAllOrders();
  }
}
```

