import { User } from '../user.entity';
import {
  UserPrivateProfileDto,
  UserPublicPreviewDto,
  UserSummaryDto,
} from '@/users/dto';
import { mapAddressToDto } from '@/locations/mappers/location.mapper';
import { mapStoreToPreview } from '@/stores/mappers/store.mapper';
import { mapOrderToSummary } from '@/orders/mappers/order.mapper';

function mapMedia(url?: string): { url: string } | undefined {
  return url ? { url } : undefined;
}

export function mapUserToPublicPreview(user: User): UserPublicPreviewDto {
  return {
    id: user.id,
    username: user.username,
    handle: user.username ?? undefined,
    photo: mapMedia(user.photoUrl),
  };
}

export function mapUserToSummary(user: User): UserSummaryDto {
  return {
    ...mapUserToPublicPreview(user),
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    addresses: user.addresses?.map(mapAddressToDto) ?? [],
  };
}

export function mapUserToPrivateProfile(user: User): UserPrivateProfileDto {
  return {
    ...mapUserToSummary(user),
    telegramId: user.telegramId,
    phoneNumber: user.phoneNumber,
    email: user.email,
    walletAddress: user.walletAddress,
    stores: user.stores?.map(mapStoreToPreview),
    orders: user.orders?.map(mapOrderToSummary),
  };
}
