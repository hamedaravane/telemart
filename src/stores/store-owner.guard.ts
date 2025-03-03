import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { StoresService } from './stores.service';
import { User } from '../users/user.entity';

@Injectable()
export class StoreOwnerGuard implements CanActivate {
  constructor(
    private readonly storesService: StoresService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const storeId = parseInt(request.params.id, 10);

    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    if (isNaN(storeId)) {
      throw new NotFoundException('Invalid store ID');
    }

    const store = await this.storesService.findStoreById(storeId);
    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }
    if (store.owner.id !== user.id) {
      throw new UnauthorizedException('You are not the owner of this store');
    }
    return true;
  }
}
