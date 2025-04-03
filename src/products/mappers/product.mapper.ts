import { Product } from '@/products/product.entity';
import {
  ProductDetailDto,
  ProductPreviewDto,
  ProductSummaryDto,
} from '@/products/dto';
import { mapStoreToPreview } from '@/stores/mappers/store.mapper';

export function mapProductToPreview(product: Product): ProductPreviewDto {
  return {
    id: product.id,
    name: product.name,
    slug: undefined,
    price: Number(product.price),
    image: product.imageUrl ? [{ url: product.imageUrl }] : [],
    storeId: product.store?.id,
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
    description: product.description ?? undefined,
    attributes: product.attributes?.map((attr) => ({
      id: attr.id,
      attributeName: attr.attributeName,
      attributeValue: attr.attributeValue,
    })),
    variants: product.variants?.map((v) => ({
      id: v.id,
      variantName: v.variantName,
      variantValue: v.variantValue,
      additionalPrice: v.additionalPrice
        ? Number(v.additionalPrice)
        : undefined,
    })),
    categoryId: 0,
    categoryPath: [],
    stock: product.stock ?? undefined,
    downloadLink: product.downloadLink ?? undefined,
    reviews: [],
    createdAt: product.createdAt,
  };
}
