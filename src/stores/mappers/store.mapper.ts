import { Store } from '@/stores/store.entity';
import { StoreDetailDto, StorePreviewDto, StoreSummaryDto } from '@/stores/dto';
import { mapUserToSummary } from '@/users/mappers/user.mapper';
import { mapProductToPreview } from '@/products/mappers/product.mapper';
import { mapAddressToDto } from '@/locations/mappers/location.mapper';

export function mapStoreToPreview(store: Store): StorePreviewDto {
  return {
    id: store.id,
    name: store.name,
    slug: store.slug,
    logo: store.logoUrl ? { url: store.logoUrl } : undefined,
    reputation: store.reputation,
    isActive: true,
  };
}

export function mapStoreToSummary(store: Store): StoreSummaryDto {
  return {
    ...mapStoreToPreview(store),
    tags: [],
    addresses: store.addresses?.map(mapAddressToDto),
    description: store.description ?? undefined,
  };
}

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
