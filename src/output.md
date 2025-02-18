# TypeScript Files Documentation

- File: ./stores/stores.controller.ts

```typescript
import {
  Body,
  Controller,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateStoreBasicDto,
  CreateStoreCategoryDto,
  CreateStoreLocationDto,
  CreateStoreWorkingHoursDto,
} from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { StoreOwnerGuard } from './store-owner.guard';

@ApiTags('stores')
@ApiBearerAuth()
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post('basic')
  @ApiOperation({ summary: 'Create store basic information' })
  @ApiResponse({
    status: 201,
    description: 'Store basic info created successfully.',
  })
  async createStoreBasic(
    @CurrentUser() user: User,
    @Body() dto: CreateStoreBasicDto,
  ) {
    return await this.storesService.createStoreBasic(user, dto);
  }

  @Patch(':id/location')
  @UseGuards(StoreOwnerGuard)
  @ApiOperation({ summary: 'Update store location information' })
  @ApiResponse({
    status: 200,
    description: 'Store location updated successfully.',
  })
  async updateStoreLocation(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateStoreLocationDto,
  ) {
    return await this.storesService.updateStoreLocation(user, id, dto);
  }

  @Patch(':id/category')
  @UseGuards(StoreOwnerGuard)
  @ApiOperation({ summary: 'Update store category' })
  @ApiResponse({
    status: 200,
    description: 'Store category updated successfully.',
  })
  async updateStoreCategory(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateStoreCategoryDto,
  ) {
    return await this.storesService.updateStoreCategory(user, id, dto);
  }

  @Patch(':id/working-hours')
  @UseGuards(StoreOwnerGuard)
  @ApiOperation({ summary: 'Update store working hours' })
  @ApiResponse({
    status: 200,
    description: 'Store working hours updated successfully.',
  })
  async updateStoreWorkingHours(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateStoreWorkingHoursDto,
  ) {
    return await this.storesService.updateStoreWorkingHours(user, id, dto);
  }

  @Post(':id/logo')
  @UseGuards(StoreOwnerGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload store logo or photo' })
  @ApiResponse({
    status: 200,
    description: 'Store logo updated successfully.',
  })
  async uploadStoreLogo(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /jpeg|png|gif/i })
        .addMaxSizeValidator({ maxSize: 2 * 1024 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    return await this.storesService.uploadStoreLogo(user, id, file);
  }

  @Patch(':id')
  @UseGuards(StoreOwnerGuard)
  @ApiOperation({ summary: 'Update store details' })
  @ApiResponse({ status: 200, description: 'Store updated successfully.' })
  async updateStore(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStoreDto,
  ) {
    return await this.storesService.updateStore(user, id, dto);
  }
}
```

- File: ./stores/dto/update-store.dto.ts

```typescript
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StoreCategory } from '../categories';

export class WorkingHourDto {
  @ApiPropertyOptional({
    description: 'Opening time in HH:mm format',
    example: '08:00',
  })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid open time format. Use HH:mm format',
  })
  open: string;

  @ApiPropertyOptional({
    description: 'Closing time in HH:mm format',
    example: '17:00',
  })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid close time format. Use HH:mm format',
  })
  close: string;
}

export class UpdateStoreDto {
  @ApiPropertyOptional({
    description: 'Name of the store',
    maxLength: 100,
    example: 'My Awesome Store',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'A short description of the store',
    example: 'We offer the best products in town.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Contact number for the store',
    example: '+1-555-1234567',
  })
  @IsOptional()
  @IsString()
  contactNumber?: string;

  @ApiPropertyOptional({
    description: 'Contact email for the store',
    example: 'contact@mystore.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Country identifier (ID)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  country?: number;

  @ApiPropertyOptional({
    description: 'State identifier (ID)',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  state?: number;

  @ApiPropertyOptional({
    description: 'City identifier (ID)',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  city?: number;

  @ApiPropertyOptional({
    description:
      'Working hours for the store. Provide an object where keys represent the day (e.g., "monday") and values are working hours.',
    example: {
      monday: { open: '08:00', close: '17:00' },
      tuesday: { open: '08:00', close: '17:00' },
    },
  })
  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => WorkingHourDto)
  workingHours?: Record<string, WorkingHourDto>;

  @ApiPropertyOptional({
    description: 'Category of the store',
    enum: StoreCategory,
    example: StoreCategory.ELECTRONICS,
  })
  @IsOptional()
  @IsEnum(StoreCategory, { message: 'Invalid store category' })
  category?: StoreCategory;

  @ApiPropertyOptional({
    description: 'URL for the store logo or photo',
    example: 'https://example.com/logo.png',
  })
  @IsOptional()
  @IsString()
  logoUrl?: string;
}
```

- File: ./stores/dto/create-store.dto.ts

