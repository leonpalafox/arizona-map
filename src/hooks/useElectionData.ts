import { useState, useEffect } from 'react';
import { CountyElectionResults } from '@/types/election';

export function useElectionData() {
  const [electionData, setElectionData] = useState<CountyElectionResults[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadElectionData() {
      try {
        setLoading(true);
        const response = await fetch('/data/election-results-2024.json');

        if (!response.ok) {
          throw new Error(`Failed to load election data: ${response.statusText}`);
        }

        const data = await response.json();
        setElectionData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading election data:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    loadElectionData();
  }, []);

  const getElectionByFips = (fips: string): CountyElectionResults | undefined => {
    return electionData.find(d => d.fips === fips);
  };

  return {
    electionData,
    loading,
    error,
    getElectionByFips
  };
}
