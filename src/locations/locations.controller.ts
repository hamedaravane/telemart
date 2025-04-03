import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { LocationsService } from './locations.service';
import { Country } from './entities/country.entity';
import { State } from './entities/state.entity';
import { City } from './entities/city.entity';
import {
  mapCityToCanonical,
  mapCountryToCanonical,
  mapStateToCanonical,
} from './mappers/location.mapper';
import { CanonicalLocation, NearestLocationResponse } from './mappers/types';

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('countries')
  @ApiOperation({ summary: 'Get all countries' })
  @ApiResponse({
    status: 200,
    description: 'List of all countries',
    type: [Country],
  })
  async getCountries(): Promise<CanonicalLocation[]> {
    const countries = await this.locationsService.getCountries();
    return countries.map(mapCountryToCanonical);
  }

  @Get('countries/:id/states')
  @ApiOperation({ summary: 'Get all states in a country' })
  @ApiParam({ name: 'id', description: 'Country ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'List of states in the country',
    type: [State],
  })
  async getStatesByCountry(
    @Param('id') id: number,
  ): Promise<CanonicalLocation[]> {
    const states = await this.locationsService.getStatesByCountry(Number(id));
    return states.map(mapStateToCanonical);
  }

  @Get('states/:id/cities')
  @ApiOperation({ summary: 'Get all cities in a state' })
  @ApiParam({ name: 'id', description: 'State ID', example: 10 })
  @ApiResponse({
    status: 200,
    description: 'List of cities in the state',
    type: [City],
  })
  async getCitiesByState(
    @Param('id') id: number,
  ): Promise<CanonicalLocation[]> {
    const cities = await this.locationsService.getCitiesByState(Number(id));
    return cities.map(mapCityToCanonical);
  }

  @Get('nearest')
  async getNearestLocation(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
  ): Promise<NearestLocationResponse> {
    return this.locationsService.getNearestLocation(+lat, +lng);
  }

  @Get('countries/:id')
  @ApiOperation({ summary: 'Get a country by ID' })
  @ApiParam({ name: 'id', description: 'Country ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Country details', type: Country })
  async getCountry(@Param('id') id: number): Promise<Country> {
    return this.locationsService.getCountryById(Number(id));
  }

  @Get('states/:id')
  @ApiOperation({ summary: 'Get a state by ID' })
  @ApiParam({ name: 'id', description: 'State ID', example: 10 })
  @ApiResponse({ status: 200, description: 'State details', type: State })
  async getState(@Param('id') id: number): Promise<State> {
    return this.locationsService.getStateById(Number(id));
  }

  @Get('cities/:id')
  @ApiOperation({ summary: 'Get a city by ID' })
  @ApiParam({ name: 'id', description: 'City ID', example: 100 })
  @ApiResponse({ status: 200, description: 'City details', type: City })
  async getCity(@Param('id') id: number): Promise<City> {
    return this.locationsService.getCityById(Number(id));
  }
}