```typescript
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StoreCategory } from '../categories';

export class CreateStoreBasicDto {
  @ApiProperty({
    description: 'Name of the store',
    maxLength: 100,
    example: 'My Awesome Store',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'A short description of the store',
    example: 'We offer the best products in town.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'Contact number for the store',
    example: '+1-555-1234567',
  })
  @IsOptional()
  @IsString()
  contactNumber?: string;

  @ApiPropertyOptional({
    description: 'Contact email for the store',
    example: 'contact@mystore.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class CreateStoreLocationDto {
  @ApiPropertyOptional({
    description: 'Country identifier (ID)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  country?: number;

  @ApiPropertyOptional({
    description: 'State identifier (ID)',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  state?: number;

  @ApiPropertyOptional({
    description: 'City identifier (ID)',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  city?: number;
}

export class CreateStoreCategoryDto {
  @ApiProperty({
    description: 'Category of the store',
    enum: StoreCategory,
    example: StoreCategory.ELECTRONICS,
  })
  @IsEnum(StoreCategory, { message: 'Invalid store category' })
  category: StoreCategory;
}

export class WorkingHourDto {
  @ApiProperty({
    description: 'Opening time in HH:mm format',
    example: '08:00',
  })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid open time format. Use HH:mm format',
  })
  open: string;

  @ApiProperty({
    description: 'Closing time in HH:mm format',
    example: '17:00',
  })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid close time format. Use HH:mm format',
  })
  close: string;
}

export class CreateStoreWorkingHoursDto {
  @ApiPropertyOptional({
    description:
      'Working hours for the store. Provide an object where keys represent the day (e.g., "monday") and values are working hours.',
    example: {
      monday: { open: '08:00', close: '17:00' },
      tuesday: { open: '08:00', close: '17:00' },
    },
  })
  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => WorkingHourDto)
  workingHours?: Record<string, WorkingHourDto>;
}

export class CreateStoreLogoDto {
  @ApiProperty({
    description: 'URL for the store logo or photo',
    example: 'https://example.com/logo.png',
  })
  @IsString()
  @IsNotEmpty()
  logoUrl: string;
}
```

- File: ./stores/store-owner.guard.ts

```typescript
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { StoresService } from './stores.service';

@Injectable()
export class StoreOwnerGuard implements CanActivate {
  constructor(private readonly storesService: StoresService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const storeId = parseInt(request.params.id, 10);
    const user = request.user;

    if (!storeId || !user) {
      throw new ForbiddenException('Store ID or user not provided');
    }

    const store = await this.storesService.findStoreById(storeId);
    if (store.owner.id !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to modify this store',
      );
    }
    return true;
  }
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
import { StoreOwnerGuard } from './store-owner.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), UsersModule, ConfigModule],
  providers: [StoresService, StoreOwnerGuard],
  controllers: [StoresController],
  exports: [StoresService],
})
export class StoresModule {}
```

- File: ./stores/store.entity.ts

```typescript
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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
import { StoreCategory } from './categories';
import { Country } from '../locations/country.entity';
import { State } from '../locations/state.entity';
import { City } from '../locations/city.entity';

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

  @ManyToOne(() => Country, { nullable: true })
  country?: Country;

  @ManyToOne(() => State, { nullable: true })
  state?: State;

  @ManyToOne(() => City, { nullable: true })
  city?: City;

  @Column({ nullable: true, type: 'simple-json' })
  socialMediaLinks?: { [platform: string]: string };

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 5.0 })
  reputation: number;

  @Column({ nullable: true, type: 'json' })
  workingHours?: Record<string, { open: string; close: string }>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
```

- File: ./stores/categories.ts

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

- File: ./stores/stores.service.ts

