import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductVariantDto {
  @IsString()
  @IsNotEmpty()
  variantName: string;

  @IsString()
  @IsNotEmpty()
  variantValue: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Additional price must be a positive number' })
  additionalPrice?: number;
}
