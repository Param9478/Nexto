// src/lib/duffel-client.ts
import { Duffel } from '@duffel/api';

// Initialize the Duffel client
export const duffelClient = new Duffel({
  token: process.env.NEXT_PUBLIC_DUFFEL_API_KEY || '',
});
