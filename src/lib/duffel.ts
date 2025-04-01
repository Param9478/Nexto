/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/duffel.ts

/**
 * Flight search parameters interface
 */
export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengerCount: number;
  cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
}

/**
 * Airport data interface returned from the API
 */
export interface AirportData {
  country: any;
  id: string;
  iata_code: string;
  name: string;
  city_name?: string;
  iata_country_code?: string;
  city?: {
    name: string;
    id: string;
    iata_code: string;
    iata_country_code: string;
  };
  time_zone?: string;
  longitude?: number;
  latitude?: number;
  icao_code?: string;
}

/**
 * Flight offer slice interface
 */
export interface OfferSlice {
  id: string;
  origin: {
    iata_code: string;
    name: string;
  };
  destination: {
    iata_code: string;
    name: string;
  };
  departure_date: string;
  segments: OfferSegment[];
  duration?: string;
}

/**
 * Flight segment interface
 */
export interface OfferSegment {
  id: string;
  origin: {
    iata_code: string;
    name: string;
  };
  destination: {
    iata_code: string;
    name: string;
  };
  departure_datetime: string;
  arrival_datetime: string;
  airline: {
    name: string;
    iata_code: string;
  };
  flight_number: string;
  aircraft?: {
    name: string;
    iata_code?: string;
  };
  duration?: string;
}

/**
 * Flight offer interface
 */
export interface Offer {
  id: string;
  slices: OfferSlice[];
  total_amount: string;
  total_currency: string;
  passengers: any[];
  conditions?: {
    refund_before_departure?: {
      allowed: boolean;
      penalty_amount?: string;
      penalty_currency?: string;
    };
    change_before_departure?: {
      allowed: boolean;
      penalty_amount?: string;
      penalty_currency?: string;
    };
  };
}

/**
 * Flight search results interface
 */
export interface SearchResults {
  data: {
    id: string;
    offers: Offer[];
    slices: any[];
    passengers: any[];
  };
}

/**
 * Passenger information interface
 */
export interface Passenger {
  id?: string;
  given_name: string;
  family_name: string;
  gender: string;
  born_on: string;
  email: string;
  phone_number: string;
  title?: string;
  infant_passenger_id?: string;
}

/**
 * Search for airports matching the provided query
 * Uses the Next.js API route to avoid CORS issues
 */
export async function searchAirports(query: string): Promise<AirportData[]> {
  if (!query || query.length < 2) return [];

  try {
    console.log('Searching for airports with query:', query);

    const response = await fetch(
      `/api/airports?query=${encodeURIComponent(query)}`
    );

    console.log('API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error details:', errorData);
      throw new Error(
        `Failed to fetch airports: ${errorData.error || response.status}`
      );
    }

    const data = await response.json();
    console.log('Airports found:', data.data?.length || 0);
    return data.data || [];
  } catch (error) {
    console.error('Error searching airports:', error);
    return [];
  }
}
/**
 * Search for flights based on the provided parameters
 * Uses the Next.js API route to avoid CORS issues
 */
export async function searchFlights(
  params: SearchParams
): Promise<SearchResults> {
  try {
    // Create slices based on whether it's a one-way or round trip
    const slices = params.returnDate
      ? [
          {
            origin: params.origin,
            destination: params.destination,
            departure_date: params.departureDate,
          },
          {
            origin: params.destination,
            destination: params.origin,
            departure_date: params.returnDate,
          },
        ]
      : [
          {
            origin: params.origin,
            destination: params.destination,
            departure_date: params.departureDate,
          },
        ];

    // Send request to our API route
    const response = await fetch('/api/flights/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slices,
        passengers: params.passengerCount,
        cabinClass: params.cabinClass,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to search flights');
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
}

/**
 * Get a specific offer by ID
 * Uses the Next.js API route to avoid CORS issues
 */
export async function getOffer(offerId: string): Promise<{ data: Offer }> {
  try {
    const response = await fetch(`/api/offers/${offerId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch offer');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching offer:', error);
    throw error;
  }
}

/**
 * Create a booking for the selected offer
 * Uses the Next.js API route to avoid CORS issues
 */
export async function createBooking(
  offerId: string,
  passengers: Passenger[],
  amount: string,
  currency: string
): Promise<any> {
  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        selectedOfferId: offerId,
        passengers,
        amount,
        currency,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create booking');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

/**
 * Format a price for display
 */
export function formatPrice(amount: string, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(parseFloat(amount));
}

/**
 * Format duration string (e.g., PT3H25M) to readable format (3h 25m)
 */
export function formatDuration(durationString: string): string {
  if (!durationString) return '';

  // ISO 8601 duration format
  const matches = durationString.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);

  if (matches) {
    const hours = matches[1] ? parseInt(matches[1]) : 0;
    const minutes = matches[2] ? parseInt(matches[2]) : 0;

    if (hours > 0) {
      return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
    }
    return `${minutes}m`;
  }

  return durationString;
}

/**
 * Calculate and format the duration between two ISO date strings
 */
export function calculateDuration(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffInMinutes = Math.floor(
    (end.getTime() - start.getTime()) / (1000 * 60)
  );
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
  }
  return `${minutes}m`;
}

/**
 * Format a date for display (e.g., "Mon, 15 Jan")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Format time for display (e.g., "14:25")
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
