import { create } from 'zustand';
import { County, DataOverlay } from '@/types/demographics';

interface MapState {
  selectedCounty: County | null;
  hoveredCounty: County | null;
  dataOverlay: DataOverlay;
  setSelectedCounty: (county: County | null) => void;
  setHoveredCounty: (county: County | null) => void;
  setDataOverlay: (overlay: DataOverlay) => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedCounty: null,
  hoveredCounty: null,
  dataOverlay: 'population',
  setSelectedCounty: (county) => set({ selectedCounty: county }),
  setHoveredCounty: (county) => set({ hoveredCounty: county }),
  setDataOverlay: (overlay) => set({ dataOverlay: overlay }),
}));
