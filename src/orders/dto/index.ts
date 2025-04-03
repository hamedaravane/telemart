import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductPreviewDto } from '@/products/dto';
import { OrderStatus } from '@/orders/order.entity';
import { StorePreviewDto } from '@/stores/dto';
import { PaymentSummaryDto } from '@/payments/dto';
import { UserSummaryDto } from '@/users/dto';

export class OrderItemPreviewDto {
  @ApiProperty({ type: () => ProductPreviewDto })
  @ValidateNested()
  @Type(() => ProductPreviewDto)
  product: ProductPreviewDto;

  @ApiProperty() @IsNumber() quantity: number;
  @ApiProperty() @IsNumber() totalPrice: number;
}

export class OrderSummaryDto {
  @ApiProperty() @IsNumber() id: number;

  @ApiProperty({ enum: OrderStatus }) @IsEnum(OrderStatus) status: OrderStatus;

  @ApiProperty() @IsNumber() totalAmount: number;

  @ApiProperty({ type: () => StorePreviewDto })
  @Type(() => StorePreviewDto)
  store: StorePreviewDto;

  @ApiProperty() deliveryDate: Date;
  @ApiProperty() createdAt: Date;
}

export class OrderShipmentDto {
  @ApiProperty() id: number;

  @ApiProperty() @IsString() trackingNumber: string;

  @ApiPropertyOptional() @IsOptional() @IsString() carrierTrackingUrl?: string;

  @ApiPropertyOptional({
    enum: ['created', 'in_transit', 'delivered', 'failed'],
  })
  @IsOptional()
  @IsString()
  status?: 'created' | 'in_transit' | 'delivered' | 'failed';

  @ApiProperty() @IsString() courierService: string;

  @ApiProperty() @IsDateString() deliveryEstimate: Date;

  @ApiProperty() @IsDateString() shippedAt: Date;
}

export class OrderDetailDto extends OrderSummaryDto {
  @ApiProperty({ type: () => [OrderItemPreviewDto] })
  @ValidateNested({ each: true })
  @Type(() => OrderItemPreviewDto)
  items: OrderItemPreviewDto[];

  @ApiPropertyOptional({ type: () => OrderShipmentDto })
  @ValidateNested()
  @Type(() => OrderShipmentDto)
  shipment?: OrderShipmentDto;

  @ApiPropertyOptional({ type: () => PaymentSummaryDto })
  @ValidateNested()
  @Type(() => PaymentSummaryDto)
  payment?: PaymentSummaryDto;

  @ApiProperty({ type: () => UserSummaryDto })
  @ValidateNested()
  @Type(() => UserSummaryDto)
  buyer: UserSummaryDto;
}

export class CreateOrderDto {
  @ApiProperty() @IsNumber() buyerId: number;

  @ApiProperty({ type: () => [CreateOrderItemDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiPropertyOptional({ enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shippingAddress?: string;
}

export class CreateOrderItemDto {
  @ApiProperty() @IsNumber() productId: number;
  @ApiProperty() @IsNumber() quantity: number;
}

export class CreateOrderShipmentDto {
  @ApiProperty() @IsString() trackingNumber: string;
  @ApiProperty() @IsString() courierService: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deliveryEstimate?: string;
}

export class UpdateOrderDto {
  @ApiPropertyOptional({ enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @ApiPropertyOptional({ type: () => [CreateOrderItemDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items?: CreateOrderItemDto[];
}
