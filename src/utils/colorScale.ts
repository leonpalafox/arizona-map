import { scaleQuantize, ScaleQuantize, scaleLinear } from 'd3-scale';
import { DataOverlay, CountyDemographics } from '@/types/demographics';
import { CountyElectionResults } from '@/types/election';

// Color schemes for different data overlays
export const COLOR_SCHEMES = {
  population: ['#feedde', '#fdbe85', '#fd8d3c', '#e6550d', '#a63603'],
  income: ['#edf8e9', '#bae4b3', '#74c476', '#31a354', '#006d2c'],
  age: ['#eff3ff', '#bdd7e7', '#6baed6', '#3182bd', '#08519c'],
  density: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6'],
  election: ['#0015BC', '#3D5FD8', '#808080', '#D94141', '#DC143C'] // Strong Dem -> Neutral -> Strong Rep
};

// Election-specific colors
export const PARTY_COLORS = {
  Republican: '#DC143C',
  Democratic: '#0015BC',
  Libertarian: '#FED105',
  Green: '#17AA5C',
  Other: '#808080'
};

export function getColorScale(
  overlay: DataOverlay,
  data: CountyDemographics[]
): ScaleQuantize<string> {
  const values = data.map(d => getValueForOverlay(d, overlay)).filter(v => v !== null) as number[];

  const min = Math.min(...values);
  const max = Math.max(...values);

  const colors = COLOR_SCHEMES[overlay];

  return scaleQuantize<string>()
    .domain([min, max])
    .range(colors);
}

export function getValueForOverlay(
  demographics: CountyDemographics | undefined,
  overlay: DataOverlay
): number | null {
  if (!demographics) return null;
  if (overlay === 'election') return null; // Election uses different coloring logic

  switch (overlay) {
    case 'population':
      return demographics.population;
    case 'income':
      return demographics.medianIncome;
    case 'age':
      // Use median age approximation based on distribution
      return demographics.ageDistribution.age65Plus / demographics.population;
    case 'density':
      return demographics.populationDensity || 0;
    default:
      return null;
  }
}

// Get color for election results based on winner and margin
export function getElectionColor(electionResults: CountyElectionResults | undefined): string {
  if (!electionResults) return '#ccc';

  const { winnerParty, margin } = electionResults;

  // Create a color scale from strong Democratic (blue) to strong Republican (red)
  // Margin ranges from 0% (tie) to potentially 40%+ (landslide)
  const colorScale = scaleLinear<string>()
    .domain([-40, -10, 0, 10, 40])
    .range(['#0015BC', '#6B8DD6', '#E8E8E8', '#E57373', '#DC143C'])
    .clamp(true);

  // Use negative margin for Democratic, positive for Republican
  const signedMargin = winnerParty === 'Democratic' ? -margin : margin;

  return colorScale(signedMargin);
}

export function getColorForCounty(
  demographics: CountyDemographics | undefined,
  overlay: DataOverlay,
  scale: (value: number) => string
): string {
  const value = getValueForOverlay(demographics, overlay);
  if (value === null) return '#ccc';
  return scale(value);
}
