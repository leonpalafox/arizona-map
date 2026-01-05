'use client';

import { useMapStore } from '@/store/mapStore';
import { useDemographics } from '@/hooks/useDemographics';
import { DataOverlay } from '@/types/demographics';
import { getColorScale, COLOR_SCHEMES } from '@/utils/colorScale';
import { formatNumber, formatCurrency } from '@/utils/formatters';

const OVERLAY_LABELS: Record<DataOverlay, string> = {
  population: 'Population',
  income: 'Median Income',
  age: 'Senior Population (65+)',
  density: 'Population Density',
  election: '2024 Election'
};

export function Legend() {
  const { dataOverlay, setDataOverlay } = useMapStore();
  const { demographics } = useDemographics();

  if (demographics.length === 0) return null;

  const colorScale = getColorScale(dataOverlay, demographics);
  const colors = COLOR_SCHEMES[dataOverlay];
  const domain = colorScale.domain();
  const [min, max] = domain;

  // Calculate quartile values for better legend display
  const step = (max - min) / colors.length;
  const values = colors.map((_, i) => min + step * i);

  const formatValue = (value: number) => {
    if (dataOverlay === 'income') {
      return formatCurrency(value);
    } else if (dataOverlay === 'age') {
      return `${(value * 100).toFixed(0)}%`;
    } else if (dataOverlay === 'density') {
      return `${value.toFixed(0)}/mi²`;
    } else {
      return formatNumber(Math.round(value));
    }
  };

  return (
    <div className="absolute bottom-8 left-8 bg-white rounded-lg shadow-lg p-4 min-w-64">
      <h3 className="font-semibold text-gray-800 mb-3">Data Overlay</h3>

      {/* Overlay selector buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {(Object.keys(OVERLAY_LABELS) as DataOverlay[]).map((overlay) => (
          <button
            key={overlay}
            onClick={() => setDataOverlay(overlay)}
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
              dataOverlay === overlay
                ? overlay === 'election'
                  ? 'bg-purple-600 text-white'
                  : 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {OVERLAY_LABELS[overlay]}
          </button>
        ))}
      </div>

      {/* Color scale */}
      <div className="mb-2">
        <div className="flex h-4 rounded overflow-hidden">
          {colors.map((color, i) => (
            <div
              key={i}
              className="flex-1"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-600">
          <span>{formatValue(values[0])}</span>
          <span>{formatValue(max)}</span>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Click a county to lock selection
      </p>
    </div>
  );
}
