import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { Country } from '@/locations/entities/country.entity';
import { State } from '@/locations/entities/state.entity';
import { City } from '@/locations/entities/city.entity';
import {
  UpdateContactLocationDto,
  UpdateLanguageDto,
  UpdateProfileDto,
  UserPublicPreviewDto,
  UserSummaryDto,
} from '@/users/dto';
import {
  AuthDateInvalidError,
  ExpiredError,
  isSignatureInvalidError,
  parse,
  validate,
} from '@telegram-apps/init-data-node';
import { User as TelegramAppsUser } from '@telegram-apps/types';
import { ConfigService } from '@nestjs/config';
import {
  mapUserToPublicPreview,
  mapUserToSummary,
} from '@/users/mappers/user.mapper';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  /**
   * Validates and parses Telegram init data using official package
   */
  validateAndParse(initDataRaw: string): TelegramAppsUser {
    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined');
    }

    try {
      validate(initDataRaw, botToken);
      const data = parse(initDataRaw, true);

      if (!data.user?.id || !data.user.firstName) {
        throw new UnauthorizedException('Missing user fields in Telegram data');
      }

      return data.user as unknown as TelegramAppsUser;
    } catch (err) {
      if (isSignatureInvalidError(err)) {
        throw new UnauthorizedException('Telegram signature invalid');
      }
      if (err instanceof AuthDateInvalidError) {
        throw new UnauthorizedException('Telegram auth_date is invalid');
      }
      if (err instanceof ExpiredError) {
        throw new UnauthorizedException('Telegram session expired');
      }

      throw new UnauthorizedException('Invalid Telegram init data');
    }
  }

  async findOrCreate(tgUser: TelegramAppsUser): Promise<User> {
    const telegramId = tgUser.id.toString();
    let user = await this.usersRepository.findOne({ where: { telegramId } });

    if (!user) {
      user = this.usersRepository.create({
        telegramId,
        firstName: tgUser.first_name,
        lastName: tgUser.last_name,
        username: tgUser.username,
        languageCode: tgUser.language_code || 'en',
        hasTelegramPremium: tgUser.is_premium,
        photoUrl: tgUser.photo_url,
        role: UserRole.BUYER,
      });
      user = await this.usersRepository.save(user);
    }

    return user;
  }

  async findByTelegramId(telegramId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { telegramId },
      relations: [
        'stores',
        'orders',
        'reviews',
        'country',
        'state',
        'city',
        'addresses',
      ],
    });
    if (!user) {
      throw new NotFoundException(
        `User with Telegram ID ${telegramId} not found`,
      );
    }
    return user;
  }

  async getSummary(telegramId: string): Promise<UserSummaryDto> {
    const user = await this.usersRepository.findOne({
      where: { telegramId },
      relations: ['addresses'],
    });
    if (!user) {
      throw new NotFoundException(
        `User with Telegram ID ${telegramId} not found`,
      );
    }
    return mapUserToSummary(user);
  }

  async getPublicPreview(telegramId: string): Promise<UserPublicPreviewDto> {
    const user = await this.usersRepository.findOne({
      where: { telegramId },
    });
    if (!user) {
      throw new NotFoundException(
        `User with Telegram ID ${telegramId} not found`,
      );
    }
    return mapUserToPublicPreview(user);
  }

  async upgradeToSeller(telegramId: string): Promise<User> {
    const user = await this.findByTelegramId(telegramId);

    if ([UserRole.SELLER, UserRole.BOTH].includes(user.role)) {
      throw new BadRequestException('User is already a seller');
    }

    user.role = UserRole.BOTH;
    return this.usersRepository.save(user);
  }

  async updateProfile(
    telegramId: string,
    dto: UpdateProfileDto,
  ): Promise<User> {
    const user = await this.findByTelegramId(telegramId);
    if (dto.firstName !== undefined) user.firstName = dto.firstName;
    if (dto.lastName !== undefined) user.lastName = dto.lastName;
    return this.usersRepository.save(user);
  }

  async updateLanguage(
    telegramId: string,
    dto: UpdateLanguageDto,
  ): Promise<User> {
    const user = await this.findByTelegramId(telegramId);
    user.languageCode = dto.languageCode || 'en';
    return this.usersRepository.save(user);
  }

  async updateContactLocation(
    telegramId: string,
    dto: UpdateContactLocationDto,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { telegramId },
      relations: ['addresses'],
    });
    if (!user)
      throw new NotFoundException(
        `User with Telegram ID ${telegramId} not found`,
      );

    const address = user.addresses.find((addr) => addr.id === dto.addressId);
    if (!address) {
      throw new NotFoundException(
        `Address with ID ${dto.addressId} not found for user`,
      );
    }

    const country = await this.countryRepository.findOne({
      where: { id: dto.countryId },
    });
    if (!country) throw new BadRequestException('Invalid country selected');

    if (!country.phoneCode || !dto.phoneNumber.startsWith(country.phoneCode)) {
      throw new BadRequestException(
        `Phone number must start with country code (${country.phoneCode})`,
      );
    }

    user.phoneNumber = dto.phoneNumber;
    user.email = dto.email;

    address.country = { id: dto.countryId } as Country;
    address.state = { id: dto.stateId } as State;
    address.city = { id: dto.cityId } as City;

    await this.usersRepository.save(user);
    return this.findByTelegramId(telegramId);
  }
}
