import { IsOptional, IsEnum, IsString, IsNumberString } from 'class-validator';
import { PaymentStatus } from '../payment.entity';

export class UpdatePaymentDto {
  @IsOptional()
  @IsEnum(PaymentStatus, { message: 'Invalid payment status' })
  status?: PaymentStatus;

  @IsOptional()
  @IsString()
  transactionHash?: string;

  @IsOptional()
  @IsNumberString()
  gasFee?: string;

  @IsOptional()
  @IsNumberString()
  commission?: string;
}
