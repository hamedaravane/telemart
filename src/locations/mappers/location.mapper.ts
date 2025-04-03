import { Country } from '../entities/country.entity';
import { State } from '../entities/state.entity';
import { City } from '../entities/city.entity';
import { AddressDto, CanonicalLocationDto } from '@/locations/dto';
import { Address } from '@/locations/entities/address.entity';

export function mapCountryToCanonical(country: Country): CanonicalLocationDto {
  return {
    id: country.id,
    name: country.name,
    type: 'country' as const,
    parentId: undefined,
    postalCode: undefined,
    latitude: undefined,
    longitude: undefined,
  };
}

export function mapStateToCanonical(state: State): CanonicalLocationDto {
  return {
    id: state.id,
    name: state.name,
    type: 'state' as const,
    parentId: state.country?.id ?? undefined,
    postalCode: undefined,
    latitude: undefined,
    longitude: undefined,
  };
}

export function mapCityToCanonical(city: City): CanonicalLocationDto {
  return {
    id: city.id,
    name: city.name,
    type: 'city' as const,
    parentId: city.state?.id ?? undefined,
    postalCode: city.postalCode ?? undefined,
    latitude: city.latitude ?? undefined,
    longitude: city.longitude ?? undefined,
  };
}

export function mapAddressToDto(address: Address): AddressDto {
  return {
    id: address.id,
    label: address.label,
    country: address.country
      ? mapCountryToCanonical(address.country)
      : undefined,
    state: address.state ? mapStateToCanonical(address.state) : undefined,
    city: address.city ? mapCityToCanonical(address.city) : undefined,
    fullText: [
      address.streetLine1,
      address.streetLine2,
      address.city?.name,
      address.state?.name,
      address.country?.name,
      address.postalCode,
    ]
      .filter(Boolean)
      .join(', '),
    streetLine1: address.streetLine1,
    streetLine2: address.streetLine2,
    postalCode: address.postalCode,
    latitude: Number(address.latitude),
    longitude: Number(address.longitude),
    type: address.type,
    isDefault: address.isDefault,
    createdAt: address.createdAt,
  };
}
