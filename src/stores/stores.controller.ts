import {
  Body,
  Controller,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
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
  UpdateStore,
} from '@/stores/dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { StoresService } from './stores.service';
import { StoreOwnerGuard } from './store-owner.guard';
import { User } from '@/users/user.entity';
import { mapStoreToDetail } from '@/stores/mappers/store.mapper';
import { AddressDto } from '@/locations/dto';

@ApiTags('Stores')
@ApiBearerAuth()
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

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
  @UseGuards(StoreOwnerGuard)
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
  @UseGuards(StoreOwnerGuard)
  @ApiOperation({ summary: 'Update store tags' })
  @ApiParam({ name: 'id', type: Number, description: 'Store ID' })
  @ApiResponse({ status: 200, type: StoreDetailDto })
  async updateStoreTags(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateStoreTagsDto,
  ): Promise<StoreDetailDto> {
    const store = await this.storesService.updateStoreTags(user, id, dto);
    return mapStoreToDetail(store);
  }

  @Patch(':id/working-hours')
  @UseGuards(StoreOwnerGuard)
  @ApiOperation({ summary: 'Update store working hours' })
  @ApiParam({ name: 'id', type: Number, description: 'Store ID' })
  @ApiResponse({ status: 200, type: StoreDetailDto })
  async updateStoreWorkingHours(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateStoreWorkingHoursDto,
  ): Promise<StoreDetailDto> {
    const store = await this.storesService.updateStoreWorkingHours(
      user,
      id,
      dto,
    );
    return mapStoreToDetail(store);
  }

  @Post(':id/logo')
  @UseGuards(StoreOwnerGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload store logo' })
  @ApiParam({ name: 'id', type: Number, description: 'Store ID' })
  @ApiBody({ type: CreateStoreLogoDto })
  @ApiResponse({ status: 200, type: StoreDetailDto })
  async uploadStoreLogo(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /image\/(jpeg|png|gif)/ })
        .addMaxSizeValidator({ maxSize: 2 * 1024 * 1024 }) // 2MB
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ): Promise<StoreDetailDto> {
    const store = await this.storesService.uploadStoreLogo(user, id, file);
    return mapStoreToDetail(store);
  }

  @Patch(':id')
  @UseGuards(StoreOwnerGuard)
  @ApiOperation({ summary: 'Update general store info' })
  @ApiParam({ name: 'id', type: Number, description: 'Store ID' })
  @ApiResponse({ status: 200, type: StoreDetailDto })
  async updateStore(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStore,
  ): Promise<StoreDetailDto> {
    const store = await this.storesService.updateStore(user, id, dto);
    return mapStoreToDetail(store);
  }
}
