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
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import {
  UpdateContactLocationDto,
  UpdateLanguageDto,
  UpdateProfileDto,
  UserPrivateProfileDto,
  UserPublicPreviewDto,
  UserSummaryDto,
} from '@/users/dto';
import { mapUserToPrivateProfile } from '@/users/mappers/user.mapper';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('telegram-auth')
  @ApiOperation({ summary: 'Authenticate via Telegram init data' })
  @ApiBody({ type: String })
  @ApiResponse({ status: 201, type: UserPrivateProfileDto })
  @UsePipes(new ValidationPipe())
  async telegramAuth(@Body() initData: string): Promise<UserPrivateProfileDto> {
    const tgUser = this.usersService.validateAndParse(initData);

    const user = await this.usersService.findOrCreate(tgUser);

    return mapUserToPrivateProfile(user);
  }

  @Get(':telegramId/public')
  @ApiOperation({ summary: 'Get public preview of a user (e.g. for comments)' })
  @ApiParam({ name: 'telegramId', example: '123456789' })
  @ApiResponse({ status: 200, type: UserPublicPreviewDto })
  async getPublicProfile(
    @Param('telegramId') telegramId: string,
  ): Promise<UserPublicPreviewDto> {
    return this.usersService.getPublicPreview(telegramId);
  }

  @Get(':telegramId/summary')
  @ApiOperation({
    summary: 'Get limited summary for buyers/sellers (e.g. on orders)',
  })
  @ApiParam({ name: 'telegramId', example: '123456789' })
  @ApiResponse({ status: 200, type: UserSummaryDto })
  async getUserSummary(
    @Param('telegramId') telegramId: string,
  ): Promise<UserSummaryDto> {
    return this.usersService.getSummary(telegramId);
  }

  @Patch(':telegramId/profile')
  @ApiOperation({ summary: 'Update user profile (first/last name)' })
  @ApiParam({ name: 'telegramId', example: '123456789' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, type: UserPrivateProfileDto })
  async updateProfile(
    @Param('telegramId') telegramId: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserPrivateProfileDto> {
    const user = await this.usersService.updateProfile(telegramId, dto);
    return mapUserToPrivateProfile(user);
  }

  @Patch(':telegramId/language')
  @ApiOperation({ summary: 'Update user language' })
  @ApiParam({ name: 'telegramId', example: '123456789' })
  @ApiBody({ type: UpdateLanguageDto })
  @ApiResponse({ status: 200, type: UserPrivateProfileDto })
  async updateLanguage(
    @Param('telegramId') telegramId: string,
    @Body() dto: UpdateLanguageDto,
  ): Promise<UserPrivateProfileDto> {
    const user = await this.usersService.updateLanguage(telegramId, dto);
    return mapUserToPrivateProfile(user);
  }

  @Patch(':telegramId/contact-location')
  @ApiOperation({ summary: 'Update user contact info and an address location' })
  @ApiParam({ name: 'telegramId', example: '123456789' })
  @ApiBody({ type: UpdateContactLocationDto })
  @ApiResponse({ status: 200, type: UserPrivateProfileDto })
  async updateContactLocation(
    @Param('telegramId') telegramId: string,
    @Body() dto: UpdateContactLocationDto,
  ): Promise<UserPrivateProfileDto> {
    const user = await this.usersService.updateContactLocation(telegramId, dto);
    return mapUserToPrivateProfile(user);
  }

  @Patch(':telegramId/upgrade')
  @ApiOperation({ summary: 'Upgrade user to seller role' })
  @ApiParam({ name: 'telegramId', example: '123456789' })
  @ApiResponse({ status: 200, description: 'User upgraded to seller' })
  async upgradeToSeller(
    @Param('telegramId') telegramId: string,
  ): Promise<UserPrivateProfileDto> {
    const user = await this.usersService.upgradeToSeller(telegramId);
    return mapUserToPrivateProfile(user);
  }
}
