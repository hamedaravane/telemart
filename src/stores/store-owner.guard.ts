import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { StoresService } from './stores.service';

@Injectable()
export class StoreOwnerGuard implements CanActivate {
  constructor(private readonly storesService: StoresService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const storeId = parseInt(request.params.id, 10);
    const user = request.user;

    if (!storeId || !user) {
      throw new ForbiddenException('Store ID or user not provided');
    }

    const store = await this.storesService.findStoreById(storeId);
    if (store.owner.id !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to modify this store',
      );
    }
    return true;
  }
}
