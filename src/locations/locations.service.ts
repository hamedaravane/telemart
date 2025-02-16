import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './country.entity';
import { State } from './state.entity';
import { City } from './city.entity';

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
      throw new NotFoundException(`Country with id ${id} not found`);
    }
    return country;
  }

  async getStatesByCountry(countryId: number): Promise<State[]> {
    const country = await this.countryRepository.findOne({
      where: { id: countryId },
    });
    if (!country) {
      throw new NotFoundException(`Country with id ${countryId} not found`);
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
      throw new NotFoundException(`State with id ${id} not found`);
    }
    return state;
  }

  async getCitiesByState(stateId: number): Promise<City[]> {
    const state = await this.stateRepository.findOne({
      where: { id: stateId },
    });
    if (!state) {
      throw new NotFoundException(`State with id ${stateId} not found`);
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
      throw new NotFoundException(`City with id ${id} not found`);
    }
    return city;
  }
}
