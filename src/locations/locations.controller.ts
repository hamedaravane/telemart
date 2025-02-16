import { Controller, Get, Param } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { Country } from './country.entity';
import { State } from './state.entity';
import { City } from './city.entity';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('countries')
  async getCountries(): Promise<Country[]> {
    return this.locationsService.getCountries();
  }

  @Get('countries/:id')
  async getCountry(@Param('id') id: number): Promise<Country> {
    return this.locationsService.getCountryById(Number(id));
  }

  @Get('countries/:id/states')
  async getStatesByCountry(@Param('id') countryId: number): Promise<State[]> {
    return this.locationsService.getStatesByCountry(Number(countryId));
  }

  @Get('states/:id')
  async getState(@Param('id') id: number): Promise<State> {
    return this.locationsService.getStateById(Number(id));
  }

  @Get('states/:id/cities')
  async getCitiesByState(@Param('id') stateId: number): Promise<City[]> {
    return this.locationsService.getCitiesByState(Number(stateId));
  }

  @Get('cities/:id')
  async getCity(@Param('id') id: number): Promise<City> {
    return this.locationsService.getCityById(Number(id));
  }
}
