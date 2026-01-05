export interface CensusAPIResponse {
  data: string[][];
  headers: string[];
}

export interface CensusVariable {
  name: string;
  label: string;
  concept: string;
}

export interface CensusDataPoint {
  state: string;
  county: string;
  value: string;
  name?: string;
}
