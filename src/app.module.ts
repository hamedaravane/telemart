import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from './config/typeorm.config';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { LocationsModule } from './locations/locations.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TelegramUserService } from './telegram/telegram-user.service';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule, BullModuleAsyncOptions, BullRootModuleOptions } from '@nestjs/bull';

// @ts-ignore
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        typeOrmConfig(configService),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): BullRootModuleOptions => ({
        redis: {
          host: configService.get<string>('REDIS_HOST_PRIVATE', 'localhost'),
          port: +configService.get<number>('REDIS_PORT_PRIVATE', 6379),
          password: configService.get<string>('REDIS_PASSWORD', ''),
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    StoresModule,
    LocationsModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    ReviewsModule,
  ],
  providers: [TelegramUserService],
})
export class AppModule {}
