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
  UseInterceptors,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateStoreBasicDto,
  CreateStoreCategoryDto,
  CreateStoreLocationDto,
  CreateStoreWorkingHoursDto,
} from './dto/create-store.dto';

@ApiTags('stores')
@ApiBearerAuth()
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  /**
   * STEP 1: Create store with basic info.
   */
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

  /**
   * STEP 2: Update location info.
   */
  @Patch(':id/location')
  @ApiOperation({ summary: 'Update store location information' })
  @ApiResponse({
    status: 200,
    description: 'Store location updated successfully.',
  })
  async updateStoreLocation(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateStoreLocationDto,
  ) {
    return await this.storesService.updateStoreLocation(user, id, dto);
  }

  /**
   * STEP 3: Update store category.
   */
  @Patch(':id/category')
  @ApiOperation({ summary: 'Update store category' })
  @ApiResponse({
    status: 200,
    description: 'Store category updated successfully.',
  })
  async updateStoreCategory(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateStoreCategoryDto,
  ) {
    return await this.storesService.updateStoreCategory(user, id, dto);
  }

  /**
   * STEP 4: Update store working hours.
   */
  @Patch(':id/working-hours')
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

  /**
   * STEP 5: Upload store logo/photo.
   *
   * This endpoint accepts a file upload using the FileInterceptor.
   * It uses the ParseFilePipeBuilder to validate that the file:
   * - Is an image (jpeg, png, or gif)
   * - Does not exceed the maximum file size (e.g., 2MB)
   */
  @Post(':id/logo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload store logo or photo' })
  @ApiResponse({
    status: 200,
    description: 'Store logo updated successfully.',
  })
  async uploadStoreLogo(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /jpeg|png|gif/i,
        })
        .addMaxSizeValidator({
          maxSize: 2 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return await this.storesService.uploadStoreLogo(user, id, file);
  }
}
