import { Country } from '../country.entity';
import { State } from '../state.entity';
import { City } from '../city.entity';
import { CanonicalLocation } from './types';

export function mapCountryToCanonical(c: Country): CanonicalLocation {
  return {
    id: c.id,
    name: c.name,
    type: 'country' as const,
    parentId: undefined,
    postalCode: undefined,
    latitude: undefined,
    longitude: undefined,
  };
}

export function mapStateToCanonical(s: State): CanonicalLocation {
  return {
    id: s.id,
    name: s.name,
    type: 'state' as const,
    parentId: s.country?.id ?? undefined,
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
