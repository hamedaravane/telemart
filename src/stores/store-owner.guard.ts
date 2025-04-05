import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { StoresService } from '@/stores/stores.service';

@Injectable()
export class StoreOwnerGuard implements CanActivate {
  constructor(private readonly storesService: StoresService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const storeId = parseInt(request.params.storeId, 10);

    const isOwner = await this.storesService.isUserStoreOwner(storeId, user.id);
    if (!isOwner) {
      throw new ForbiddenException('You are not the owner of this store.');
    }

    return true;
  }
}
