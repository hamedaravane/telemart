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
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { UpdateContactLocationDto } from './dto/update-contact-location.dto';
import { TelegramUserService } from '../telegram/telegram-user.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly telegramUserService: TelegramUserService,
  ) {}

  @Post('/telegram-init-data')
  @UsePipes(new ValidationPipe())
  async authenticateUser(@Body() initData: string): Promise<User> {
    const tgUser = this.telegramUserService.validateAndGetUser(initData);
    return this.usersService.findOrCreate(tgUser);
  }

  @Patch('upgrade/:telegramId')
  async upgradeToSeller(
    @Param('telegramId') telegramId: string,
  ): Promise<User> {
    return this.usersService.upgradeToSeller(telegramId);
  }

  @Patch('profile/:id')
  @UsePipes(new ValidationPipe())
  async updateProfile(
    @Param('id') id: number,
    @Body() dto: UpdateProfileDto,
  ): Promise<User> {
    return this.usersService.updateProfile(id, dto);
  }

  @Patch('language/:id')
  @UsePipes(new ValidationPipe())
  async updateLanguage(
    @Param('id') id: number,
    @Body() dto: UpdateLanguageDto,
  ): Promise<User> {
    return this.usersService.updateLanguage(id, dto);
  }

  @Patch('contact-location/:id')
  @UsePipes(new ValidationPipe())
  async updateContactLocation(
    @Param('id') id: number,
    @Body() dto: UpdateContactLocationDto,
  ): Promise<User> {
    return this.usersService.updateContactLocation(id, dto);
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }
}
