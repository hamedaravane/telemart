import { IsNumber, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsNumber()
  @Min(1, { message: 'Product ID must be valid' })
  productId: number;

  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}
