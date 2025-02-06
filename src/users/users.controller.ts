import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserRole } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(
    @Body('telegramId') telegramId: string,
    @Body('name') name: string,
    @Body('role') role?: UserRole,
  ): Promise<User> {
    return this.usersService.createUser(telegramId, name, role);
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

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }
}
