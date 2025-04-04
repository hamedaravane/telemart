import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { Country } from '@/locations/entities/country.entity';
import {
  UpdateContactLocationDto,
  UpdateLanguageDto,
  UpdateProfileDto,
} from '@/users/dto';
import { State } from '@/locations/entities/state.entity';
import { City } from '@/locations/entities/city.entity';
import { WebAppUser } from '@/telegram/types';

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

  // TODO: we should consider that users wants to update which their location
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
