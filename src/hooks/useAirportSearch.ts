// src/hooks/useAirportSearch.ts
import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { searchAirports, AirportData } from '@/lib/duffel';

interface UseAirportSearchProps {
  searchTerm: string;
  enabled?: boolean;
}

export function useAirportSearch({
  searchTerm,
  enabled = true,
}: UseAirportSearchProps) {
  const [airports, setAirports] = useState<AirportData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (!enabled || !debouncedSearchTerm || debouncedSearchTerm.length < 2) {
      setAirports([]);
      return;
    }

    const fetchAirports = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const results = await searchAirports(debouncedSearchTerm);
        setAirports(results);
      } catch (err) {
        console.error('Error fetching airports:', err);
        setError(
          err instanceof Error ? err : new Error('Failed to fetch airports')
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAirports();
  }, [debouncedSearchTerm, enabled]);

  return { airports, isLoading, error };
}
