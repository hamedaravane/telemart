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
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateAddressDto,
  CreateStoreBasicDto,
  CreateStoreTagsDto,
  CreateStoreWorkingHoursDto,
} from '@/stores/dto';
import { User } from '@/users/user.entity';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { StoresService } from './stores.service';
import { StoreOwnerGuard } from './store-owner.guard';

@ApiTags('stores')
@ApiBearerAuth()
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post('basic')
  @ApiOperation({ summary: 'Create store basic information' })
  @ApiResponse({
    status: 201,
    description: 'Store basic info created successfully.',
  })
  async createStoreBasic(
    @CurrentUser() user: User,
    @Body() dto: CreateStoreBasicDto,
  ) {
    return await this.storesService.createStoreBasic(user, dto);
  }

  @Patch(':id/location')
  @UseGuards(StoreOwnerGuard)
  @ApiOperation({ summary: 'Update store location information' })
  @ApiResponse({
    status: 200,
    description: 'Store location updated successfully.',
  })
  async updateStoreLocation(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateAddressDto,
  ) {
    return await this.storesService.updateStoreLocation(user, id, dto);
  }

  @Patch(':id/category')
  @UseGuards(StoreOwnerGuard)
  @ApiOperation({ summary: 'Update store category' })
  @ApiResponse({
    status: 200,
    description: 'Store category updated successfully.',
  })
  async updateStoreCategory(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateStoreTagsDto,
  ) {
    return await this.storesService.updateStoreCategory(user, id, dto);
  }

  @Patch(':id/working-hours')
  @UseGuards(StoreOwnerGuard)
  @ApiOperation({ summary: 'Update store working hours' })
  @ApiResponse({
    status: 200,
    description: 'Store working hours updated successfully.',
  })
  async updateStoreWorkingHours(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateStoreWorkingHoursDto,
  ) {
    return await this.storesService.updateStoreWorkingHours(user, id, dto);
  }

  @Post(':id/logo')
  @UseGuards(StoreOwnerGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload store logo or photo' })
  @ApiResponse({
    status: 200,
    description: 'Store logo updated successfully.',
  })
  async uploadStoreLogo(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /jpeg|png|gif/i })
        .addMaxSizeValidator({ maxSize: 2 * 1024 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    return await this.storesService.uploadStoreLogo(user, id, file);
  }

  @Patch(':id')
  @UseGuards(StoreOwnerGuard)
  @ApiOperation({ summary: 'Update store details' })
  @ApiResponse({ status: 200, description: 'Store updated successfully.' })
  async updateStore(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Update, // TODO: add dto
  ) {
    return await this.storesService.updateStore(user, id, dto);
  }
}
