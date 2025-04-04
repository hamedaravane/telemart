import { User } from '../user.entity';
import {
  UserPrivateProfileDto,
  UserPublicPreviewDto,
  UserSummaryDto,
} from '@/users/dto';
import { mapAddressToDto } from '@/locations/mappers/location.mapper';

export function mapUserToPublicPreview(user: User): UserPublicPreviewDto {
  return {
    id: user.id,
    username: user.username,
    handle: undefined,
    photo: user.photoUrl ? { url: user.photoUrl } : undefined,
  };
}

export function mapUserToSummary(user: User): UserSummaryDto {
  return {
    ...mapUserToPublicPreview(user),
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    addresses: user.addresses.map(mapAddressToDto),
  };
}

export function mapUserToPrivateProfile(user: User): UserPrivateProfileDto {
  return {
    ...mapUserToSummary(user),
    telegramId: user.telegramId,
    phoneNumber: user.phoneNumber,
    email: user.email,
    walletAddress: user.walletAddress,
    stores: user.stores?.map((store) => ({
      id: store.id,
      name: store.name,
      logo: store.logoUrl ? { url: store.logoUrl } : undefined,
      reputation: store.reputation,
      isActive: true,
    })),
    orders: user.orders?.map((order) => ({
      id: order.id,
      status: order.status,
      totalAmount: order.totalAmount,
      store: {
        id: order.store?.id,
        name: order.store?.name,
        logo: order.store?.logoUrl ? { url: order.store.logoUrl } : undefined,
        reputation: order.store?.reputation || 5,
        isActive: true,
      },
      deliveryDate: order.deliveryDate ?? new Date(),
      createdAt: order.createdAt,
    })),
  };
}
