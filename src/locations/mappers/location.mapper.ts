import { Country } from '../country.entity';
import { State } from '../state.entity';
import { City } from '../city.entity';
import { CanonicalLocation } from './types';

export function mapCountryToCanonical(country: Country): CanonicalLocation {
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

export function mapStateToCanonical(state: State): CanonicalLocation {
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

export function mapCityToCanonical(city: City): CanonicalLocation {
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
