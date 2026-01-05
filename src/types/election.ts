export interface CandidateResults {
  name: string;
  party: 'Republican' | 'Democratic' | 'Libertarian' | 'Green' | 'Other';
  votes: number;
  percentage: number;
}

export interface ElectionResults {
  fips?: string;
  precinctId?: string;
  name: string;
  totalVotes: number;
  registeredVoters?: number;
  turnoutPercentage?: number;
  candidates: CandidateResults[];
  winner: string;
  winnerParty: 'Republican' | 'Democratic' | 'Libertarian' | 'Green' | 'Other';
  margin: number; // Margin of victory in percentage points
}

export interface CountyElectionResults extends ElectionResults {
  fips: string;
}

export interface PrecinctElectionResults extends ElectionResults {
  precinctId: string;
  countyFips: string;
}

export type ElectionDataLevel = 'county' | 'precinct';

export interface ElectionGeoProperties {
  FIPS?: string;
  PRECINCT_ID?: string;
  NAME: string;
  electionResults?: ElectionResults;
}
