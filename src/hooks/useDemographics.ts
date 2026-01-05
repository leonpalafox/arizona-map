import { useState, useEffect } from 'react';
import { CountyDemographics } from '@/types/demographics';

export function useDemographics() {
  const [demographics, setDemographics] = useState<CountyDemographics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadDemographics() {
      try {
        setLoading(true);
        const response = await fetch('/data/demographics.json');

        if (!response.ok) {
          throw new Error(`Failed to load demographics: ${response.statusText}`);
        }

        const data = await response.json();
        setDemographics(data);
        setError(null);
      } catch (err) {
        console.error('Error loading demographics:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    loadDemographics();
  }, []);

  const getDemographicsByFips = (fips: string): CountyDemographics | undefined => {
    return demographics.find(d => d.fips === fips);
  };

  const getDemographicsByName = (name: string): CountyDemographics | undefined => {
    return demographics.find(d => d.name.toLowerCase() === name.toLowerCase());
  };

  return {
    demographics,
    loading,
    error,
    getDemographicsByFips,
    getDemographicsByName
  };
}
