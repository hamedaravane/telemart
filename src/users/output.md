# TypeScript Files Documentation

- File: ./users.module.ts

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

- File: ./dto/update-user.dto.ts

```typescript
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { UserRole } from '../user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  telegramUsername?: string;

  @IsOptional()
  @IsString()
  telegramLanguageCode?: string;

  @IsOptional()
  @IsBoolean()
  isTelegramPremium?: boolean;

  @IsOptional()
  @IsString()
  telegramPhotoUrl?: string;

  @IsOptional()
  @IsPhoneNumber(undefined, { message: 'Invalid phone number format' })
  @Length(10, 20)
  phoneNumber?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be buyer, seller, or both' })
  role?: UserRole;

  @IsOptional()
  @IsString()
  walletAddress?: string;

  @IsOptional()
  @IsInt()
  countryId?: number;

  @IsOptional()
  @IsInt()
  stateId?: number;

  @IsOptional()
  @IsInt()
  cityId?: number;
}
```

- File: ./dto/create-user.dto.ts

```typescript
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  telegramId: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsOptional()
  @IsString()
  telegramUsername?: string;

  @IsOptional()
  @IsString()
  telegramLanguageCode?: string;

  @IsOptional()
  @IsBoolean()
  isTelegramPremium?: boolean;

  @IsOptional()
  @IsString()
  telegramPhotoUrl?: string;

  @IsOptional()
  @IsPhoneNumber(undefined, { message: 'Invalid phone number format' })
  @Length(10, 20)
  phoneNumber?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  walletAddress?: string;

  @IsOptional()
  @IsInt()
  countryId?: number;

  @IsOptional()
  @IsInt()
  stateId?: number;

  @IsOptional()
  @IsInt()
  cityId?: number;
}
```

- File: ./users.controller.ts

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

- File: ./users.service.ts

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
import { Country } from '../locations/country.entity';
import { State } from '../locations/state.entity';
import { City } from '../locations/city.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const {
      telegramId,
      firstName,
      lastName,
      role = UserRole.BUYER,
      phoneNumber,
      email,
      telegramUsername,
      telegramLanguageCode,
      isTelegramPremium,
      telegramPhotoUrl,
      walletAddress,
      countryId,
      stateId,
      cityId,
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
      firstName,
      lastName,
      telegramUsername,
      telegramLanguageCode,
      isTelegramPremium,
      telegramPhotoUrl,
      phoneNumber,
      email,
      role,
      walletAddress,
    });

    if (countryId) {
      user.country = { id: countryId } as Country;
    }
    if (stateId) {
      user.state = { id: stateId } as State;
    }
    if (cityId) {
      user.city = { id: cityId } as City;
    }

    return this.usersRepository.save(user);
  }

  async findByTelegramId(telegramId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { telegramId },
      relations: ['stores', 'orders', 'reviews', 'country', 'state', 'city'],
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
    return this.usersRepository.find({
      relations: ['stores', 'orders', 'country', 'state', 'city'],
    });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(user, updateUserDto);

    if (updateUserDto.countryId !== undefined) {
      user.country = { id: updateUserDto.countryId } as Country;
    }
    if (updateUserDto.stateId !== undefined) {
      user.state = { id: updateUserDto.stateId } as State;
    }
    if (updateUserDto.cityId !== undefined) {
      user.city = { id: updateUserDto.cityId } as City;
    }

    return this.usersRepository.save(user);
  }

  async findOrCreate(authData: Record<string, any>): Promise<User> {
    const telegramId = authData.id as string;
    let user = await this.usersRepository.findOne({ where: { telegramId } });
    if (!user) {
      user = this.usersRepository.create({
        telegramId,
        firstName: authData.first_name,
        lastName: authData.last_name,
        role: UserRole.BUYER,
      });
      user = await this.usersRepository.save(user);
    }
    return user;
  }
}
```

- File: ./user.entity.ts

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
  telegramUsername?: string;

  @Column({ nullable: true })
  telegramLanguageCode?: string;

  @Column({ nullable: true })
  isTelegramPremium?: boolean;

  @Column({ nullable: true })
  telegramPhotoUrl?: string;

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

