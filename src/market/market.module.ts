import { Module } from '@nestjs/common';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { StoresService } from '../stores/stores.service';
import { ProductsService } from '../products/products.service';

@Module({
  imports: [],
  providers: [MarketService, StoresService, ProductsService],
  controllers: [MarketController],
  exports: [MarketService],
})
export class MarketModule {}
