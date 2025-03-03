import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { LocationsService } from './locations.service';
import { Country } from './country.entity';
import { State } from './state.entity';
import { City } from './city.entity';

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
  async getCountries(): Promise<Country[]> {
    return this.locationsService.getCountries();
  }

  @Get('countries/:id')
  @ApiOperation({ summary: 'Get a country by ID' })
  @ApiParam({ name: 'id', description: 'Country ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Country details', type: Country })
  async getCountry(@Param('id') id: number): Promise<Country> {
    return this.locationsService.getCountryById(Number(id));
  }

  @Get('countries/:id/states')
  @ApiOperation({ summary: 'Get all states in a country' })
  @ApiParam({ name: 'id', description: 'Country ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'List of states in the country',
    type: [State],
  })
  async getStatesByCountry(@Param('id') countryId: number): Promise<State[]> {
    return this.locationsService.getStatesByCountry(Number(countryId));
  }

  @Get('states/:id')
  @ApiOperation({ summary: 'Get a state by ID' })
  @ApiParam({ name: 'id', description: 'State ID', example: 10 })
  @ApiResponse({ status: 200, description: 'State details', type: State })
  async getState(@Param('id') id: number): Promise<State> {
    return this.locationsService.getStateById(Number(id));
  }

  @Get('states/:id/cities')
  @ApiOperation({ summary: 'Get all cities in a state' })
  @ApiParam({ name: 'id', description: 'State ID', example: 10 })
  @ApiResponse({
    status: 200,
    description: 'List of cities in the state',
    type: [City],
  })
  async getCitiesByState(@Param('id') stateId: number): Promise<City[]> {
    return this.locationsService.getCitiesByState(Number(stateId));
  }

  @Get('cities/:id')
  @ApiOperation({ summary: 'Get a city by ID' })
  @ApiParam({ name: 'id', description: 'City ID', example: 100 })
  @ApiResponse({ status: 200, description: 'City details', type: City })
  async getCity(@Param('id') id: number): Promise<City> {
    return this.locationsService.getCityById(Number(id));
  }
}
