import { IsOptional, IsString } from 'class-validator';

export class CreateOrderShipmentDto {
  @IsString()
  trackingNumber: string;

  @IsString()
  courierService: string;

  @IsOptional()
  @IsString()
  deliveryEstimate?: string;
}
