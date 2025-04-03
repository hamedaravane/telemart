import { Payment } from '@/payments/payment.entity';
import { PaymentDetailDto, PaymentSummaryDto } from '@/payments/dto';
import { mapOrderToSummary } from '@/orders/mappers/order.mapper';
import { mapUserToSummary } from '@/users/mappers/user.mapper';

export function mapPaymentToSummary(payment: Payment): PaymentSummaryDto {
  return {
    id: payment.id,
    status: payment.status,
    amount: payment.amount,
    transactionHash: payment.transactionHash ?? '',
    createdAt: payment.createdAt,
  };
}

export function mapPaymentToDetail(payment: Payment): PaymentDetailDto {
  return {
    ...mapPaymentToSummary(payment),
    gasFee: payment.gasFee ?? undefined,
    commission: payment.commission ?? undefined,
    fromWalletAddress: payment.fromWalletAddress ?? undefined,
    toWalletAddress: payment.toWalletAddress ?? undefined,
    order: mapOrderToSummary(payment.order), // TODO: it has a problem
    user: mapUserToSummary(payment.user),
  };
}