```typescript
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import {
  CreateStoreBasicDto,
  CreateStoreCategoryDto,
  CreateStoreLocationDto,
  CreateStoreWorkingHoursDto,
} from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { User } from '../users/user.entity';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StoresService {
  private s3Client: S3Client;
  private readonly bucketName: string;
  private readonly s3ApiEndpoint: string;

  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>(
      'LIARA_BUCKET_ID',
      'telemart-files',
    );
    this.s3ApiEndpoint = this.configService.get<string>(
      'LIARA_S3_API_ENDPOINT',
      'storage.c2.liara.space',
    );
    this.s3Client = new S3Client({
      region: 'default',
      endpoint: this.s3ApiEndpoint,
    });
  }

  async createStoreBasic(user: User, dto: CreateStoreBasicDto): Promise<Store> {
    const store = this.storeRepository.create({
      ...dto,
      owner: user,
    });
    return await this.storeRepository.save(store);
  }

  async findStoreById(id: number): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!store) {
      throw new NotFoundException(`Store with id ${id} not found`);
    }
    return store;
  }

  async updateStoreLocation(
    user: User,
    id: number,
    dto: CreateStoreLocationDto,
  ): Promise<Store> {
    const store = await this.findStoreById(id);
    Object.assign(store, dto);
    return await this.storeRepository.save(store);
  }

  async updateStoreCategory(
    user: User,
    id: number,
    dto: CreateStoreCategoryDto,
  ): Promise<Store> {
    const store = await this.findStoreById(id);
    store.category = dto.category;
    return await this.storeRepository.save(store);
  }

  async updateStoreWorkingHours(
    user: User,
    id: number,
    dto: CreateStoreWorkingHoursDto,
  ): Promise<Store> {
    const store = await this.findStoreById(id);
    store.workingHours = dto.workingHours;
    return await this.storeRepository.save(store);
  }

  async uploadStoreLogo(
    user: User,
    id: number,
    file: Express.Multer.File,
  ): Promise<Store> {
    const store = await this.findStoreById(id);

    const fileExtension = file.originalname.split('.').pop();
    const fileKey = `stores/${store.id}/${randomUUID()}.${fileExtension}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      });
      await this.s3Client.send(command);
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new InternalServerErrorException('Failed to upload file to S3');
    }

    store.logoUrl = `https://${this.bucketName}.${this.s3ApiEndpoint}/${fileKey}`;
    return await this.storeRepository.save(store);
  }

  async updateStore(
    user: User,
    id: number,
    dto: UpdateStoreDto,
  ): Promise<Store> {
    const store = await this.findStoreById(id);
    Object.assign(store, dto);
    return await this.storeRepository.save(store);
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

- File: ./telegram/types/index.ts

```typescript
export interface ThemeParams {
  /** Background color in the `#RRGGBB` format */
  bg_color?: string;
  /** Main text color in the `#RRGGBB` format */
  text_color?: string;
  /** Hint text color in the `#RRGGBB` format */
  hint_color?: string;
  /** Link color in the `#RRGGBB` format */
  link_color?: string;
  /** Button color in the `#RRGGBB` format */
  button_color?: string;
  /** Button text color in the `#RRGGBB` format */
  button_text_color?: string;
  /** Secondary background color (Bot API 6.1+) in the `#RRGGBB` format */
  secondary_bg_color?: string;
  /** Header background color (Bot API 7.0+) in the `#RRGGBB` format */
  header_bg_color?: string;
  /** Bottom bar background color (Bot API 7.10+) in the `#RRGGBB` format */
  bottom_bar_bg_color?: string;
  /** Accent text color (Bot API 7.0+) in the `#RRGGBB` format */
  accent_text_color?: string;
  /** Section background color (Bot API 7.0+) in the `#RRGGBB` format */
  section_bg_color?: string;
  /** Section header text color (Bot API 7.0+) in the `#RRGGBB` format */
  section_header_text_color?: string;
  /** Section separator color (Bot API 7.6+) in the `#RRGGBB` format */
  section_separator_color?: string;
  /** Subtitle text color (Bot API 7.0+) in the `#RRGGBB` format */
  subtitle_text_color?: string;
  /** Destructive text color (Bot API 7.0+) in the `#RRGGBB` format */
  destructive_text_color?: string;
}

export interface StoryWidgetLink {
  url: string;
  name?: string;
}

export interface StoryShareParams {
  /** Optional caption text (0-200/2048 characters) */
  text?: string;
  widget_link?: StoryWidgetLink;
}

export interface ScanQrPopupParams {
  /** Optional text to be displayed (0-64 characters) */
  text?: string;
}

export interface PopupButton {
  /** Optional button identifier (0-64 characters) */
  id?: string;
  /**
   * Button type. Can be one of:
   * - "default"
   * - "ok"
   * - "close"
   * - "cancel"
   * - "destructive"
   */
  type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
  /** Button text (0-64 characters); required if type is "default" or "destructive" */
  text?: string;
}

export interface PopupParams {
  /** Optional popup title (0-64 characters) */
  title?: string;
  /** Popup message (1-256 characters) */
  message: string;
  /** Optional list of buttons (1-3 items); if omitted defaults to [{ type: 'close' }] */
  buttons?: PopupButton[];
}

export interface EmojiStatusParams {
  /** Optional duration (in seconds) for which the status is set */
  duration?: number;
}

export interface DownloadFileParams {
  /** HTTPS URL of the file to be downloaded */
  url: string;
  /** Suggested filename for the download */
  file_name: string;
}

export interface SafeAreaInset {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface ContentSafeAreaInset {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/** Back button for the Mini App header */
export interface BackButton {
  isVisible: boolean;

  onClick(callback: () => void): BackButton;

  offClick(callback: () => void): BackButton;

  show(): BackButton;

  hide(): BackButton;
}

/** Parameters for updating a BottomButton */
export interface BottomButtonParams {
  text?: string;
  color?: string;
  text_color?: string;
  has_shine_effect?: boolean;
  position?: 'left' | 'right' | 'top' | 'bottom';
  is_active?: boolean;
  is_visible?: boolean;
}

/**
 * BottomButton controls the button displayed at the bottom of the Mini App.
 * There are two types: "main" and "secondary".
 */
export interface BottomButton {
  readonly type: 'main' | 'secondary';
  text: string;
  color: string;
  textColor: string;
  isVisible: boolean;
  isActive: boolean;
  hasShineEffect: boolean;
  /** For secondary button, position can be defined */
  position?: 'left' | 'right' | 'top' | 'bottom';
  readonly isProgressVisible: boolean;

  setText(text: string): BottomButton;

  onClick(callback: () => void): BottomButton;

  offClick(callback: () => void): BottomButton;

  show(): BottomButton;

  hide(): BottomButton;

  enable(): BottomButton;

  disable(): BottomButton;

  showProgress(leaveActive?: boolean): BottomButton;

  hideProgress(): BottomButton;

  setParams(params: BottomButtonParams): BottomButton;
}

/** Settings button in the Mini App context menu */
export interface SettingsButton {
  isVisible: boolean;

  onClick(callback: () => void): SettingsButton;

  offClick(callback: () => void): SettingsButton;

  show(): SettingsButton;

  hide(): SettingsButton;
}

export type HapticStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';
export type HapticNotificationType = 'error' | 'success' | 'warning';

export interface HapticFeedback {
  impactOccurred(style: HapticStyle): HapticFeedback;

