// src/app/api/flights/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { duffelClient } from '@/lib/duffel-client';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();

    // Extract search parameters
    const { slices, passengers, cabinClass } = body;

    console.log('Flight search request:', JSON.stringify(body, null, 2));
    console.log('API Key present:', !!process.env.DUFFEL_API_KEY);

    try {
      // Format the request according to the documentation
      const response = await duffelClient.offerRequests.create({
        slices,
        passengers: Array(passengers).fill({ type: 'adult' }),
        cabin_class: cabinClass,
        return_offers: true,
      });

      console.log('Offer request created successfully');
      console.log(`Found ${response.data?.offers?.length || 0} offers`);

      return NextResponse.json(response);
    } catch (duffelError) {
      console.error('Duffel client error:', duffelError);

      // Try to extract more detailed error information
      if (duffelError instanceof Error) {
        console.error('Error message:', duffelError.message);
        console.error('Error stack:', duffelError.stack);
      } else {
        console.error('Unknown error type:', typeof duffelError);
      }

      return NextResponse.json(
        {
          error: 'Failed to search flights',
          details:
            duffelError instanceof Error
              ? duffelError.message
              : 'Unknown error',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in flights search API route:', error);

    return NextResponse.json(
      {
        error: 'Failed to process flight search request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
