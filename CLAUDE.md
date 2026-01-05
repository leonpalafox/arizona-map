# CLAUDE.md

## Project: Arizona Demographics Map (Web App)
A web application that renders an interactive map of Arizona divided by county, displaying demographic data (population, income, age distribution) via tooltips and a side panel.

## Build & Run Commands
- **Install Dependencies:** `npm install`
- **Development Server:** `npm run dev` (Runs on `http://localhost:3000`)
- **Build for Production:** `npm run build`
- **Lint:** `npm run lint`
- **Test:** `npm test`
- **Update GeoJSON Data:** `node scripts/fetch-az-counties.js`

## Tech Stack
- **Framework:** React + Vite (TypeScript)
- **Map Library:** Mapbox GL JS (or Leaflet/react-leaflet if preferred)
- **State Management:** Zustand (for managing selected county & data overlay)
- **Styling:** Tailwind CSS
- **Data Source:** GeoJSON (local or fetched from US Census Bureau API)
- **Testing:** Vitest + React Testing Library

## Code Style & Guidelines
- **Functional Components:** Use React functional components with named exports.
- **Typing:** Strict TypeScript usage. Define interfaces for all data props (especially GeoJSON features).
- **File Structure:**
  - `/src/components`: UI components (Map, Sidebar, Legend).
  - `/src/hooks`: Custom hooks (useDemographics, useMapInteract).
  - `/src/data`: Static GeoJSON files and demographic constants.
  - `/src/utils`: Helper functions for data formatting and color scales.
- **Mapping Pattern:** - Keep map logic isolated in a `MapContainer` component.
  - Use layers for choropleth rendering; do not create thousands of markers.
  - Demographic data should be joined to GeoJSON properties by FIPS code or County Name.
- **Error Handling:** Gracefully handle missing demographic data for a county with fallback UI ("Data Unavailable").

## Critical Files
- `src/App.tsx`: Main entry point and layout.
- `src/components/Map/ArizonaMap.tsx`: Main map logic and event listeners (hover/click).
- `src/data/arizona-counties.json`: The source of truth for county boundaries.
- `src/types/demographics.ts`: Type definitions for API responses and component props.

## Workflow Tips
- **GeoJSON:** The `arizona-counties.json` file must contain a `FIPS` or `NAME` property to link with the demographic CSV/JSON data.
- **Color Scales:** Use `d3-scale` or similar to generate choropleth colors based on data ranges (e.g., population density).
