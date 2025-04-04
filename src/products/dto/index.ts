import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductType } from '@/products/entities/product.entity';
import { StorePreviewDto } from '@/stores/dto';
import { ReviewPreviewDto } from '@/reviews/dto';

class MediaDto {
  @ApiProperty() @IsString() url: string;
  @ApiPropertyOptional() @IsOptional() @IsString() alt?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() width?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() height?: number;
}

export class ProductPreviewDto {
  @ApiProperty() @IsString() id: string | number;

  @ApiProperty() @IsString() name: string;

  @ApiPropertyOptional() @IsOptional() @IsString() slug?: string;

  @ApiProperty({ type: () => [MediaDto] })
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  image: MediaDto[];

  @ApiProperty() @IsNumber() price: number;

  @ApiProperty() @IsString() storeId: string | number;
}

export class ProductSummaryDto extends ProductPreviewDto {
  @ApiProperty({ enum: ProductType })
  @IsEnum(ProductType)
  productType: ProductType;

  @ApiProperty()
  @ValidateNested()
  @Type(() => StorePreviewDto)
  store: StorePreviewDto;
}

class ProductCategoryPathDto {
  @ApiProperty() id: number;
  @ApiProperty() name: string;
  @ApiProperty() slug: string;
}

export class ProductAttributeDto {
  @ApiProperty({ example: 1, description: 'Attribute ID' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Color', description: 'Name of the attribute' })
  @IsString()
  attributeName: string;

  @ApiProperty({ example: 'Black', description: 'Value of the attribute' })
  @IsString()
  attributeValue: string;
}

export class ProductVariantDto {
  @ApiProperty({ example: 1, description: 'Variant ID' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Size', description: 'Name of the variant' })
  @IsString()
  variantName: string;

  @ApiProperty({ example: 'M', description: 'Value of the variant' })
  @IsString()
  variantValue: string;

  @ApiPropertyOptional({
    example: 5.99,
    description: 'Extra price for variant',
  })
  @IsOptional()
  @IsNumber()
  additionalPrice?: number;
}

export class ProductDetailDto extends ProductSummaryDto {
  @ApiPropertyOptional() @IsOptional() description?: string;

  @ApiPropertyOptional({ type: () => [ProductAttributeDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeDto)
  attributes?: ProductAttributeDto[];

  @ApiPropertyOptional({ type: () => [ProductVariantDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants?: ProductVariantDto[];

  @ApiProperty() categoryId: number;

  @ApiPropertyOptional({ type: () => [ProductCategoryPathDto] })
  @IsOptional()
  categoryPath?: ProductCategoryPathDto[];

  @ApiPropertyOptional() @IsOptional() stock?: number;

  @ApiPropertyOptional() @IsOptional() downloadLink?: string;

  @ApiPropertyOptional({ type: () => [ReviewPreviewDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ReviewPreviewDto)
  reviews?: ReviewPreviewDto[];

  @ApiProperty() createdAt: Date;
}

export class CreateProductDto {
  @ApiProperty() @IsString() name: string;

  @ApiProperty() @IsNumber() price: number;

  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;

  @ApiProperty() @IsString() imageUrl: string;

  @ApiProperty({ enum: ProductType })
  @IsEnum(ProductType)
  productType: ProductType;

  @ApiPropertyOptional() @IsOptional() @IsString() downloadLink?: string;

  @ApiPropertyOptional() @IsOptional() @IsNumber() stock?: number;

  @ApiPropertyOptional({ type: () => [CreateProductAttributeDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductAttributeDto)
  attributes?: CreateProductAttributeDto[];

  @ApiPropertyOptional({ type: () => [CreateProductVariantDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants?: CreateProductVariantDto[];
}

export class CreateProductAttributeDto {
  @ApiProperty() @IsString() attributeName: string;
  @ApiProperty() @IsString() attributeValue: string;
}

export class CreateProductVariantDto {
  @ApiProperty() @IsString() variantName: string;
  @ApiProperty() @IsString() variantValue: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  additionalPrice?: number;
}

export class UpdateProductDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;

  @ApiPropertyOptional() @IsOptional() @IsNumber() price?: number;

  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() imageUrl?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() downloadLink?: string;

  @ApiPropertyOptional() @IsOptional() @IsNumber() stock?: number;

  @ApiPropertyOptional({ type: () => [CreateProductAttributeDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductAttributeDto)
  attributes?: CreateProductAttributeDto[];

  @ApiPropertyOptional({ type: () => [CreateProductVariantDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants?: CreateProductVariantDto[];
}
