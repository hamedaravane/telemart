import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @Min(0.00000001, { message: 'Amount must be at least 0.00000001 TON' })
  amount: number;

  @IsString()
  @IsNotEmpty()
  senderWalletAddress: string;

  @IsString()
  @IsNotEmpty()
  transactionId: string;
}
