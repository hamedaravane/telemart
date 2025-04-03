import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class GeoCenter {
  @ApiProperty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  longitude: number;
}

export class GeoFilterDto {
  @ApiProperty({ type: () => GeoCenter })
  @ValidateNested()
  @Type(() => GeoCenter)
  center: GeoCenter;

  @ApiProperty()
  @IsNumber()
  radiusKm: number;
}
