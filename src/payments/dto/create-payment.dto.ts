import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumberString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiPropertyOptional({
    description: 'Order ID associated with this payment',
    example: 'order-12345',
  })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiProperty({ description: 'Amount of the payment', example: '1000' })
  @IsNotEmpty()
  @IsNumberString()
  amount: string;

  @ApiPropertyOptional({
    description: 'Wallet address of the sender',
    example: '0x1234567890abcdef',
  })
  @IsOptional()
  @IsString()
  fromWalletAddress?: string;

  @ApiPropertyOptional({
    description: 'Wallet address of the receiver',
    example: '0xfedcba0987654321',
  })
  @IsOptional()
  @IsString()
  toWalletAddress?: string;

  @ApiPropertyOptional({
    description: 'Transaction hash',
    example: '0xabcdef123456',
  })
  @IsOptional()
  @IsString()
  transactionHash?: string;

  @ApiPropertyOptional({
    description: 'Gas fee associated with the transaction',
    example: '0.01',
  })
  @IsOptional()
  @IsNumberString()
  gasFee?: string;

  @ApiPropertyOptional({ description: 'Commission charged', example: '2.5' })
  @IsOptional()
  @IsNumberString()
  commission?: string;
}
