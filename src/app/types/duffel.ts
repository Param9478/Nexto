export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengerCount: number;
}

export interface OfferSegment {
  id: string;
  aircraft: {
    name: string;
  };
  origin: {
    iata_code: string;
    city?: string;
    name?: string;
  };
  destination: {
    iata_code: string;
    city?: string;
    name?: string;
  };
  departure_time: string; // Original property
  arrival_time: string; // Original property
  departing_at?: string; // Added for compatibility
  arriving_at?: string; // Added for compatibility
  departure_datetime?: string; // Added for compatibility
  arrival_datetime?: string; // Added for compatibility
  duration: string;
  flight_number?: string;
  carrier: {
    name: string;
    iata_code: string;
  };
  airline?: {
    // Added for FlightList component compatibility
    name: string;
    iata_code: string;
  };
  marketing_carrier?: {
    // Added for FlightCard compatibility
    name: string;
    iata_code: string;
  };
}

export interface OfferSlice {
  id: string;
  origin: {
    iata_code: string;
    city?: string;
    name?: string;
  };
  destination: {
    iata_code: string;
    city?: string;
    name?: string;
  };
  departure_date: string;
  departure_time: string;
  arrival_date: string;
  arrival_time: string;
  duration: string;
  segments: OfferSegment[];
}

export interface Passenger {
  type: 'adult' | 'child' | 'infant_without_seat' | 'infant_with_seat';
}

export interface SearchRequest {
  data: {
    slices: OfferSlice[];
    passengers: Passenger[];
    cabin_class: 'economy' | 'premium_economy' | 'business' | 'first';
  };
}

export interface Offer {
  id: string;
  total_amount: string;
  total_currency: string;
  passenger_count: number;
  airline?: {
    name: string;
    iata_code: string;
  };
  passengers?: Passenger[]; // Optional array to make types compatible
  slices: OfferSlice[];
}

export interface SearchResponse {
  data: {
    offers: Offer[];
  };
}

export interface DuffelError {
  status: number;
  message: string;
  title?: string;
}

export interface Airport {
  id: string;
  name: string;
  iata_code: string;
  icao_code: string;
  city: {
    name: string;
  };
  country: {
    name: string;
    code: string;
  };
}

export interface AirportResponse {
  data: {
    airports: Airport[];
  };
}
