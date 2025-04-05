import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  ProductDetailDto,
  ProductPreviewDto,
  UpdateProductDto,
} from '@/products/dto';
import { StoreOwnerGuard } from '@/stores/store-owner.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@/users/user.entity';
import {
  mapProductToDetail,
  mapProductToPreview,
} from '@/products/mappers/product.mapper';

@ApiTags('Products')
@Controller('stores/:storeId/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List all products in a store' })
  @ApiParam({ name: 'storeId', type: Number })
  @ApiResponse({ status: 200, type: [ProductPreviewDto] })
  async listProducts(
    @Param('storeId', ParseIntPipe) storeId: number,
  ): Promise<ProductPreviewDto[]> {
    const products = await this.productsService.getStoreProducts(storeId);
    return products.map(mapProductToPreview);
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get product details by ID' })
  @ApiParam({ name: 'storeId', type: Number })
  @ApiParam({ name: 'productId', type: Number })
  @ApiResponse({ status: 200, type: ProductDetailDto })
  async getProductDetails(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<ProductDetailDto> {
    const product = await this.productsService.getProductById(
      storeId,
      productId,
    );
    return mapProductToDetail(product);
  }

  @Post()
  @UseGuards(StoreOwnerGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Create a new product in a store' })
  @ApiParam({ name: 'storeId', type: Number })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  async createProduct(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Body() dto: CreateProductDto,
    @CurrentUser() user: User,
  ) {
    const product = await this.productsService.createProduct(
      user,
      storeId,
      dto,
    );
    return mapProductToDetail(product);
  }

  @Patch(':productId')
  @UseGuards(StoreOwnerGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Update product in a store' })
  @ApiParam({ name: 'storeId', type: Number })
  @ApiParam({ name: 'productId', type: Number })
  async updateProduct(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: UpdateProductDto,
    @CurrentUser() user: User,
  ) {
    const updated = await this.productsService.updateProduct(
      user,
      storeId,
      productId,
      dto,
    );
    return mapProductToDetail(updated);
  }

  @Delete(':productId')
  @UseGuards(StoreOwnerGuard)
  @ApiOperation({ summary: 'Delete product in a store' })
  @ApiParam({ name: 'storeId', type: Number })
  @ApiParam({ name: 'productId', type: Number })
  async deleteProduct(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @CurrentUser() user: User,
  ) {
    return await this.productsService.deleteProduct(user, storeId, productId);
  }
}
