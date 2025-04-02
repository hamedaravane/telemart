import { UserSummary } from '../../../users/mappers/types';
import { PaymentStatus } from '../../payment.entity';
import { OrderSummary } from '../../../orders/mappers/types';

export interface PaymentSummary {
  id: number | string;
  status: PaymentStatus;
  amount: string;
  transactionHash: string;
  createdAt: Date;
}

export interface PaymentDetail extends PaymentSummary {
  gasFee?: string;
  commission?: string;
  fromWalletAddress?: string;
  toWalletAddress?: string;
  order: OrderSummary;
  user: UserSummary;
}
