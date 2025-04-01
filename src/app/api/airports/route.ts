// src/app/api/airports/route.ts - Simplified version
import { NextRequest, NextResponse } from 'next/server';
import { duffelClient } from '@/lib/duffel-client';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  console.log('Airport search API called with query:', query);

  if (!query || query.length < 2) {
    return NextResponse.json({ data: [] });
  }

  try {
    console.log('Attempting to fetch airports from Duffel');

    // Use a simpler approach - just get a list of airports
    // Don't filter yet to see if we can successfully connect to the API
    const response = await duffelClient.airports.list({
      limit: 20000, // Get more airports to filter from
    });

    console.log(
      'Duffel API response successful. Got',
      response.data.length,
      'airports'
    );

    // If we got here, the API call worked
    // Now filter the results
    // In your airports API route
    const filteredAirports = response.data.filter((airport) => {
      const airportName = (airport.name || '').toLowerCase();
      const airportCode = (airport.iata_code || '').toLowerCase();
      const cityName = (airport.city_name || '').toLowerCase();
      const countryCode = (airport.iata_country_code || '').toLowerCase();
      const queryLower = query.toLowerCase();

      // More inclusive filtering
      return (
        airportName.includes(queryLower) ||
        airportCode.includes(queryLower) ||
        cityName.includes(queryLower) ||
        countryCode.includes(queryLower)
      );
    });

    console.log(
      `Found ${filteredAirports.length} airports matching "${query}"`
    );

    return NextResponse.json({ data: filteredAirports });
  } catch (error) {
    // Log the detailed error
    console.error('Error in Duffel API call:', error);

    // If it's an Error object, log more details
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    // Return a clear error response
    return NextResponse.json(
      {
        data: [],
        error: 'Error connecting to flight data provider',
      },
      { status: 500 }
    );
  }
}
