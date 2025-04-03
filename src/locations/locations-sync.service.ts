import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { State } from './entities/state.entity';
import { City } from './entities/city.entity';
import {
  GeoNameCountryResponse,
  GeoNameChildrenResponse,
} from './interfaces/geonames.interface';

@Injectable()
export class LocationsSyncService {
  private readonly logger = new Logger(LocationsSyncService.name);
  private readonly geonamesUsername: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {
    const username = this.configService.get<string>('GEONAMES_USERNAME');
    if (!username) {
      throw new Error('GEONAMES_USERNAME is not set in configuration.');
    }
    this.geonamesUsername = username;
  }

  private async fetchData<T>(url: string): Promise<T> {
    try {
      const response = await firstValueFrom(this.httpService.get<T>(url));
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching data from URL: ${url}`, error);
      throw error;
    }
  }

  async syncLocations(): Promise<void> {
    this.logger.log('Starting location sync process...');
    try {
      const countriesUrl = `http://api.geonames.org/countryInfoJSON?username=${this.geonamesUsername}`;
      const countriesResponse =
        await this.fetchData<GeoNameCountryResponse>(countriesUrl);
      const countriesData = countriesResponse.geonames;
      if (!countriesData || !Array.isArray(countriesData)) {
        this.logger.error('Invalid countries data received');
        return;
      }

      for (const c of countriesData) {
        let country = await this.countryRepository.findOne({
          where: { code: c.countryCode },
        });
        if (!country) {
          country = this.countryRepository.create({
            code: c.countryCode,
            name: c.countryName,
            nameLocal: { en: c.countryName },
            capital: c.capital,
            region: c.continent,
          });
          country = await this.countryRepository.save(country);
          this.logger.log(`Saved country: ${country.name}`);
        }

        if (!c.geonameId) continue;

        const childrenUrl = `http://api.geonames.org/childrenJSON?geonameId=${c.geonameId}&username=${this.geonamesUsername}`;
        const childrenResponse =
          await this.fetchData<GeoNameChildrenResponse>(childrenUrl);
        const childrenData = childrenResponse.geonames || [];

        for (const child of childrenData) {
          if (child.fcode !== 'ADM1' && child.fcode !== 'ADM2') continue;
          let state = await this.stateRepository.findOne({
            where: {
              name: child.name,
              country: { id: country.id },
            },
            relations: ['country'],
          });
          if (!state) {
            state = this.stateRepository.create({
              name: child.name,
              code: child.adminCode1,
              nameLocal: { en: child.name },
              country,
            });
            state = await this.stateRepository.save(state);
            this.logger.log(
              `Saved state: ${state.name} for country ${country.name}`,
            );
          }

          if (!child.geonameId) continue;

          const stateChildrenUrl = `http://api.geonames.org/childrenJSON?geonameId=${child.geonameId}&username=${this.geonamesUsername}`;
          const stateChildrenResponse =
            await this.fetchData<GeoNameChildrenResponse>(stateChildrenUrl);
          const stateChildrenData = stateChildrenResponse.geonames || [];
          for (const cityData of stateChildrenData) {
            if (!cityData.fcode || !cityData.fcode.startsWith('PPL')) continue;
            let city = await this.cityRepository.findOne({
              where: {
                name: cityData.name,
                state: { id: state.id },
              },
              relations: ['state'],
            });
            if (!city) {
              city = this.cityRepository.create({
                name: cityData.name,
                nameLocal: { en: cityData.name },
                postalCode: cityData.postalCode,
                latitude: Number(cityData.lat),
                longitude: Number(cityData.lng),
                state,
              });
              city = await this.cityRepository.save(city);
              this.logger.log(
                `Saved city: ${city.name} in state ${state.name}`,
              );
            }
          }
        }
      }
      this.logger.log('Location sync completed.');
    } catch (error) {
      this.logger.error('Error during location sync', error);
    }
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async handleCron(): Promise<void> {
    this.logger.log('Cron job triggered for location sync.');
    await this.syncLocations();
  }
}
