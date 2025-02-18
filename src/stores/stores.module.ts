import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { Store } from './store.entity';
import { UsersModule } from '../users/users.module';
import { StoreOwnerGuard } from './store-owner.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), UsersModule, ConfigModule],
  providers: [StoresService, StoreOwnerGuard],
  controllers: [StoresController],
  exports: [StoresService],
})
export class StoresModule {}
