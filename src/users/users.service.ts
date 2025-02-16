import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Country } from '../locations/country.entity';
import { State } from '../locations/state.entity';
import { City } from '../locations/city.entity';
import { WebAppUser } from '../telegram/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

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

  async findOrCreate(tgUser: WebAppUser): Promise<User> {
    const telegramId = tgUser.id.toString();
    let user = await this.usersRepository.findOne({ where: { telegramId } });
    if (!user) {
      user = this.usersRepository.create({
        telegramId: telegramId,
        firstName: tgUser.first_name,
        lastName: tgUser.last_name,
        username: tgUser.username,
        languageCode: tgUser.language_code,
        hasTelegramPremium: tgUser.is_premium,
        photoUrl: tgUser.photo_url,
        phoneNumber: undefined,
        email: undefined,
        role: UserRole.BUYER,
        walletAddress: undefined,
      });
      user = await this.usersRepository.save(user);
    }
    return user;
  }
}
