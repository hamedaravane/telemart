export interface GeoNameCountry {
  /** Continent or region name (e.g., "Europe") */
  continent: string;

  /** Capital city of the country (e.g., "Paris") */
  capital: string;

  /** ISO country code (e.g., "FR") */
  countryCode: string;

  /** Full name of the country (e.g., "France") */
  countryName: string;

  /** GeoNames internal unique identifier */
  geonameId: number;
}

export interface GeoNameCountryResponse {
  geonames: GeoNameCountry[];
}

export interface GeoNameChild {
  /** Feature code describing type (e.g., 'ADM1', 'PPL') */
  fcode: string;

  /** Unique geoname ID for fetching children */
  geonameId: number;

  /** Display name of the region or city */
  name: string;

  /** Optional region code */
  adminCode1?: string;

  /** Optional postal code (mostly for cities) */
  postalCode?: string;

  /** Latitude in string format */
  lat: string;

  /** Longitude in string format */
  lng: string;
}

export interface GeoNameChildrenResponse {
  geonames: GeoNameChild[];
}
