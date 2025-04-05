import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateStoreBasicDto,
  CreateStoreLogoDto,
  CreateStoreTagsDto,
  CreateStoreWorkingHoursDto,
  StoreDetailDto,
  StoreSummaryDto,
  UpdateStore,
} from '@/stores/dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { StoresService } from './stores.service';
import { User } from '@/users/user.entity';
import {
  mapStoreToDetail,
  mapStoreToSummary,
} from '@/stores/mappers/store.mapper';
import { AddressDto } from '@/locations/dto';

@ApiTags('Stores')
@ApiBearerAuth()
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get('my')
  @ApiOperation({ summary: "Get current user's own store(s)" })
  @ApiResponse({ status: 200, type: StoreSummaryDto, isArray: true })
  async getMyStores(@CurrentUser() user: User): Promise<StoreSummaryDto[]> {
    const stores = await this.storesService.getMyStores(user);
    return stores.map(mapStoreToSummary);
  }

  @Get('discover')
  @ApiOperation({ summary: 'Get stores based on user interest or algorithm' })
  @ApiResponse({ status: 200, type: StoreSummaryDto, isArray: true })
  async discoverStores(@CurrentUser() user: User): Promise<StoreSummaryDto[]> {
    const stores = await this.storesService.getRecommendedStores(user);
    return stores.map(mapStoreToSummary);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured stores' })
  @ApiResponse({ status: 200, type: StoreSummaryDto, isArray: true })
  async getFeaturedStores(): Promise<StoreSummaryDto[]> {
    const stores = await this.storesService.getFeaturedStores();
    return stores.map(mapStoreToSummary);
  }

  @Post('basic')
  @ApiOperation({ summary: 'Create basic store information' })
  @ApiResponse({ status: 201, type: StoreDetailDto })
  async createStoreBasic(
    @CurrentUser() user: User,
    @Body() dto: CreateStoreBasicDto,
  ): Promise<StoreDetailDto> {
    const store = await this.storesService.createStoreBasic(user, dto);
    return mapStoreToDetail(store);
  }

  @Patch(':id/address')
  @ApiOperation({ summary: 'Update store address' })
  @ApiParam({ name: 'id', type: Number, description: 'Store ID' })
  @ApiResponse({ status: 200, type: StoreDetailDto })
  async updateStoreAddress(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddressDto,
  ): Promise<StoreDetailDto> {
    const store = await this.storesService.updateStoreAddress(user, id, dto);
    return mapStoreToDetail(store);
  }

  @Patch(':id/tags')
  @ApiOperation({ summary: 'Update store tags' })
  @ApiParam({ name: 'id', type: Number, description: 'Store ID' })
  @ApiResponse({ status: 200, type: StoreDetailDto })
  async updateStoreTags(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateStoreTagsDto,
  ): Promise<StoreDetailDto> {
    const store = await this.storesService.updateStoreTags(id, dto);
    return mapStoreToDetail(store);
  }

  @Patch(':id/working-hours')
  @ApiOperation({ summary: 'Update store working hours' })
  @ApiParam({ name: 'id', type: Number, description: 'Store ID' })
  @ApiResponse({ status: 200, type: StoreDetailDto })
  async updateStoreWorkingHours(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateStoreWorkingHoursDto,
  ): Promise<StoreDetailDto> {
    const store = await this.storesService.updateStoreWorkingHours(id, dto);
    return mapStoreToDetail(store);
  }

  @Post(':id/logo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload store logo' })
  @ApiParam({ name: 'id', type: Number, description: 'Store ID' })
  @ApiBody({ type: CreateStoreLogoDto })
  @ApiResponse({ status: 200, type: StoreDetailDto })
  async uploadStoreLogo(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /image\/(jpeg|png|gif)/ })
        .addMaxSizeValidator({ maxSize: 2 * 1024 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ): Promise<StoreDetailDto> {
    const store = await this.storesService.uploadStoreLogo(id, file);
    return mapStoreToDetail(store);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update general store info' })
  @ApiParam({ name: 'id', type: Number, description: 'Store ID' })
  @ApiResponse({ status: 200, type: StoreDetailDto })
  async updateStore(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStore,
  ): Promise<StoreDetailDto> {
    const store = await this.storesService.updateStore(id, dto);
    return mapStoreToDetail(store);
  }
}
