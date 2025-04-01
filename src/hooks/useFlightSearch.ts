/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useFlightSearch.ts
import { useState } from 'react';
import { searchFlights, SearchParams } from '@/lib/duffel';
import { FlightSearchResults } from '@/types/flight';

export function useFlightSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchResults, setSearchResults] = useState<any>(null);

  // Type assertion to tell TypeScript that the SearchResults can be used as FlightSearchResults
  const search = async (
    params: SearchParams
  ): Promise<FlightSearchResults | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const results = await searchFlights(params);
      setSearchResults(results);
      return results as unknown as FlightSearchResults;
    } catch (err) {
      console.error('Error searching flights:', err);
      setError(
        err instanceof Error ? err : new Error('Failed to search flights')
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { search, isLoading, error, searchResults };
}
