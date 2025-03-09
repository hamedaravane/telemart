import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { MarketService } from './market.service';
import { MarketPageResponse } from './market.entity';

@ApiTags('Market')
@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The market page data',
    type: MarketPageResponse,
  })
  async getMarketData() {
    return await this.marketService.getMarketData();
  }
}
