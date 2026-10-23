import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { Shipment } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || q.trim().length < 3) {
    return NextResponse.json(
      { success: false, error: 'Please provide a valid tracking number or booking reference.' },
      { status: 400 }
    );
  }

  const cleaned = q.trim().toUpperCase();

  // Try Supabase first
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data: shipmentData, error } = await supabaseAdmin
        .from('shipments')
        .select('*')
        .or(`tracking_number.ilike.${cleaned},booking_reference.ilike.${cleaned}`)
        .maybeSingle();

      if (!error && shipmentData) {
        // Fetch events
        const { data: eventsData } = await supabaseAdmin
          .from('tracking_events')
          .select('*')
          .eq('shipment_id', shipmentData.id)
          .order('event_time', { ascending: true });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const events = (eventsData || []).map((ev: any) => ({
          id: ev.id,
          shipmentId: ev.shipment_id,
          status: ev.status,
          statusLabel: ev.status_label,
          location: ev.location,
          description: ev.description,
          timestamp: ev.event_time,
        }));

        return NextResponse.json({
          success: true,
          data: {
            trackingNumber: shipmentData.tracking_number,
            bookingReference: shipmentData.booking_reference,
            serviceType: shipmentData.service_type,
            origin: shipmentData.origin,
            destination: shipmentData.destination,
            status: shipmentData.status,
            vesselName: shipmentData.vessel_name,
            voyageNumber: shipmentData.voyage_number,
            estimatedDeparture: shipmentData.estimated_departure,
            estimatedArrival: shipmentData.estimated_arrival,
            events,
            cargoDescription: shipmentData.cargo_description,
            updatedAt: shipmentData.updated_at,
          },
        });
      }
    } catch (err) {
      console.warn('[Supabase Tracking Lookup Error]', err);
    }
  }

  const shipment: Shipment | null = store.lookupShipment(cleaned);

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
