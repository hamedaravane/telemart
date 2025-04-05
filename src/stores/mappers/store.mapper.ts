import { Store } from '@/stores/entities/store.entity';
import { StoreDetailDto, StorePreviewDto, StoreSummaryDto } from '@/stores/dto';
import { mapUserToSummary } from '@/users/mappers/user.mapper';
import { mapProductToPreview } from '@/products/mappers/product.mapper';
import { mapAddressToDto } from '@/locations/mappers/location.mapper';

/**
 * Maps minimal store data for public or list previews
 */
export function mapStoreToPreview(store: Store): StorePreviewDto {
  return {
    id: store.id,
    name: store.name,
    slug: store.slug ?? undefined,
    logo: store.logoUrl ? { url: store.logoUrl } : undefined,
    reputation: store.reputation ?? 5.0,
    isActive: store.isActive ?? true,
  };
}

/**
 * Adds address, tags, and description — great for listing pages or dashboard
 */
export function mapStoreToSummary(store: Store): StoreSummaryDto {
  return {
    ...mapStoreToPreview(store),
    tags: store.tags ?? [],
    addresses: store.addresses?.map(mapAddressToDto) ?? [],
    description: store.description ?? undefined,
  };
}

/**
 * Full detail mapper used for store profile/detail pages
 */
export function mapStoreToDetail(store: Store): StoreDetailDto {
  return {
    ...mapStoreToSummary(store),
    owner: mapUserToSummary(store.owner),
    contactNumber: store.contactNumber ?? undefined,
    email: store.email ?? undefined,
    socialMediaLinks: store.socialMediaLinks ?? undefined,
    workingHours: store.workingHours ?? undefined,
    products: store.products?.map(mapProductToPreview) ?? [],
    createdAt: store.createdAt,
  };
}
