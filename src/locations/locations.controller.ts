import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LocationsService } from './locations.service';
import {
  mapCityToCanonical,
  mapCountryToCanonical,
  mapStateToCanonical,
} from './mappers/location.mapper';
import {
  CanonicalLocationDto,
  NearestLocationResponseDto,
} from '@/locations/dto';
import { Country } from './entities/country.entity';
import { State } from './entities/state.entity';
import { City } from './entities/city.entity';
import { IsLatitude, IsLongitude } from 'class-validator';
import { Type } from 'class-transformer';

class GetNearestLocationQuery {
  @ApiProperty({
    description: 'Latitude of current location',
    example: 48.8566,
  })
  @IsLatitude()
  @Type(() => Number)
  lat: number;

  @ApiProperty({
    description: 'Longitude of current location',
    example: 2.3522,
  })
  @IsLongitude()
  @Type(() => Number)
  lng: number;
}

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('countries')
  @ApiOperation({ summary: 'Get all countries' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all countries',
    type: CanonicalLocationDto,
    isArray: true,
  })
  async getCountries(): Promise<CanonicalLocationDto[]> {
    const countries = await this.locationsService.getCountries();
    return countries
      .map(mapCountryToCanonical)
      .filter((c): c is CanonicalLocationDto => !!c);
  }

  @Get('countries/:id/states')
  @ApiOperation({ summary: 'Get all states in a country' })
  @ApiParam({ name: 'id', description: 'Country ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of states under a specific country',
    type: CanonicalLocationDto,
    isArray: true,
  })
  async getStatesByCountry(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CanonicalLocationDto[]> {
    const states = await this.locationsService.getStatesByCountry(id);
    return states
      .map(mapStateToCanonical)
      .filter((s): s is CanonicalLocationDto => !!s);
  }

  @Get('states/:id/cities')
  @ApiOperation({ summary: 'Get all cities in a state' })
  @ApiParam({ name: 'id', description: 'State ID', example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of cities under a specific state',
    type: CanonicalLocationDto,
    isArray: true,
  })
  async getCitiesByState(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CanonicalLocationDto[]> {
    const cities = await this.locationsService.getCitiesByState(id);
    return cities
      .map(mapCityToCanonical)
      .filter((c): c is CanonicalLocationDto => !!c);
  }

  @Get('nearest')
  @ApiOperation({
    summary: 'Find nearest country, state, and city by coordinates',
  })
  @ApiQuery({
    name: 'lat',
    type: Number,
    example: 40.7128,
    description: 'Latitude',
  })
  @ApiQuery({
    name: 'lng',
    type: Number,
    example: -74.006,
    description: 'Longitude',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the nearest canonical location based on coordinates',
    type: NearestLocationResponseDto,
  })
  async getNearestLocation(
    @Query() query: GetNearestLocationQuery,
  ): Promise<NearestLocationResponseDto> {
    const { lat, lng } = query;
    return this.locationsService.getNearestLocation(lat, lng);
  }

  @Get('countries/:id')
  @ApiOperation({ summary: 'Get a country by its ID' })
  @ApiParam({ name: 'id', description: 'Country ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Returns full country entity',
    type: Country,
  })
  async getCountry(@Param('id', ParseIntPipe) id: number): Promise<Country> {
    return this.locationsService.getCountryById(id);
  }

  @Get('states/:id')
  @ApiOperation({ summary: 'Get a state by its ID' })
  @ApiParam({ name: 'id', description: 'State ID', example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Returns full state entity',
    type: State,
  })
  async getState(@Param('id', ParseIntPipe) id: number): Promise<State> {
    return this.locationsService.getStateById(id);
  }

  @Get('cities/:id')
  @ApiOperation({ summary: 'Get a city by its ID' })
  @ApiParam({ name: 'id', description: 'City ID', example: 100 })
  @ApiResponse({
    status: 200,
    description: 'Returns full city entity',
    type: City,
  })
  async getCity(@Param('id', ParseIntPipe) id: number): Promise<City> {
    return this.locationsService.getCityById(id);
  }
}
