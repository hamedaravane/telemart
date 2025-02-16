export interface GeoNameCountry {
  continent: string;
  capital: string;
  countryCode: string;
  countryName: string;
  geonameId: number;
}

export interface GeoNameCountryResponse {
  geonames: GeoNameCountry[];
}

export interface GeoNameChild {
  fcode: string;
  geonameId: number;
  name: string;
  adminCode1?: string;
  postalCode?: string;
  lat: string;
  lng: string;
}

export interface GeoNameChildrenResponse {
  geonames: GeoNameChild[];
}
