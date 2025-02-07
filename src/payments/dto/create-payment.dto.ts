import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumberString,
} from 'class-validator';

export class CreatePaymentDto {
  @IsOptional()
  @IsString()
  orderId?: string;

  @IsNotEmpty()
  @IsNumberString()
  amount: string;

  @IsOptional()
  @IsString()
  fromWalletAddress?: string;

  @IsOptional()
  @IsString()
  toWalletAddress?: string;

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
