import { Country } from '../entities/country.entity';
import { State } from '../entities/state.entity';
import { City } from '../entities/city.entity';
import {
  AddressDto,
  CanonicalLocationDto,
  CanonicalLocationType,
} from '@/locations/dto';
import { Address } from '@/locations/entities/address.entity';

/**
 * Maps a Country entity to a CanonicalLocationDto.
 */
export function mapCountryToCanonical(
  country?: Country,
): CanonicalLocationDto | undefined {
  if (!country) return undefined;
  return {
    id: country.id,
    name: country.name,
    type: CanonicalLocationType.COUNTRY,
    parentId: undefined,
    postalCode: undefined,
    latitude: country.states?.[0]?.cities?.[0]?.latitude ?? undefined,
    longitude: country.states?.[0]?.cities?.[0]?.longitude ?? undefined,
  };
}

/**
 * Maps a State entity to a CanonicalLocationDto.
 */
export function mapStateToCanonical(
  state?: State,
): CanonicalLocationDto | undefined {
  if (!state) return undefined;
  return {
    id: state.id,
    name: state.name,
    type: CanonicalLocationType.STATE,
    parentId: state.country?.id ?? state.countryId ?? undefined,
    postalCode: undefined,
    latitude: state.cities?.[0]?.latitude ?? undefined,
    longitude: state.cities?.[0]?.longitude ?? undefined,
  };
}

/**
 * Maps a City entity to a CanonicalLocationDto.
 */
export function mapCityToCanonical(
  city?: City,
): CanonicalLocationDto | undefined {
  if (!city) return undefined;
  return {
    id: city.id,
    name: city.name,
    type: CanonicalLocationType.CITY,
    parentId: city.state?.id ?? city.stateId ?? undefined,
    postalCode: city.postalCode ?? undefined,
    latitude: city.latitude ?? undefined,
    longitude: city.longitude ?? undefined,
  };
}

/**
 * Maps a full Address entity to AddressDto.
 */
export function mapAddressToDto(address: Address): AddressDto {
  return {
    id: address.id,
    label: address.label ?? undefined,
    country: mapCountryToCanonical(address.country),
    state: mapStateToCanonical(address.state),
    city: mapCityToCanonical(address.city),
    streetLine1: address.streetLine1,
    streetLine2: address.streetLine2 ?? undefined,
    postalCode: address.postalCode ?? undefined,
    geoPoint: {
      latitude: Number(address.latitude),
      longitude: Number(address.longitude),
    },
    type: address.type,
    isDefault: address.isDefault,
  };
}
