import { Product } from '@/products/entities/product.entity';
import { mapStoreToPreview } from '@/stores/mappers/store.mapper';
import { mapReviewToPreview } from '@/reviews/mappers/review.mapper';
import { MediaDto } from '@/common/dto/media.dto';
import { AttributeType } from '@/products/entities/attribute-type.entity';
import { ProductVariant } from '@/products/entities/product-variant.entity';
import { AttributeValue } from '@/products/entities/attribute-values.entity';
import {
  AttributeValueDto,
  ProductAttributeTypeDto,
  ProductDetailDto,
  ProductPreviewDto,
  ProductSummaryDto,
  ProductVariantDto,
} from '@/products/dto';

export function mapProductToPreview(product: Product): ProductPreviewDto {
  const primaryImage =
    product.images?.find((img) => img.isPrimary) ?? product.images?.[0];

  const image: MediaDto = {
    url: primaryImage?.url ?? '',
    alt: primaryImage?.alt,
  };

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    primaryImage: image,
    price: Number(product.price),
    storeId: product.store?.id ?? 0,
  };
}

export function mapProductToSummary(product: Product): ProductSummaryDto {
  return {
    ...mapProductToPreview(product),
    productType: product.productType,
    store: mapStoreToPreview(product.store),
  };
}

export function mapProductToDetail(product: Product): ProductDetailDto {
  return {
    ...mapProductToSummary(product),
    description: product.description,
    images:
      product.images?.map((img) => ({
        url: img.url,
        alt: img.alt,
        width: undefined,
        height: undefined,
      })) ?? [],
    attributeTypes: mapAttributeTypes(product.attributeTypes),
    variants: mapVariants(product.variants),
    downloadLink: product.downloadLink,
    reviews: product.reviews?.map(mapReviewToPreview) ?? [],
    createdAt: product.createdAt,
  };
}

export function mapAttributeValue(value: AttributeValue): AttributeValueDto {
  return {
    id: value.id,
    value: value.value,
  };
}

export function mapAttributeTypes(
  types?: AttributeType[] | null,
): ProductAttributeTypeDto[] {
  if (!types) return [];

  return types.map((type) => ({
    id: type.id,
    name: type.name,
    values: type.values?.map(mapAttributeValue) ?? [],
  }));
}

export function mapVariants(
  variants?: ProductVariant[] | null,
): ProductVariantDto[] {
  if (!variants) return [];

  return variants.map((variant) => ({
    id: variant.id,
    sku: variant.sku,
    additionalPrice: variant.additionalPrice,
    attributeValueIds: variant.attributeValues?.map((v) => v.id) ?? [],
  }));
}
