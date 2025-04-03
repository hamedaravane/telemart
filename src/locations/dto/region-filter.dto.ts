import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class RegionFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  countryId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  stateId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  cityId?: number;
}