  notificationOccurred(type: HapticNotificationType): HapticFeedback;

  selectionChanged(): HapticFeedback;
}

export interface CloudStorage {
  setItem(
    key: string,
    value: string,
    callback?: (error: any, success?: boolean) => void,
  ): CloudStorage;

  getItem(key: string, callback: (error: any, value?: string) => void): void;

  getItems(
    keys: string[],
    callback: (error: any, values?: { [key: string]: string }) => void,
  ): void;

  removeItem(
    key: string,
    callback?: (error: any, success?: boolean) => void,
  ): CloudStorage;

  removeItems(
    keys: string[],
    callback?: (error: any, success?: boolean) => void,
  ): CloudStorage;

  getKeys(callback: (error: any, keys?: string[]) => void): void;
}

export type BiometricType = 'finger' | 'face' | 'unknown';

export interface BiometricManager {
  isInited: boolean;
  isBiometricAvailable: boolean;
  biometricType: BiometricType;
  isAccessRequested: boolean;
  isAccessGranted: boolean;
  isBiometricTokenSaved: boolean;
  deviceId: string;

  init(callback?: () => void): BiometricManager;

  requestAccess(
    params?: BiometricRequestAccessParams,
    callback?: (granted: boolean) => void,
  ): BiometricManager;

  authenticate(
    params?: BiometricAuthenticateParams,
    callback?: (isAuthenticated: boolean, biometricToken?: string) => void,
  ): BiometricManager;

  updateBiometricToken(
    token: string,
    callback?: (isUpdated: boolean) => void,
  ): BiometricManager;

  openSettings(): BiometricManager;
}

export interface BiometricRequestAccessParams {
  /** Optional reason text (0-128 characters) */
  reason?: string;
}

export interface BiometricAuthenticateParams {
  /** Optional reason text (0-128 characters) */
  reason?: string;
}

export interface AccelerometerStartParams {
  /**
   * Refresh rate in milliseconds (20–1000).
   * Default is 1000.
   */
  refresh_rate?: number;
}

export interface Accelerometer {
  isStarted: boolean;
  x: number;
  y: number;
  z: number;

  start(
    params?: AccelerometerStartParams,
    callback?: (started: boolean) => void,
  ): Accelerometer;

  stop(callback?: (stopped: boolean) => void): Accelerometer;
}

export interface DeviceOrientationStartParams {
  refresh_rate?: number;
  /** Set true to receive absolute orientation data (if supported) */
  need_absolute?: boolean;
}

export interface DeviceOrientation {
  isStarted: boolean;
  absolute: boolean;
  alpha: number;
  beta: number;
  gamma: number;

  start(
    params?: DeviceOrientationStartParams,
    callback?: (started: boolean) => void,
  ): DeviceOrientation;

  stop(callback?: (stopped: boolean) => void): DeviceOrientation;
}

export interface GyroscopeStartParams {
  refresh_rate?: number;
}

export interface Gyroscope {
  isStarted: boolean;
  x: number;
  y: number;
  z: number;

  start(
    params?: GyroscopeStartParams,
    callback?: (started: boolean) => void,
  ): Gyroscope;

  stop(callback?: (stopped: boolean) => void): Gyroscope;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  altitude: number | null;
  course: number | null;
  speed: number | null;
  horizontal_accuracy: number | null;
  vertical_accuracy: number | null;
  course_accuracy: number | null;
  speed_accuracy: number | null;
}

export interface LocationManager {
  isInited: boolean;
  isLocationAvailable: boolean;
  isAccessRequested: boolean;
  isAccessGranted: boolean;

  init(callback?: () => void): LocationManager;

  getLocation(
    callback: (locationData: LocationData | null) => void,
  ): LocationManager;

  openSettings(): LocationManager;
}

export interface WebAppUser {
  id: number;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
  allows_write_to_pm?: boolean;
  photo_url?: string;
}

export interface WebAppChat {
  id: number;
  type: 'group' | 'supergroup' | 'channel';
  title: string;
  username?: string;
  photo_url?: string;
}

export interface WebAppInitData {
  query_id?: string;
  user?: WebAppUser;
  receiver?: WebAppUser;
  chat?: WebAppChat;
  chat_type?: 'sender' | 'private' | 'group' | 'supergroup' | 'channel';
  chat_instance?: string;
  start_param?: string;
  can_send_after?: number;
  auth_date: number;
  hash: string;
  signature?: string;
}

export interface WebApp {
  initData: string;
  initDataUnsafe: WebAppInitData;
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: ThemeParams;
  isActive?: boolean;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  bottomBarColor: string;
  isClosingConfirmationEnabled: boolean;
  isVerticalSwipesEnabled: boolean;
  isFullscreen?: boolean;
  isOrientationLocked?: boolean;
  safeAreaInset?: SafeAreaInset;
  contentSafeAreaInset?: ContentSafeAreaInset;
  BackButton: BackButton;
  MainButton: BottomButton;
  SecondaryButton: BottomButton;
  SettingsButton: SettingsButton;
  HapticFeedback: HapticFeedback;
  CloudStorage: CloudStorage;
  BiometricManager: BiometricManager;
  Accelerometer: Accelerometer;
  DeviceOrientation: DeviceOrientation;
  Gyroscope: Gyroscope;
  LocationManager: LocationManager;

