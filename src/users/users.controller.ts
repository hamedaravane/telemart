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
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { UpdateContactLocationDto } from './dto/update-contact-location.dto';
import { TelegramUserService } from '../telegram/telegram-user.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly telegramUserService: TelegramUserService,
  ) {}

  @Post('/telegram-init-data')
  @ApiOperation({ summary: 'Authenticate a user via Telegram data' })
  @ApiBody({ description: 'Telegram Init Data', type: String })
  @ApiResponse({
    status: 201,
    description: 'User authenticated successfully',
    type: User,
  })
  @UsePipes(new ValidationPipe())
  async authenticateUser(@Body() initData: string): Promise<User> {
    const tgUser = this.telegramUserService.validateAndGetUser(initData);
    return this.usersService.findOrCreate(tgUser);
  }

  @Patch('upgrade/:telegramId')
  @ApiOperation({ summary: 'Upgrade user to seller role' })
  @ApiParam({
    name: 'telegramId',
    description: 'User Telegram ID',
    example: '123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'User upgraded to seller',
    type: User,
  })
  async upgradeToSeller(
    @Param('telegramId') telegramId: string,
  ): Promise<User> {
    return this.usersService.upgradeToSeller(telegramId);
  }

  @Patch('profile/:id')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'User profile updated', type: User })
  @UsePipes(new ValidationPipe())
  async updateProfile(
    @Param('id') id: number,
    @Body() dto: UpdateProfileDto,
  ): Promise<User> {
    return this.usersService.updateProfile(id, dto);
  }

  @Patch('language/:id')
  @ApiOperation({ summary: 'Update user language preference' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiBody({ type: UpdateLanguageDto })
  @ApiResponse({
    status: 200,
    description: 'User language updated',
    type: User,
  })
  @UsePipes(new ValidationPipe())
  async updateLanguage(
    @Param('id') id: number,
    @Body() dto: UpdateLanguageDto,
  ): Promise<User> {
    return this.usersService.updateLanguage(id, dto);
  }

  @Patch('contact-location/:id')
  @ApiOperation({ summary: 'Update user contact and location details' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiBody({ type: UpdateContactLocationDto })
  @ApiResponse({
    status: 200,
    description: 'User contact/location updated',
    type: User,
  })
  @UsePipes(new ValidationPipe())
  async updateContactLocation(
    @Param('id') id: number,
    @Body() dto: UpdateContactLocationDto,
  ): Promise<User> {
    return this.usersService.updateContactLocation(id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users', type: [User] })
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }
}
