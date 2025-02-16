import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { Country } from './country.entity';
import { State } from './state.entity';
import { City } from './city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Country, State, City])],
  providers: [LocationsService],
  controllers: [LocationsController],
  exports: [LocationsService],
})
export class LocationsModule {}
