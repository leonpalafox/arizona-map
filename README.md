# Arizona Demographics Map

An interactive web application that displays Arizona counties with demographic data including population, median household income, age distribution, and population density.

## Features

- Interactive map of Arizona counties using Mapbox GL JS
- Real-time demographic data from US Census Bureau
- Multiple data overlays (Population, Income, Age Distribution, Density)
- Hover and click interactions for detailed county information
- Color-coded choropleth visualization
- Responsive sidebar with detailed statistics

## Tech Stack

- **Next.js 16** (App Router) with Turbopack
- **React 19** with TypeScript
- **Mapbox GL JS** for interactive mapping
- **Zustand** for state management
- **Tailwind CSS** for styling
- **D3 Scale** for color scales

## Getting Started

### Prerequisites

- Node.js (v22.7.0 or higher recommended)
- npm or yarn
- Mapbox access token (free tier available at [mapbox.com](https://account.mapbox.com/access-tokens/))

### Installation

1. Clone the repository:
   ```bash
   cd mapTucson
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Mapbox token:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
   ```

4. Fetch the data:
   ```bash
   npm run fetch-geojson
   npm run fetch-demographics
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The optimized production build will be created in the `.next` directory.

### Start Production Server

```bash
npm run start
```

## Available Scripts

- `npm run dev` - Start Next.js development server with Turbopack
- `npm run build` - Build optimized production bundle
- `npm run start` - Start production server
- `npm run lint` - Run Next.js ESLint
- `npm run fetch-geojson` - Fetch Arizona counties GeoJSON data
- `npm run fetch-demographics` - Fetch demographic data from Census API

## Data Sources

- **Geographic Boundaries**: US Census Bureau TIGER/Line Shapefiles
- **Demographics**: US Census Bureau American Community Survey (ACS) 5-Year Estimates

## Project Structure

```
mapTucson/
├── app/
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page (client component)
│   └── globals.css        # Global styles with Tailwind
├── src/
│   ├── components/
│   │   ├── Map/
│   │   │   └── ArizonaMap.tsx    # Mapbox map component
│   │   ├── Sidebar/
│   │   │   └── Sidebar.tsx       # County details panel
│   │   └── Legend/
│   │       └── Legend.tsx         # Data overlay controls
│   ├── hooks/
│   │   └── useDemographics.ts     # Custom hook for data loading
│   ├── store/
│   │   └── mapStore.ts            # Zustand state management
│   ├── types/
│   │   ├── demographics.ts        # TypeScript interfaces
│   │   └── census.ts
│   └── utils/
│       ├── colorScale.ts          # D3 color scale utilities
│       └── formatters.ts          # Data formatting functions
├── public/
│   └── data/
│       ├── arizona-counties.json  # GeoJSON county boundaries
│       └── demographics.json       # Census demographic data
├── scripts/
│   ├── fetch-az-counties.js
│   └── fetch-demographics.js
├── next.config.ts
├── tsconfig.json
├── tailwind.config.js
├── CLAUDE.md
└── README.md
```

## Usage

1. **View County Data**: Hover over any county to see a quick preview in the sidebar
2. **Lock Selection**: Click on a county to lock the selection and keep it displayed
3. **Change Data Overlay**: Use the legend buttons at the bottom-left to switch between different demographic visualizations
4. **Clear Selection**: Click the "Clear Selection" button in the sidebar to deselect

## Data Overlays

- **Population**: Total population by county
- **Median Income**: Median household income
- **Senior Population**: Percentage of population aged 65 and over
- **Population Density**: People per square mile

## License

This project is open source and available under the MIT License.

## Acknowledgments

- US Census Bureau for providing demographic data
- Mapbox for mapping infrastructure
- Arizona counties data from TIGER/Line Shapefiles
