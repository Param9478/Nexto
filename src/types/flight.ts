/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/flight.ts
import {
  SearchResponse,
  SearchParams,
  Offer as DuffelOffer,
} from '@/app/types/duffel';

export interface Airport {
  code: string;
  name: string;
}

// Use the existing SearchParams from duffel.ts
export type FlightSearchParams = SearchParams;

// Create a type alias to tell TypeScript that SearchResults is compatible with FlightSearchResults
export type FlightSearchResults = SearchResponse;

export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first';

export interface FormValues {
  origin: Airport;
  destination: Airport;
  departureDate: string;
  returnDate?: string;
  passengerCount: number;
  cabinClass: CabinClass;
  tripType: 'oneway' | 'roundtrip';
}

// Flight segment with unified property names
export interface FlightSegment {
  id: string;
  departure_datetime: string;
  arrival_datetime: string;
  departing_at: string; // Added for compatibility with FlightCard component
  arriving_at: string; // Added for compatibility with FlightCard component
  origin: {
    name: string;
    iata_code: string;
    city?: string;
  };
  destination: {
    name: string;
    iata_code: string;
    city?: string;
  };
  marketing_carrier: {
    name: string;
    iata_code: string;
  };
  airline?: {
    // Added for compatibility with FlightList component
    name: string;
    iata_code: string;
  };
  carrier?: {
    // Added for compatibility with other components
    name: string;
    iata_code: string;
  };
  flight_number?: string;
  aircraft?: {
    name?: string;
  };
  duration?: string;
}

// Flight slice with unified property names
export interface FlightSlice {
  id: string;
  segments: FlightSegment[];
  duration?: string;
  origin?: {
    iata_code?: string;
    name?: string;
    city?: string;
  };
  destination?: {
    iata_code?: string;
    name?: string;
    city?: string;
  };
  departure_date?: string;
  departure_time?: string;
  arrival_time?: string;
  arrival_date?: string;
}

// Define a unified Offer type that combines all required properties
export interface Offer {
  id: string;
  slices: FlightSlice[];
  total_amount: string;
  total_currency: string;
  passenger_count?: number;
  passengers?: any[]; // Optional to make types compatible
  airline?: {
    name: string;
    iata_code: string;
  };
}

// Make FlightOffer and Offer interchangeable
export type FlightOffer = Offer;

export interface FlightCardProps {
  offer: Offer;
  onSelect: (offer: Offer) => void;
}

// Utility functions
export function isISODateOnly(dateString: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

export function parseFlexibleDate(dateString: string | undefined): Date | null {
  if (!dateString) return null;

  try {
    // Handle date-only strings to avoid timezone issues
    if (isISODateOnly(dateString)) {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day, 12, 0, 0);
    }

    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

// Adapter function to convert Duffel response to our format
export function adaptDuffelOffer(duffelOffer: DuffelOffer): Offer {
  return {
    ...duffelOffer,
    slices: duffelOffer.slices.map((slice) => ({
      id: slice.id, // Ensure it has an ID
      segments: slice.segments.map((segment) => ({
        id: segment.id,
        departure_datetime: segment.departure_time,
        arrival_datetime: segment.arrival_time,
        departing_at: segment.departure_time, // Ensure these match the expected type
        arriving_at: segment.arrival_time,
        origin: {
          name: segment.origin?.name || '',
          iata_code: segment.origin?.iata_code || '',
          city: segment.origin?.city || '',
        },
        destination: {
          name: segment.destination?.name || '',
          iata_code: segment.destination?.iata_code || '',
          city: segment.destination?.city || '',
        },
        marketing_carrier: {
          name:
            segment.carrier?.name || segment.airline?.name || 'Unknown Airline',
          iata_code:
            segment.carrier?.iata_code || segment.airline?.iata_code || '??',
        },
        airline: segment.airline || segment.carrier,
        carrier: segment.carrier || segment.airline,
        flight_number: segment.flight_number || '',
        aircraft: segment.aircraft
          ? { name: segment.aircraft.name }
          : undefined,
        duration: segment.duration || '',
      })) as FlightSegment[], // Ensure it is of type FlightSegment[]
      duration: slice.duration || '',
      origin: slice.origin
        ? {
            iata_code: slice.origin.iata_code || '',
            name: slice.origin.name || '',
            city: slice.origin.city || '',
          }
        : undefined,
      destination: slice.destination
        ? {
            iata_code: slice.destination.iata_code || '',
            name: slice.destination.name || '',
            city: slice.destination.city || '',
          }
        : undefined,
      departure_date: slice.departure_date || '',
      departure_time: slice.departure_time || '',
      arrival_time: slice.arrival_time || '',
      arrival_date: slice.arrival_date || '',
    })) as FlightSlice[], // Ensure it is of type FlightSlice[]
    passenger_count: duffelOffer.passenger_count || 1,
  };
}
