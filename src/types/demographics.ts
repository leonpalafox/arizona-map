export interface CountyDemographics {
  fips: string;
  name: string;
  population: number;
  medianIncome: number;
  ageDistribution: AgeDistribution;
  housingUnits?: number;
  areaSquareMiles?: number;
  populationDensity?: number;
}

export interface AgeDistribution {
  under18: number;
  age18to64: number;
  age65Plus: number;
}

export interface CountyProperties {
  FIPS?: string;
  NAME: string;
  GEOID?: string;
  demographics?: CountyDemographics;
}

export interface County {
  type: 'Feature';
  id?: string | number;
  geometry: GeoJSON.Geometry;
  properties: CountyProperties;
}

export interface CountiesGeoJSON {
  type: 'FeatureCollection';
  features: County[];
}

export type DataOverlay = 'population' | 'income' | 'age' | 'density' | 'election';

export interface MapViewport {
  latitude: number;
  longitude: number;
  zoom: number;
}
