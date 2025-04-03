import { Country } from '../country.entity';
import { State } from '../state.entity';
import { City } from '../city.entity';
import { CanonicalLocationDto } from '../dto/canonical-location.dto';

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
