import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { PaymentMethod } from '../payment.entity';

export class CreatePaymentDto {
  @IsNumber()
  @Min(0.01, { message: 'Amount must be at least 0.01' })
  amount: number;

  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsEnum(PaymentMethod, { message: 'Invalid payment method' })
  method: PaymentMethod;
}
