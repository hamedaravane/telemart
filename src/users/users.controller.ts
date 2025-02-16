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
import { UpdateUserDto } from './dto/update-user.dto';
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
    const telegramUser = this.telegramUserService.validateAndGetUser(
      initData,
      '',
    );
    return this.usersService.findOrCreate(telegramUser);
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
