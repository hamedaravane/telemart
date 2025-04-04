import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import {
  DeepPartial,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { Country } from './entities/country.entity';
import { State } from './entities/state.entity';
import { City } from './entities/city.entity';
import {
  GeoNameChildrenResponse,
  GeoNameCountryResponse,
} from './interfaces/geonames.interface';

@Injectable()
export class LocationsSyncService {
  private readonly logger = new Logger(LocationsSyncService.name);
  private readonly geonamesUsername: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,
    @InjectRepository(State)
    private readonly stateRepo: Repository<State>,
    @InjectRepository(City)
    private readonly cityRepo: Repository<City>,
  ) {
    const username = this.configService.get<string>('GEONAMES_USERNAME');
    if (!username) {
      throw new Error('GEONAMES_USERNAME is not configured.');
    }
    this.geonamesUsername = username;
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async handleCron(): Promise<void> {
    this.logger.log('Cron job triggered for location sync');
    await this.syncLocations();
  }

  async syncLocations(): Promise<void> {
    this.logger.log('Starting location sync...');

    try {
      const countriesUrl = `http://api.geonames.org/countryInfoJSON?username=${this.geonamesUsername}`;
      const countriesData =
        await this.fetchData<GeoNameCountryResponse>(countriesUrl);

      for (const countryRaw of countriesData.geonames ?? []) {
        const country = await this.upsert(
          this.countryRepo,
          { code: countryRaw.countryCode },
          () => ({
            code: countryRaw.countryCode,
            name: countryRaw.countryName,
            nameLocal: { en: countryRaw.countryName },
            capital: countryRaw.capital,
            region: countryRaw.continent,
          }),
        );

        if (!countryRaw.geonameId) continue;

        const statesUrl = `http://api.geonames.org/childrenJSON?geonameId=${countryRaw.geonameId}&username=${this.geonamesUsername}`;
        const statesData =
          await this.fetchData<GeoNameChildrenResponse>(statesUrl);

        for (const stateRaw of statesData.geonames ?? []) {
          if (!['ADM1', 'ADM2'].includes(stateRaw.fcode)) continue;

          const state = await this.upsert(
            this.stateRepo,
            {
              name: stateRaw.name,
              country: { id: country.id },
            },
            () => ({
              name: stateRaw.name,
              code: stateRaw.adminCode1,
              nameLocal: { en: stateRaw.name },
              country,
            }),
          );

          if (!stateRaw.geonameId) continue;

          const citiesUrl = `http://api.geonames.org/childrenJSON?geonameId=${stateRaw.geonameId}&username=${this.geonamesUsername}`;
          const citiesData =
            await this.fetchData<GeoNameChildrenResponse>(citiesUrl);

          for (const cityRaw of citiesData.geonames ?? []) {
            if (!cityRaw.name || !cityRaw.fcode?.startsWith('PPL')) continue;

            const lat = Number(cityRaw.lat);
            const lng = Number(cityRaw.lng);
            const hasValidGeo = this.isValidLatLng(lat, lng);

            await this.upsert(
              this.cityRepo,
              {
                name: cityRaw.name,
                state: { id: state.id },
              },
              () => ({
                name: cityRaw.name,
                nameLocal: { en: cityRaw.name },
                postalCode: cityRaw.postalCode,
                latitude: hasValidGeo ? lat : undefined,
                longitude: hasValidGeo ? lng : undefined,
                state,
              }),
            );
          }
        }
      }

      this.logger.log('Location sync completed.');
    } catch (e) {
      const err = e as Error;
      this.logger.error(
        `Error during location sync: ${err.message}`,
        err.stack,
      );
    }
  }

  private async fetchData<T>(url: string): Promise<T> {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await firstValueFrom(this.httpService.get<T>(url));
        return res.data;
      } catch (e) {
        const err = e as Error;
        this.logger.warn(
          `Attempt ${attempt} failed for ${url}: ${err.message}`,
        );
        await new Promise((res) => setTimeout(res, attempt * 1000));
      }
    }
    throw new Error(`Failed to fetch data from ${url} after 3 attempts`);
  }

  private async upsert<T extends ObjectLiteral>(
    repo: Repository<T>,
    where: FindOptionsWhere<T>,
    createFn: () => DeepPartial<T>,
  ): Promise<T> {
    const existing = await repo.findOne({ where });
    if (existing) return existing;

    const entity = repo.create(createFn());
    return await repo.save(entity);
  }

  private isValidLatLng(lat: unknown, lng: unknown): boolean {
    return (
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  }
}
