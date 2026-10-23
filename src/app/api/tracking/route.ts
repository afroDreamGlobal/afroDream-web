import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || q.trim().length < 3) {
    return NextResponse.json(
      { success: false, error: 'Please provide a valid tracking number or booking reference.' },
      { status: 400 }
    );
  }

  const shipment = store.lookupShipment(q);

  if (!shipment) {
    return NextResponse.json(
      {
        success: false,
        error:
          'No shipment found matching the provided reference. Please check your tracking number or contact operations.',
      },
      { status: 404 }
    );
  }

  // Return customer-safe payload (no sensitive internal notes)
  const safeData = {
    trackingNumber: shipment.trackingNumber,
    bookingReference: shipment.bookingReference,
    serviceType: shipment.serviceType,
    origin: shipment.origin,
    destination: shipment.destination,
    status: shipment.status,
    vesselName: shipment.vesselName,
    voyageNumber: shipment.voyageNumber,
    estimatedDeparture: shipment.estimatedDeparture,
    estimatedArrival: shipment.estimatedArrival,
    events: shipment.events,
    cargoDescription: shipment.cargoDescription,
    updatedAt: shipment.updatedAt,
  };

  return NextResponse.json({ success: true, data: safeData });
}
