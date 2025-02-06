import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':telegramId')
  async getUserByTelegramId(
    @Param('telegramId') telegramId: string,
  ): Promise<User | null> {
    return this.usersService.findByTelegramId(telegramId);
  }

  @Post()
  async createUser(
    @Body('telegramId') telegramId: string,
    @Body('name') name: string,
    @Body('phoneNumber') phoneNumber?: string,
    @Body('email') email?: string,
  ): Promise<User> {
    return this.usersService.createUser(telegramId, name, phoneNumber, email);
  }
}
