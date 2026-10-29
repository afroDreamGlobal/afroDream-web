import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { Shipment } from '@/lib/types';
import { verifyAdminRequest } from '@/lib/adminAuth';

export async function GET(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Administrator session required.' },
      { status: 401 }
    );
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data: shipmentsData, error } = await supabaseAdmin
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && shipmentsData && shipmentsData.length > 0) {
        // Fetch all events for these shipments
        const shipmentIds = shipmentsData.map((s) => s.id);
        const { data: eventsData } = await supabaseAdmin
          .from('tracking_events')
          .select('*')
          .in('shipment_id', shipmentIds)
          .order('event_time', { ascending: true });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: Shipment[] = shipmentsData.map((s: any) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const events = (eventsData || [])
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((ev: any) => ev.shipment_id === s.id)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((ev: any) => ({
              id: ev.id,
              shipmentId: ev.shipment_id,
              status: ev.status,
              statusLabel: ev.status_label,
              location: ev.location,
              description: ev.description,
              timestamp: ev.event_time,
            }));

          return {
            id: s.id,
            trackingNumber: s.tracking_number,
            bookingReference: s.booking_reference,
            customerName: s.customer_name,
            origin: s.origin,
            destination: s.destination,
            serviceType: s.service_type,
            cargoDescription: s.cargo_description,
            status: s.status,
            vesselName: s.vessel_name,
            voyageNumber: s.voyage_number,
            estimatedDeparture: s.estimated_departure,
            estimatedArrival: s.estimated_arrival,
            events,
            createdAt: s.created_at,
            updatedAt: s.updated_at,
          };
        });

        return NextResponse.json({ success: true, data: mapped });
      }
    } catch (err) {
      console.warn('[Supabase Admin Shipments Fetch Error]', err);
    }
  }

  const shipments = store.getShipments();
  return NextResponse.json({ success: true, data: shipments });
}

export async function POST(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Administrator session required.' },
      { status: 401 }
    );
  }

  try {
    const json = await request.json();
    if (!json.trackingNumber) {
      return NextResponse.json(
        { success: false, error: 'Tracking number is required' },
        { status: 400 }
      );
    }

    const saved = store.saveShipment(json);

    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const dbRecord = {
          tracking_number: json.trackingNumber.toUpperCase(),
          booking_reference: json.bookingReference || `BK-${Date.now()}`,
          customer_name: json.customerName || 'Customer',
          origin: json.origin || 'Mtwara, Tanzania',
          destination: json.destination || 'Tuticorin, India',
          service_type: json.serviceType || 'Container Shipment',
          cargo_description: json.cargoDescription || 'Raw Cashew Nuts',
          status: json.status || 'registered',
          vessel_name: json.vesselName || null,
          voyage_number: json.voyageNumber || null,
          estimated_departure: json.estimatedDeparture || null,
          estimated_arrival: json.estimatedArrival || null,
          updated_at: new Date().toISOString(),
        };

        const { data: existing } = await supabaseAdmin
          .from('shipments')
          .select('id')
          .eq('tracking_number', dbRecord.tracking_number)
          .maybeSingle();

        let shipmentId = existing?.id;

        if (existing?.id) {
          await supabaseAdmin.from('shipments').update(dbRecord).eq('id', existing.id);
        } else {
          const { data: inserted } = await supabaseAdmin
            .from('shipments')
            .insert({ ...dbRecord, created_at: new Date().toISOString() })
            .select()
            .maybeSingle();
          shipmentId = inserted?.id;
        }

        // If there's an event to add or update
        if (shipmentId && json.events && Array.isArray(json.events) && json.events.length > 0) {
          const lastEvent = json.events[json.events.length - 1];
          if (lastEvent) {
            await supabaseAdmin.from('tracking_events').insert({
              shipment_id: shipmentId,
              status: lastEvent.status || dbRecord.status,
              status_label: lastEvent.statusLabel || 'Status Update',
              location: lastEvent.location || dbRecord.origin,
              description: lastEvent.description || 'Status update logged.',
              event_time: lastEvent.timestamp || new Date().toISOString(),
            });
          }
        }
      } catch (dbErr) {
        console.error('[Supabase Shipment Save Error]', dbErr);
      }
    }

    return NextResponse.json({ success: true, data: saved });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error saving shipment';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
