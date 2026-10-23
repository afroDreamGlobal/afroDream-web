import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  const shipments = store.getShipments();
  return NextResponse.json({ success: true, data: shipments });
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    if (!json.trackingNumber) {
      return NextResponse.json(
        { success: false, error: 'Tracking number is required' },
        { status: 400 }
      );
    }

    const saved = store.saveShipment(json);
    return NextResponse.json({ success: true, data: saved });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error saving shipment';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
