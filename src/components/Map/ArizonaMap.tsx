'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { CountiesGeoJSON, County } from '@/types/demographics';
import { useMapStore } from '@/store/mapStore';
import { useDemographics } from '@/hooks/useDemographics';
import { useElectionData } from '@/hooks/useElectionData';
import { getColorScale, getColorForCounty, getElectionColor } from '@/utils/colorScale';

interface ArizonaMapProps {
  mapboxToken: string;
}

export function ArizonaMap({ mapboxToken }: ArizonaMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const hoveredStateIdRef = useRef<string | number | undefined>();

  const { setSelectedCounty, setHoveredCounty, dataOverlay } = useMapStore();
  const { demographics, loading, getDemographicsByFips } = useDemographics();
  const { electionData, getElectionByFips } = useElectionData();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-111.6602, 34.2744], // Center of Arizona
      zoom: 6,
      maxBounds: [
        [-115.0, 31.0], // Southwest coordinates
        [-108.0, 38.0]  // Northeast coordinates
      ]
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapboxToken]);

  // Load and display counties
  useEffect(() => {
    if (!map.current || !mapLoaded || loading) return;

    async function loadCounties() {
      try {
        const response = await fetch('/data/arizona-counties.json');
        const geojson: CountiesGeoJSON = await response.json();

        // Add demographics to each county feature
        const enrichedGeoJson = {
          ...geojson,
          features: geojson.features.map(feature => ({
            ...feature,
            properties: {
              ...feature.properties,
              demographics: getDemographicsByFips(feature.properties.FIPS || '')
            }
          }))
        };

        if (map.current?.getSource('counties')) {
          (map.current.getSource('counties') as mapboxgl.GeoJSONSource).setData(enrichedGeoJson);
        } else {
          map.current?.addSource('counties', {
            type: 'geojson',
            data: enrichedGeoJson,
            promoteId: 'FIPS'
          });

          // Add fill layer
          map.current?.addLayer({
            id: 'counties-fill',
            type: 'fill',
            source: 'counties',
            paint: {
              'fill-color': '#627BC1',
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                0.7,
                0.5
              ]
            }
          });

          // Add border layer
          map.current?.addLayer({
            id: 'counties-border',
            type: 'line',
            source: 'counties',
            paint: {
              'line-color': '#627BC1',
              'line-width': 2
            }
          });
        }
      } catch (error) {
        console.error('Error loading counties:', error);
      }
    }

    loadCounties();
  }, [mapLoaded, loading, getDemographicsByFips]);

  // Update colors based on data overlay
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Check if the layer exists before trying to update it
    const layer = map.current.getLayer('counties-fill');
    if (!layer) return;

    if (dataOverlay === 'election') {
      // Election coloring
      if (electionData.length === 0) return;

      map.current.setPaintProperty('counties-fill', 'fill-color', [
        'case',
        ['has', 'FIPS'],
        ['get', ['get', 'FIPS'], ['literal', Object.fromEntries(
          electionData.map(d => [d.fips, getElectionColor(d)])
        )]],
        '#ccc'
      ]);
    } else {
      // Demographic coloring
      if (demographics.length === 0) return;

      const colorScale = getColorScale(dataOverlay, demographics);

      map.current.setPaintProperty('counties-fill', 'fill-color', [
        'case',
        ['has', 'FIPS'],
        ['get', ['get', 'FIPS'], ['literal', Object.fromEntries(
          demographics.map(d => [d.fips, getColorForCounty(d, dataOverlay, colorScale)])
        )]],
        '#ccc'
      ]);
    }
  }, [dataOverlay, demographics, electionData, mapLoaded]);

  // Handle mouse events
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const onMouseMove = (e: mapboxgl.MapLayerMouseEvent) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0] as unknown as County;
        const fips = feature.properties.FIPS;

        if (!fips) return;

        // Clear previous hover state if different county
        if (hoveredStateIdRef.current !== undefined && hoveredStateIdRef.current !== fips) {
          map.current?.setFeatureState(
            { source: 'counties', id: hoveredStateIdRef.current },
            { hover: false }
          );
        }

        // Set new hover state
        hoveredStateIdRef.current = fips;
        map.current?.setFeatureState(
          { source: 'counties', id: hoveredStateIdRef.current },
          { hover: true }
        );

        // Enrich feature with demographics
        const enrichedFeature: County = {
          ...feature,
          properties: {
            ...feature.properties,
            demographics: getDemographicsByFips(fips)
          }
        };

        setHoveredCounty(enrichedFeature);
        if (map.current) {
          map.current.getCanvas().style.cursor = 'pointer';
        }
      }
    };

    const onMouseLeave = () => {
      if (hoveredStateIdRef.current !== undefined) {
        map.current?.setFeatureState(
          { source: 'counties', id: hoveredStateIdRef.current },
          { hover: false }
        );
      }
      hoveredStateIdRef.current = undefined;
      setHoveredCounty(null);
      if (map.current) {
        map.current.getCanvas().style.cursor = '';
      }
    };

    const onClick = (e: mapboxgl.MapLayerMouseEvent) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0] as unknown as County;

        // Enrich feature with demographics
        const enrichedFeature: County = {
          ...feature,
          properties: {
            ...feature.properties,
            demographics: getDemographicsByFips(feature.properties.FIPS || '')
          }
        };

        setSelectedCounty(enrichedFeature);
      }
    };

    map.current.on('mousemove', 'counties-fill', onMouseMove);
    map.current.on('mouseleave', 'counties-fill', onMouseLeave);
    map.current.on('click', 'counties-fill', onClick);

    return () => {
      map.current?.off('mousemove', 'counties-fill', onMouseMove);
      map.current?.off('mouseleave', 'counties-fill', onMouseLeave);
      map.current?.off('click', 'counties-fill', onClick);
    };
  }, [mapLoaded, setHoveredCounty, setSelectedCounty, getDemographicsByFips]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="text-lg font-semibold">Loading map data...</div>
        </div>
      )}
    </div>
  );
}
