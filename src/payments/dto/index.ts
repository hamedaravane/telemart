import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentStatus } from '@/payments/payment.entity';
import { OrderSummaryDto } from '@/orders/dto';
import { UserSummaryDto } from '@/users/dto';

export class PaymentSummaryDto {
  @ApiProperty({ example: 'd4378b50-9cd9-47ee-b733-bec04e8af001' })
  @IsString()
  id: string;

  @ApiProperty({ enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({ example: '1000' })
  @IsNumberString()
  amount: string;

  @ApiProperty({ example: '0xabc123...' })
  @IsString()
  transactionHash: string;

  @ApiProperty()
  @IsDate()
  createdAt: Date;
}

export class PaymentDetailDto extends PaymentSummaryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gasFee?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  commission?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fromWalletAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  toWalletAddress?: string;

  @ApiProperty({ type: () => OrderSummaryDto })
  @Type(() => OrderSummaryDto)
  order: OrderSummaryDto;

  @ApiProperty({ type: () => UserSummaryDto })
  @Type(() => UserSummaryDto)
  user: UserSummaryDto;
}

export class CreatePaymentDto {
  @ApiPropertyOptional({ example: '1001' })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiProperty({ example: '1000' })
  @IsString()
  amount: string;

  @ApiPropertyOptional({ example: '0xabc...' })
  @IsOptional()
  @IsString()
  fromWalletAddress?: string;

  @ApiPropertyOptional({ example: '0xdef...' })
  @IsOptional()
  @IsString()
  toWalletAddress?: string;

  @ApiPropertyOptional({ example: '0xTRANSACTION123' })
  @IsOptional()
  @IsString()
  transactionHash?: string;

  @ApiPropertyOptional({ example: '20000' })
  @IsOptional()
  @IsString()
  gasFee?: string;

  @ApiPropertyOptional({ example: '300' })
  @IsOptional()
  @IsString()
  commission?: string;
}

export class UpdatePaymentDto {
  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transactionHash?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gasFee?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  commission?: string;
}