  /** Checks if the current Bot API version is at least the given version. */
  isVersionAtLeast: (version: string) => boolean;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setBottomBarColor: (color: string) => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  enableVerticalSwipes: () => void;
  disableVerticalSwipes: () => void;
  requestFullscreen?: () => void;
  exitFullscreen?: () => void;
  lockOrientation?: () => void;
  unlockOrientation?: () => void;
  addToHomeScreen?: () => void;
  checkHomeScreenStatus?: (
    callback?: (status: 'unsupported' | 'unknown' | 'added' | 'missed') => void,
  ) => void;
  onEvent: (eventType: string, eventHandler: (params?: any) => void) => void;
  offEvent: (eventType: string, eventHandler: (params?: any) => void) => void;
  sendData: (data: string) => void;
  switchInlineQuery: (query: string, choose_chat_types?: string) => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink: (url: string) => void;
  openInvoice: (url: string, callback?: (status: any) => void) => void;
  shareToStory?: (media_url: string, params?: StoryShareParams) => void;
  shareMessage?: (
    msg_id: number,
    callback?: (success: boolean) => void,
  ) => void;
  setEmojiStatus?: (
    custom_emoji_id: string,
    params?: EmojiStatusParams,
    callback?: (success: boolean) => void,
  ) => void;
  requestEmojiStatusAccess?: (callback?: (granted: boolean) => void) => void;
  downloadFile?: (
    params: DownloadFileParams,
    callback?: (accepted: boolean) => void,
  ) => void;
  showPopup: (
    params: PopupParams,
    callback?: (button_id: string | null) => void,
  ) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (result: boolean) => void) => void;
  showScanQrPopup?: (
    params: ScanQrPopupParams,
    callback?: (qrText: string) => boolean | void,
  ) => void;
  closeScanQrPopup?: () => void;
  readTextFromClipboard?: (callback?: (text: string | null) => void) => void;
  requestWriteAccess?: (callback?: (granted: boolean) => void) => void;
  requestContact?: (callback?: (shared: boolean) => void) => void;
  ready: () => void;
  expand: () => void;
  close: () => void;
}
```

- File: ./telegram/telegram-user.service.ts

```typescript
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { WebAppInitData, WebAppUser } from './types';
import { ConfigService } from '@nestjs/config';

const DEFAULT24HOURS = 86400;

@Injectable()
export class TelegramUserService {
  private readonly TELEGRAM_BOT_TOKEN: string;

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) throw new InternalServerErrorException();
    this.TELEGRAM_BOT_TOKEN = token;
  }

  validateTelegramInitData(
    initData: string,
    maxAgeSeconds: number = DEFAULT24HOURS,
  ): WebAppInitData {
    const params = new URLSearchParams(initData);
    const data: Record<string, string> = {};
    for (const [key, value] of params.entries()) {
      data[key] = value;
    }

    const receivedHash = data.hash;
    if (!receivedHash) {
      throw new BadRequestException('Missing hash parameter');
    }
    delete data.hash;

    const sortedKeys = Object.keys(data).sort();
    const dataCheckString = sortedKeys
      .map((key) => `${key}=${data[key]}`)
      .join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(this.TELEGRAM_BOT_TOKEN)
      .digest();

    const computedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (computedHash !== receivedHash) {
      throw new BadRequestException('Data integrity check failed');
    }

    if (data.auth_date) {
      const authDate = parseInt(data.auth_date, 10);
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime - authDate > maxAgeSeconds) {
        throw new BadRequestException('Data is outdated');
      }
    }

    return {
      auth_date: data.auth_date ? parseInt(data.auth_date, 10) : 0,
      hash: receivedHash,
      query_id: data.query_id,
      start_param: data.start_param,
      chat_instance: data.chat_instance,
      can_send_after: data.can_send_after
        ? parseInt(data.can_send_after, 10)
        : undefined,
      chat_type: data.chat_type as WebAppInitData['chat_type'],
      user: data.user ? safeJsonParse(data.user) : undefined,
      receiver: data.receiver ? safeJsonParse(data.receiver) : undefined,
      chat: data.chat ? safeJsonParse(data.chat) : undefined,
      signature: data.signature,
    };
  }

  validateAndGetUser(initData: string): WebAppUser {
    const webAppInitData: WebAppInitData =
      this.validateTelegramInitData(initData);

    if (!webAppInitData.user) {
      throw new BadRequestException(
        'User information is missing from the init data',
      );
    }
    if (webAppInitData.user.is_bot) {
      throw new BadRequestException('Bots are not allowed');
    }

    return webAppInitData.user;
  }
}

function safeJsonParse<T>(jsonString: string): T | undefined {
  try {
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return undefined;
  }
}
```

- File: ./common/decorators/current-user.decorator.ts

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/user.entity';

/**
 * Extracts the authenticated user from the request.
 * Assumes your authentication strategy attaches the user to request.user.
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
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

- File: ./main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`Server running on port ${port}`);
}
bootstrap();
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

- File: ./locations/country.entity.ts

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { State } from './state.entity';

@Entity({ name: 'countries' })
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'json', nullable: true })
  nameLocal: Record<string, string>;

  @Column({ nullable: true })
  phoneCode: string;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  region: string;

  @Column({ nullable: true })
  capital: string;

  @OneToMany(() => State, (state) => state.country)
  states: State[];
}
```

