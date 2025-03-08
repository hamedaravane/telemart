import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { MarketService } from './market.service';

@ApiTags('Market')
@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}
}
