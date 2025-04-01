import { NextResponse } from 'next/server';
import { duffelClient } from '@/lib/duffel-client';

type Params = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, context: Params) {
  const offerId = context.params.id;

  if (!offerId) {
    return NextResponse.json(
      { error: 'Offer ID is required' },
      { status: 400 }
    );
  }

  try {
    console.log('Fetching offer with ID:', offerId);
    console.log('API Key present:', !!process.env.DUFFEL_API_KEY);

    const response = await duffelClient.offers.get(offerId);

    console.log('Successfully retrieved offer');

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching offer:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch offer',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
