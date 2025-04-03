import { ApiProperty } from '@nestjs/swagger';
import { CanonicalLocationDto } from './canonical-location.dto';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

export class NearestLocationResponseDto {
  @ApiProperty({ type: () => CanonicalLocationDto })
  @ValidateNested()
  @Type(() => CanonicalLocationDto)
  country: CanonicalLocationDto;

  @ApiProperty({ type: () => CanonicalLocationDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CanonicalLocationDto)
  state?: CanonicalLocationDto;

  @ApiProperty({ type: () => CanonicalLocationDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CanonicalLocationDto)
  city?: CanonicalLocationDto;
}
