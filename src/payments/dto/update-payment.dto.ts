import { IsOptional, IsEnum, IsString, IsNumberString } from 'class-validator';
import { PaymentStatus } from '../payment.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePaymentDto {
  @ApiPropertyOptional({
    description: 'Updated payment status',
    enum: PaymentStatus,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional({
    description: 'Transaction hash',
    example: '0xabcdef123456',
  })
  @IsOptional()
  @IsString()
  transactionHash?: string;

  @ApiPropertyOptional({
    description: 'Gas fee for the transaction',
    example: '0.01',
  })
  @IsOptional()
  @IsNumberString()
  gasFee?: string;

  @ApiPropertyOptional({ description: 'Commission amount', example: '2.5' })
  @IsOptional()
  @IsNumberString()
  commission?: string;
}
