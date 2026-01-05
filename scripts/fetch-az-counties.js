import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CENSUS_TIGER_URL = 'https://www2.census.gov/geo/tiger/GENZ2023/shp/cb_2023_04_county_500k.zip';

async function fetchArizonaCounties() {
  try {
    console.log('Fetching Arizona county boundaries from US Census TIGER/Line...');

    // Alternative: Use direct GeoJSON from Census Cartographic Boundary Files
    // For now, we'll use a simpler approach with a direct GeoJSON URL
    const geoJsonUrl = 'https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json';

    console.log('Fetching GeoJSON data...');
    const response = await fetch(geoJsonUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const allCounties = await response.json();

    // Filter for Arizona counties (FIPS codes starting with "04")
    const arizonaCounties = {
      type: 'FeatureCollection',
      features: allCounties.features.filter(feature => {
        const fips = feature.id || feature.properties?.GEO_ID || '';
        return fips.toString().startsWith('04');
      }).map(feature => ({
        ...feature,
        properties: {
          ...feature.properties,
          FIPS: feature.id,
          NAME: feature.properties.NAME || getCountyName(feature.id)
        }
      }))
    };

    console.log(`Found ${arizonaCounties.features.length} Arizona counties`);

    // Ensure the data directory exists
    const dataDir = path.join(__dirname, '..', 'src', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write the GeoJSON file
    const outputPath = path.join(dataDir, 'arizona-counties.json');
    fs.writeFileSync(outputPath, JSON.stringify(arizonaCounties, null, 2));

    console.log(`✓ Arizona counties GeoJSON saved to: ${outputPath}`);
    console.log(`  Counties included: ${arizonaCounties.features.map(f => f.properties.NAME).join(', ')}`);

  } catch (error) {
    console.error('Error fetching Arizona counties:', error);
    process.exit(1);
  }
}

// Helper function to map FIPS codes to county names
function getCountyName(fips) {
  const countyNames = {
    '04001': 'Apache',
    '04003': 'Cochise',
    '04005': 'Coconino',
    '04007': 'Gila',
    '04009': 'Graham',
    '04011': 'Greenlee',
    '04012': 'La Paz',
    '04013': 'Maricopa',
    '04015': 'Mohave',
    '04017': 'Navajo',
    '04019': 'Pima',
    '04021': 'Pinal',
    '04023': 'Santa Cruz',
    '04025': 'Yavapai',
    '04027': 'Yuma'
  };

  return countyNames[fips] || 'Unknown County';
}

fetchArizonaCounties();
