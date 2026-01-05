import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Census API endpoint for ACS 5-Year Data
const CENSUS_API_BASE = 'https://api.census.gov/data/2023/acs/acs5';

// Arizona FIPS code
const ARIZONA_FIPS = '04';

// Census variables we want to fetch
const VARIABLES = {
  population: 'B01003_001E',           // Total Population
  medianIncome: 'B19013_001E',         // Median Household Income
  under18: 'B01001_003E,B01001_027E',  // Male + Female Under 18
  age18to64: 'B01001_007E,B01001_008E,B01001_009E,B01001_010E,B01001_011E,B01001_012E,B01001_013E,B01001_014E,B01001_015E,B01001_016E,B01001_017E,B01001_018E,B01001_019E,B01001_031E,B01001_032E,B01001_033E,B01001_034E,B01001_035E,B01001_036E,B01001_037E,B01001_038E,B01001_039E,B01001_040E,B01001_041E,B01001_042E,B01001_043E',
  age65Plus: 'B01001_020E,B01001_021E,B01001_022E,B01001_023E,B01001_024E,B01001_025E,B01001_044E,B01001_045E,B01001_046E,B01001_047E,B01001_048E,B01001_049E',
  housingUnits: 'B25001_001E'          // Total Housing Units
};

async function fetchDemographics() {
  try {
    console.log('Fetching demographic data from US Census Bureau API...');

    // Build the query for all variables
    const vars = [
      VARIABLES.population,
      VARIABLES.medianIncome,
      VARIABLES.housingUnits
    ].join(',');

    const url = `${CENSUS_API_BASE}?get=NAME,${vars}&for=county:*&in=state:${ARIZONA_FIPS}`;

    console.log('Fetching from Census API...');
    console.log('Note: If this fails, you may need a Census API key. Get one free at: https://api.census.gov/data/key_signup.html');

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // First row is headers, rest are data
    const headers = data[0];
    const rows = data.slice(1);

    console.log(`Received data for ${rows.length} counties`);

    // Transform to our format
    const demographics = rows.map(row => {
      const countyName = row[0].replace(' County, Arizona', '');
      const population = parseInt(row[1]) || 0;
      const medianIncome = parseInt(row[2]) || 0;
      const housingUnits = parseInt(row[3]) || 0;
      const stateFips = row[4];
      const countyFips = row[5];
      const fips = `${stateFips}${countyFips}`;

      // For now, use estimated age distribution percentages
      // In a real scenario, you'd fetch these from additional API calls
      const ageDistribution = {
        under18: Math.round(population * 0.23),
        age18to64: Math.round(population * 0.59),
        age65Plus: Math.round(population * 0.18)
      };

      return {
        fips,
        name: countyName,
        population,
        medianIncome,
        ageDistribution,
        housingUnits,
        // Calculate density (you'd need area data for accurate calculation)
        areaSquareMiles: getCountyArea(countyName),
        populationDensity: population / getCountyArea(countyName)
      };
    });

    // Ensure the data directory exists
    const dataDir = path.join(__dirname, '..', 'src', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write the demographics file
    const outputPath = path.join(dataDir, 'demographics.json');
    fs.writeFileSync(outputPath, JSON.stringify(demographics, null, 2));

    console.log(`✓ Demographics data saved to: ${outputPath}`);
    console.log(`  Counties included:`);
    demographics.forEach(d => {
      console.log(`    ${d.name}: Pop ${d.population.toLocaleString()}, Income $${d.medianIncome.toLocaleString()}`);
    });

  } catch (error) {
    console.error('Error fetching demographics:', error);
    console.log('\nFalling back to sample data...');
    createSampleData();
  }
}

function createSampleData() {
  const sampleDemographics = [
    { fips: '04013', name: 'Maricopa', population: 4485414, medianIncome: 69872, areaSquareMiles: 9224, housingUnits: 1842753 },
    { fips: '04019', name: 'Pima', population: 1043433, medianIncome: 56581, areaSquareMiles: 9189, housingUnits: 482814 },
    { fips: '04021', name: 'Pinal', population: 462891, medianIncome: 58883, areaSquareMiles: 5374, housingUnits: 196831 },
    { fips: '04025', name: 'Yavapai', population: 236840, medianIncome: 56420, areaSquareMiles: 8128, housingUnits: 120387 },
    { fips: '04015', name: 'Mohave', population: 215686, medianIncome: 51346, areaSquareMiles: 13470, housingUnits: 128754 },
    { fips: '04005', name: 'Coconino', population: 145101, medianIncome: 61729, areaSquareMiles: 18661, housingUnits: 67843 },
    { fips: '04003', name: 'Cochise', population: 125447, medianIncome: 54967, areaSquareMiles: 6166, housingUnits: 58721 },
    { fips: '04017', name: 'Navajo', population: 106717, medianIncome: 47830, areaSquareMiles: 9959, housingUnits: 47362 },
    { fips: '04001', name: 'Apache', population: 66021, medianIncome: 39136, areaSquareMiles: 11218, housingUnits: 25419 },
    { fips: '04027', name: 'Yuma', population: 203247, medianIncome: 52183, areaSquareMiles: 5519, housingUnits: 85624 },
    { fips: '04007', name: 'Gila', population: 53968, medianIncome: 49645, areaSquareMiles: 4796, housingUnits: 28934 },
    { fips: '04023', name: 'Santa Cruz', population: 47659, medianIncome: 47310, areaSquareMiles: 1238, housingUnits: 18254 },
    { fips: '04012', name: 'La Paz', population: 16557, medianIncome: 45982, areaSquareMiles: 4500, housingUnits: 13872 },
    { fips: '04009', name: 'Graham', population: 38533, medianIncome: 48771, areaSquareMiles: 4641, housingUnits: 16283 },
    { fips: '04011', name: 'Greenlee', population: 9563, medianIncome: 63542, areaSquareMiles: 1851, housingUnits: 4387 }
  ].map(county => ({
    ...county,
    ageDistribution: {
      under18: Math.round(county.population * 0.23),
      age18to64: Math.round(county.population * 0.59),
      age65Plus: Math.round(county.population * 0.18)
    },
    populationDensity: Math.round(county.population / county.areaSquareMiles)
  }));

  const dataDir = path.join(__dirname, '..', 'src', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const outputPath = path.join(dataDir, 'demographics.json');
  fs.writeFileSync(outputPath, JSON.stringify(sampleDemographics, null, 2));
  console.log(`✓ Sample demographics data saved to: ${outputPath}`);
}

function getCountyArea(countyName) {
  const areas = {
    'Apache': 11218,
    'Cochise': 6166,
    'Coconino': 18661,
    'Gila': 4796,
    'Graham': 4641,
    'Greenlee': 1851,
    'La Paz': 4500,
    'Maricopa': 9224,
    'Mohave': 13470,
    'Navajo': 9959,
    'Pima': 9189,
    'Pinal': 5374,
    'Santa Cruz': 1238,
    'Yavapai': 8128,
    'Yuma': 5519
  };

  return areas[countyName] || 1000; // Default fallback
}

fetchDemographics();
