import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { Country } from '../locations/country.entity';
import { TelegramUserService } from '../telegram/telegram-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Country])],
  providers: [UsersService, TelegramUserService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
