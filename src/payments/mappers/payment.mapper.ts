import { Payment } from '../payment.entity';
import { PaymentSummary, PaymentDetail } from './types';
import { mapOrderToSummary } from '../../orders/mappers/order.mapper';
import { mapUserToSummary } from '../../users/mappers/user.mapper';

export function mapPaymentToSummary(payment: Payment): PaymentSummary {
  return {
    id: payment.id,
    status: payment.status,
    amount: payment.amount,
    transactionHash: payment.transactionHash,
    createdAt: payment.createdAt,
  };
}

export function mapPaymentToDetail(payment: Payment): PaymentDetail {
  return {
    ...mapPaymentToSummary(payment),
    gasFee: payment.gasFee ?? undefined,
    commission: payment.commission ?? undefined,
    fromWalletAddress: payment.fromWalletAddress ?? undefined,
    toWalletAddress: payment.toWalletAddress ?? undefined,
    order: mapOrderToSummary(payment.order),
    user: mapUserToSummary(payment.user),
  };
}