- File: ./locations/city.entity.ts

```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { State } from './state.entity';

@Entity({ name: 'cities' })
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'json', nullable: true })
  nameLocal: Record<string, string>;

  @Column({ nullable: true })
  postalCode: string | null;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @ManyToOne(() => State, (state) => state.cities, { onDelete: 'CASCADE' })
  state: State;
}
```

- File: ./locations/locations-sync.service.ts

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './country.entity';
import { State } from './state.entity';
import { City } from './city.entity';
import {
  GeoNameCountryResponse,
  GeoNameChildrenResponse,
} from './interfaces/geonames.interface';

@Injectable()
export class LocationsSyncService {
  private readonly logger = new Logger(LocationsSyncService.name);
  private readonly geonamesUsername: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {
    const username = this.configService.get<string>('GEONAMES_USERNAME');
    if (!username) {
      throw new Error('GEONAMES_USERNAME is not set in configuration.');
    }
    this.geonamesUsername = username;
  }

  private async fetchData<T>(url: string): Promise<T> {
    try {
      const response = await firstValueFrom(this.httpService.get<T>(url));
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching data from URL: ${url}`, error);
      throw error;
    }
  }

  async syncLocations(): Promise<void> {
    this.logger.log('Starting location sync process...');
    try {
      const countriesUrl = `http://api.geonames.org/countryInfoJSON?username=${this.geonamesUsername}`;
      const countriesResponse =
        await this.fetchData<GeoNameCountryResponse>(countriesUrl);
      const countriesData = countriesResponse.geonames;
      if (!countriesData || !Array.isArray(countriesData)) {
        this.logger.error('Invalid countries data received');
        return;
      }

      for (const c of countriesData) {
        let country = await this.countryRepository.findOne({
          where: { code: c.countryCode },
        });
        if (!country) {
          country = this.countryRepository.create({
            code: c.countryCode,
            name: c.countryName,
            nameLocal: { en: c.countryName },
            capital: c.capital,
            region: c.continent,
          });
          country = await this.countryRepository.save(country);
          this.logger.log(`Saved country: ${country.name}`);
        }

        if (!c.geonameId) continue;

        const childrenUrl = `http://api.geonames.org/childrenJSON?geonameId=${c.geonameId}&username=${this.geonamesUsername}`;
        const childrenResponse =
          await this.fetchData<GeoNameChildrenResponse>(childrenUrl);
        const childrenData = childrenResponse.geonames || [];

        for (const child of childrenData) {
          if (child.fcode !== 'ADM1' && child.fcode !== 'ADM2') continue;
          let state = await this.stateRepository.findOne({
            where: {
              name: child.name,
              country: { id: country.id },
            },
            relations: ['country'],
          });
          if (!state) {
            state = this.stateRepository.create({
              name: child.name,
              code: child.adminCode1,
              nameLocal: { en: child.name },
              country,
            });
            state = await this.stateRepository.save(state);
            this.logger.log(
              `Saved state: ${state.name} for country ${country.name}`,
            );
          }

          if (!child.geonameId) continue;

          const stateChildrenUrl = `http://api.geonames.org/childrenJSON?geonameId=${child.geonameId}&username=${this.geonamesUsername}`;
          const stateChildrenResponse =
            await this.fetchData<GeoNameChildrenResponse>(stateChildrenUrl);
          const stateChildrenData = stateChildrenResponse.geonames || [];
          for (const cityData of stateChildrenData) {
            if (!cityData.fcode || !cityData.fcode.startsWith('PPL')) continue;
            let city = await this.cityRepository.findOne({
              where: {
                name: cityData.name,
                state: { id: state.id },
              },
              relations: ['state'],
            });
            if (!city) {
              city = this.cityRepository.create({
                name: cityData.name,
                nameLocal: { en: cityData.name },
                postalCode: cityData.postalCode || null,
                latitude: Number(cityData.lat),
                longitude: Number(cityData.lng),
                state,
              });
              city = await this.cityRepository.save(city);
              this.logger.log(
                `Saved city: ${city.name} in state ${state.name}`,
              );
            }
          }
        }
      }
      this.logger.log('Location sync completed.');
    } catch (error) {
      this.logger.error('Error during location sync', error);
    }
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async handleCron(): Promise<void> {
    this.logger.log('Cron job triggered for location sync.');
    await this.syncLocations();
  }
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
} from 'typeorm';
import { Country } from './country.entity';
import { City } from './city.entity';

@Entity({ name: 'states' })
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  code: string;

  @Column({ type: 'json', nullable: true })
  nameLocal: Record<string, string>;

  @ManyToOne(() => Country, (country) => country.states, {
    onDelete: 'CASCADE',
  })
  country: Country;

