import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
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
import { MediaDto } from '@/common/dto/media.dto';

export class ProductPreviewDto {
  @ApiProperty() @IsNumber() id: number;

  @ApiProperty() @IsString() name: string;

  @ApiPropertyOptional() @IsOptional() @IsString() slug?: string;

  @ApiProperty({ type: MediaDto })
  @ValidateNested()
  @Type(() => MediaDto)
  primaryImage: MediaDto;

  @ApiProperty() @IsNumber() price: number;

  @ApiProperty() @IsNumber() storeId: number;
}

export class ProductSummaryDto extends ProductPreviewDto {
  @ApiProperty({ enum: ProductType })
  @IsEnum(ProductType)
  productType: ProductType;

  @ApiProperty({ type: () => StorePreviewDto })
  @ValidateNested()
  @Type(() => StorePreviewDto)
  store: StorePreviewDto;
}

export class ProductDetailDto extends ProductSummaryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;

  @ApiProperty({ type: () => [MediaDto] })
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  images: MediaDto[];

  @ApiPropertyOptional({ type: () => [ProductAttributeTypeDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeTypeDto)
  attributeTypes?: ProductAttributeTypeDto[];

  @ApiPropertyOptional({ type: () => [ProductVariantDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants?: ProductVariantDto[];

  @ApiPropertyOptional() @IsOptional() @IsString() downloadLink?: string;

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

  @ApiProperty({ enum: ProductType })
  @IsEnum(ProductType)
  productType: ProductType;

  @ApiPropertyOptional() @IsOptional() @IsString() downloadLink?: string;

  @ApiPropertyOptional({ type: () => [CreateAttributeTypeDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateAttributeTypeDto)
  attributeTypes?: CreateAttributeTypeDto[];

  @ApiPropertyOptional({ type: () => [CreateProductVariantDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants?: CreateProductVariantDto[];
}

export class ProductVariantDto {
  @ApiProperty() id: number;
  @ApiPropertyOptional() sku?: string;
  @ApiPropertyOptional() additionalPrice?: number;

  @ApiProperty({ isArray: true })
  attributeValueIds: number[];
}

export class CreateProductVariantDto {
  @ApiPropertyOptional() @IsOptional() @IsString() sku?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() additionalPrice?: number;

  @ApiProperty({ isArray: true })
  attributeValueIds: number[];
}

export class ProductAttributeTypeDto {
  @ApiProperty() id: number;
  @ApiProperty() name: string;

  @ApiProperty({ type: () => [AttributeValueDto] })
  values: AttributeValueDto[];
}

export class CreateAttributeTypeDto {
  @ApiProperty() @IsString() name: string;

  @ApiProperty({ type: () => [CreateAttributeValueDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateAttributeValueDto)
  values: CreateAttributeValueDto[];
}

export class AttributeValueDto {
  @ApiProperty() id: number;
  @ApiProperty() value: string;
}

export class CreateAttributeValueDto {
  @ApiProperty() @IsString() value: string;
}

export class CreateProductAttributeDto {
  @ApiProperty() @IsString() attributeName: string;
  @ApiProperty() @IsString() attributeValue: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
