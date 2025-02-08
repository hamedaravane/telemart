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
    const user = await this.usersRepository.findOne({
      where: { telegramId: authData.id as string },
    });

    if (!user) {
      throw new NotFoundException(
        `User with Telegram ID ${authData.id} not found`,
      );
    }
    return user;
  }
}