  @OneToMany(() => City, (city) => city.state)
  cities: City[];
}
```

- File: ./locations/locations.service.ts

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './country.entity';
import { State } from './state.entity';
import { City } from './city.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async getCountries(): Promise<Country[]> {
    return this.countryRepository.find();
  }

  async getCountryById(id: number): Promise<Country> {
    const country = await this.countryRepository.findOne({
      where: { id },
      relations: ['states'],
    });
    if (!country) {
      throw new NotFoundException(`Country with id ${id} not found`);
    }
    return country;
  }

  async getStatesByCountry(countryId: number): Promise<State[]> {
    const country = await this.countryRepository.findOne({
      where: { id: countryId },
    });
    if (!country) {
      throw new NotFoundException(`Country with id ${countryId} not found`);
    }

    return this.stateRepository.find({
      where: { country: { id: countryId } },
      relations: ['country'],
    });
  }

  async getStateById(id: number): Promise<State> {
    const state = await this.stateRepository.findOne({
      where: { id },
      relations: ['country', 'cities'],
    });
    if (!state) {
      throw new NotFoundException(`State with id ${id} not found`);
    }
    return state;
  }

  async getCitiesByState(stateId: number): Promise<City[]> {
    const state = await this.stateRepository.findOne({
      where: { id: stateId },
    });
    if (!state) {
      throw new NotFoundException(`State with id ${stateId} not found`);
    }

    return this.cityRepository.find({
      where: { state: { id: stateId } },
      relations: ['state'],
    });
  }

  async getCityById(id: number): Promise<City> {
    const city = await this.cityRepository.findOne({
      where: { id },
      relations: ['state', 'state.country'],
    });
    if (!city) {
      throw new NotFoundException(`City with id ${id} not found`);
    }
    return city;
  }
}
```

- File: ./locations/locations.controller.ts

```typescript
import { Controller, Get, Param } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { Country } from './country.entity';
import { State } from './state.entity';
import { City } from './city.entity';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('countries')
  async getCountries(): Promise<Country[]> {
    return this.locationsService.getCountries();
  }

  @Get('countries/:id')
  async getCountry(@Param('id') id: number): Promise<Country> {
    return this.locationsService.getCountryById(Number(id));
  }

  @Get('countries/:id/states')
  async getStatesByCountry(@Param('id') countryId: number): Promise<State[]> {
    return this.locationsService.getStatesByCountry(Number(countryId));
  }

  @Get('states/:id')
  async getState(@Param('id') id: number): Promise<State> {
    return this.locationsService.getStateById(Number(id));
  }

  @Get('states/:id/cities')
  async getCitiesByState(@Param('id') stateId: number): Promise<City[]> {
    return this.locationsService.getCitiesByState(Number(stateId));
  }

  @Get('cities/:id')
  async getCity(@Param('id') id: number): Promise<City> {
    return this.locationsService.getCityById(Number(id));
  }
}
```

- File: ./locations/locations.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { Country } from './country.entity';
import { State } from './state.entity';
import { City } from './city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Country, State, City])],
  providers: [LocationsService],
  controllers: [LocationsController],
  exports: [LocationsService],
})
export class LocationsModule {}
```

- File: ./locations/interfaces/geonames.interface.ts

```typescript
export interface GeoNameCountry {
  continent: string;
  capital: string;
  countryCode: string;
  countryName: string;
  geonameId: number;
}

export interface GeoNameCountryResponse {
  geonames: GeoNameCountry[];
}

export interface GeoNameChild {
  fcode: string;
  geonameId: number;
  name: string;
  adminCode1?: string;
  postalCode?: string;
  lat: string;
  lng: string;
}

export interface GeoNameChildrenResponse {
  geonames: GeoNameChild[];
}
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
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { UpdateContactLocationDto } from './dto/update-contact-location.dto';
import { Country } from '../locations/country.entity';
import { State } from '../locations/state.entity';
import { City } from '../locations/city.entity';
import { WebAppUser } from '../telegram/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {}

  async findByTelegramId(telegramId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { telegramId },
      relations: ['stores', 'orders', 'reviews', 'country', 'state', 'city'],
    });
    if (!user)
      throw new NotFoundException(
        `User with Telegram ID ${telegramId} not found`,
      );
    return user;
  }

  async upgradeToSeller(telegramId: string): Promise<User> {
    const user = await this.findByTelegramId(telegramId);
    if (user.role === UserRole.SELLER || user.role === UserRole.BOTH)
      throw new BadRequestException('User is already a seller');
    user.role = UserRole.BOTH;
    return this.usersRepository.save(user);
  }

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['stores', 'orders', 'country', 'state', 'city'],
    });
  }

  async updateProfile(id: number, dto: UpdateProfileDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    if (dto.firstName !== undefined) user.firstName = dto.firstName;
    if (dto.lastName !== undefined) user.lastName = dto.lastName;
    return this.usersRepository.save(user);
  }

  async updateLanguage(id: number, dto: UpdateLanguageDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    user.languageCode = dto.languageCode || 'EN';
    return this.usersRepository.save(user);
  }

  async updateContactLocation(
    id: number,
    dto: UpdateContactLocationDto,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    const country = await this.countryRepository.findOne({
      where: { id: dto.countryId },
    });
    if (!country) throw new BadRequestException('Invalid country');
    if (!dto.phoneNumber.startsWith(country.phoneCode))
      throw new BadRequestException('Phone number does not match country code');
    user.phoneNumber = dto.phoneNumber;
    user.email = dto.email;
    user.country = { id: dto.countryId } as Country;
    user.state = { id: dto.stateId } as State;
    user.city = { id: dto.cityId } as City;
    return this.usersRepository.save(user);
  }

  async findOrCreate(tgUser: WebAppUser): Promise<User> {
    const telegramId = tgUser.id.toString();
    let user = await this.usersRepository.findOne({ where: { telegramId } });
    if (!user) {
      user = this.usersRepository.create({
        telegramId,
        firstName: tgUser.first_name,
        lastName: tgUser.last_name,
        username: tgUser.username,
        languageCode: tgUser.language_code || 'EN',
        hasTelegramPremium: tgUser.is_premium,
        photoUrl: tgUser.photo_url,
        role: UserRole.BUYER,
      });
      user = await this.usersRepository.save(user);
    }
    return user;
  }
}
```

- File: ./users/user.entity.ts

```typescript
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../orders/order.entity';
import { Review } from '../reviews/review.entity';
import { Store } from '../stores/store.entity';
import { Payment } from '../payments/payment.entity';
import { Country } from '../locations/country.entity';
import { State } from '../locations/state.entity';
import { City } from '../locations/city.entity';

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
  firstName: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  languageCode?: string;

  @Column({ nullable: true })
  hasTelegramPremium?: boolean;

  @Column({ nullable: true })
  photoUrl?: string;

  @Column({ unique: true, nullable: true, length: 20 })
  phoneNumber?: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.BUYER })
  role: UserRole;

  @Column({ nullable: true })
  walletAddress?: string;

  @ManyToOne(() => Country, { nullable: true })
  country?: Country;

  @ManyToOne(() => State, { nullable: true })
  state?: State;

  @ManyToOne(() => City, { nullable: true })
  city?: City;

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

