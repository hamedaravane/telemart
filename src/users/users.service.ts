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

  async findOrCreate(authData: CreateUserDto): Promise<User> {
    const telegramId = authData.telegramId;
    let user = await this.usersRepository.findOne({ where: { telegramId } });
    if (!user) {
      user = this.usersRepository.create({
        telegramId,
        firstName: authData.firstName,
        lastName: authData.lastName,
        telegramUsername: authData.telegramUsername,
        telegramLanguageCode: authData.telegramLanguageCode,
        isTelegramPremium: authData.isTelegramPremium,
        telegramPhotoUrl: authData.telegramPhotoUrl,
        phoneNumber: authData.phoneNumber,
        email: authData.email,
        role: authData.role ?? UserRole.BUYER,
        walletAddress: authData.walletAddress,
      });
      user = await this.usersRepository.save(user);
    }
    return user;
  }
}
