import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(
    telegramId: string,
    name: string,
    role: UserRole = UserRole.BUYER,
  ): Promise<User> {
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
}
