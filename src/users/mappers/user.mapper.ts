import { User } from '../user.entity';
import { UserPrivateProfile, UserPublicPreview, UserSummary } from './types';

export function mapUserToPublicPreview(user: User): UserPublicPreview {
  return {
    id: user.id,
    username: user.name,
    handle: undefined,
    photo: undefined,
  };
}

export function mapUserToSummary(user: User): UserSummary {
  const [firstName, ...rest] = user.name.split(' ');
  return {
    ...mapUserToPublicPreview(user),
    firstName,
    lastName: rest.join(' ') || undefined,
    role: user.role,
    address: null,
  };
}

export function mapUserToPrivateProfile(user: User): UserPrivateProfile {
  return {
    ...mapUserToSummary(user),
    telegramId: user.telegramId,
    phoneNumber: user.phoneNumber,
    email: user.email,
    walletAddress: user.walletAddress,
    stores: user.stores?.map((store) => ({
      id: store.id,
      name: store.name,
      logo: store.logoUrl ? [{ url: store.logoUrl }] : [],
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
        logo: order.store?.logoUrl ? [{ url: order.store.logoUrl }] : [],
        reputation: order.store?.reputation || 5,
        isActive: true,
      },
      deliveryDate: order.deliveryDate,
      createdAt: order.createdAt,
    })),
  };
}