- File: ./users/dto/update-language.dto.ts

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateLanguageDto {
  @ApiProperty({
    description: 'Language code (ISO 639-1 format)',
    example: 'en',
  })
  @IsNotEmpty()
  @IsString()
  languageCode: string;
}
```

- File: ./users/dto/update-profile.dto.ts

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;
}
```

- File: ./users/dto/update-contact-location.dto.ts

```typescript
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPhoneNumber,
  Length,
} from 'class-validator';

export class UpdateContactLocationDto {
  @ApiProperty({
    description: 'Phone number with country code',
    example: '+1234567890',
  })
  @IsNotEmpty()
  @IsPhoneNumber(undefined)
  @Length(10, 20)
  phoneNumber: string;

  @ApiProperty({
    description: 'Email address',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Country ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  countryId: number;

  @ApiProperty({
    description: 'State ID',
    example: 10,
  })
  @IsNotEmpty()
  @IsInt()
  stateId: number;

  @ApiProperty({
    description: 'City ID',
    example: 100,
  })
  @IsNotEmpty()
  @IsInt()
  cityId: number;
}
```

- File: ./users/users.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { Country } from '../locations/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Country])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
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
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { UpdateContactLocationDto } from './dto/update-contact-location.dto';
import { TelegramUserService } from '../telegram/telegram-user.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly telegramUserService: TelegramUserService,
  ) {}

  @Post('/telegram-init-data')
  @ApiOperation({ summary: 'Authenticate a user via Telegram data' })
  @ApiBody({ description: 'Telegram Init Data', type: String })
  @ApiResponse({
    status: 201,
    description: 'User authenticated successfully',
    type: User,
  })
  @UsePipes(new ValidationPipe())
  async authenticateUser(@Body() initData: string): Promise<User> {
    const tgUser = this.telegramUserService.validateAndGetUser(initData);
    return this.usersService.findOrCreate(tgUser);
  }

  @Patch('upgrade/:telegramId')
  @ApiOperation({ summary: 'Upgrade user to seller role' })
  @ApiParam({
    name: 'telegramId',
    description: 'User Telegram ID',
    example: '123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'User upgraded to seller',
    type: User,
  })
  async upgradeToSeller(
    @Param('telegramId') telegramId: string,
  ): Promise<User> {
    return this.usersService.upgradeToSeller(telegramId);
  }

  @Patch('profile/:id')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'User profile updated', type: User })
  @UsePipes(new ValidationPipe())
  async updateProfile(
    @Param('id') id: number,
    @Body() dto: UpdateProfileDto,
  ): Promise<User> {
    return this.usersService.updateProfile(id, dto);
  }

  @Patch('language/:id')
  @ApiOperation({ summary: 'Update user language preference' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiBody({ type: UpdateLanguageDto })
  @ApiResponse({
    status: 200,
    description: 'User language updated',
    type: User,
  })
  @UsePipes(new ValidationPipe())
  async updateLanguage(
    @Param('id') id: number,
    @Body() dto: UpdateLanguageDto,
  ): Promise<User> {
    return this.usersService.updateLanguage(id, dto);
  }

  @Patch('contact-location/:id')
  @ApiOperation({ summary: 'Update user contact and location details' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiBody({ type: UpdateContactLocationDto })
  @ApiResponse({
    status: 200,
    description: 'User contact/location updated',
    type: User,
  })
  @UsePipes(new ValidationPipe())
  async updateContactLocation(
    @Param('id') id: number,
    @Body() dto: UpdateContactLocationDto,
  ): Promise<User> {
    return this.usersService.updateContactLocation(id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users', type: [User] })
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }
}
```

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

