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
import { StoresService } from './stores.service';
import { Store } from './store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createStore(@Body() createStoreDto: CreateStoreDto): Promise<Store> {
    return this.storesService.createStore(createStoreDto);
  }

  @Get(':id')
  async getStoreById(@Param('id') id: number): Promise<Store> {
    return this.storesService.findById(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updateStore(
    @Param('id') id: number,
    @Body() updateStoreDto: UpdateStoreDto,
  ): Promise<Store> {
    return this.storesService.updateStore(id, updateStoreDto);
  }

  @Get()
  async getAllStores(): Promise<Store[]> {
    return this.storesService.getAllStores();
  }
}
