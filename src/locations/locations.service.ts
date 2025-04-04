import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { State } from './entities/state.entity';
import { City } from './entities/city.entity';
import {
  mapCityToCanonical,
  mapCountryToCanonical,
  mapStateToCanonical,
} from './mappers/location.mapper';
import { NearestLocationResponseDto } from '@/locations/dto';

/**
 * Utility to compute the distance between two geo-points using the Haversine formula.
 */
function getDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (val: number) => (val * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async getCountries(): Promise<Country[]> {
    return this.countryRepository.find();
  }

  async getCountryById(id: number): Promise<Country> {
    const country = await this.countryRepository.findOne({
      where: { id },
      relations: ['states'],
    });
    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }
    return country;
  }

  async getStatesByCountry(countryId: number): Promise<State[]> {
    const country = await this.countryRepository.findOneBy({ id: countryId });
    if (!country) {
      throw new NotFoundException(`Country with ID ${countryId} not found`);
    }

    return this.stateRepository.find({
      where: { country: { id: countryId } },
      relations: ['country'],
    });
  }

  async getStateById(id: number): Promise<State> {
    const state = await this.stateRepository.findOne({
      where: { id },
      relations: ['country', 'cities'],
    });
    if (!state) {
      throw new NotFoundException(`State with ID ${id} not found`);
    }
    return state;
  }

  async getCitiesByState(stateId: number): Promise<City[]> {
    const state = await this.stateRepository.findOneBy({ id: stateId });
    if (!state) {
      throw new NotFoundException(`State with ID ${stateId} not found`);
    }

    return this.cityRepository.find({
      where: { state: { id: stateId } },
      relations: ['state'],
    });
  }

  async getCityById(id: number): Promise<City> {
    const city = await this.cityRepository.findOne({
      where: { id },
      relations: ['state', 'state.country'],
    });
    if (!city) {
      throw new NotFoundException(`City with ID ${id} not found`);
    }
    return city;
  }

  /**
   * Returns the nearest city (and its parent state and country)
   * based on the user’s geo coordinates.
   */
  async getNearestLocation(
    lat: number,
    lng: number,
  ): Promise<NearestLocationResponseDto> {
    const cities = await this.cityRepository.find({
      where: {
        latitude: Not(IsNull()),
        longitude: Not(IsNull()),
      },
      relations: ['state', 'state.country'],
    });

    if (!cities.length) {
      throw new NotFoundException(
        'No cities with coordinates found in database',
      );
    }

    let nearestCity: City | undefined;
    let minDistance = Infinity;

    for (const city of cities) {
      const distance = getDistanceKm(lat, lng, city.latitude!, city.longitude!);
      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = city;
      }
    }

    if (!nearestCity || !nearestCity.state || !nearestCity.state.country) {
      throw new NotFoundException('Unable to determine nearest location');
    }

    const canonicalCountry = mapCountryToCanonical(nearestCity.state.country);

    if (!canonicalCountry) {
      throw new NotFoundException('Unable to determine nearest location');
    }

    return {
      city: mapCityToCanonical(nearestCity),
      state: mapStateToCanonical(nearestCity.state),
      country: canonicalCountry,
    };
  }
}
