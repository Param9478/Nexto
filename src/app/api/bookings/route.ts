// src/app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { duffelClient } from '@/lib/duffel-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { selectedOfferId, passengers, amount, currency } = body;

    if (!selectedOfferId) {
      return NextResponse.json(
        { error: 'Selected offer ID is required' },
        { status: 400 }
      );
    }

    console.log('Creating booking for offer:', selectedOfferId);
    console.log('API Key present:', !!process.env.DUFFEL_API_KEY);

    try {
      const response = await duffelClient.orders.create({
        type: 'instant',
        selected_offers: [selectedOfferId],
        passengers,
        payments: [
          {
            type: 'balance',
            amount,
            currency,
          },
        ],
      });

      console.log('Booking created successfully');

      return NextResponse.json(response);
    } catch (duffelError) {
      console.error('Duffel client error:', duffelError);

      if (duffelError instanceof Error) {
        console.error('Error message:', duffelError.message);
        console.error('Error stack:', duffelError.stack);
      }

      return NextResponse.json(
        {
          error: 'Failed to create booking',
          details:
            duffelError instanceof Error
              ? duffelError.message
              : 'Unknown error',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in bookings API route:', error);

    return NextResponse.json(
      {
        error: 'Failed to process booking request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
