import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { TradeRoute } from '@/lib/types';
import { verifyAdminRequest } from '@/lib/adminAuth';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSupabaseToRoute(row: any): TradeRoute {
  return {
    id: row.id,
    name: row.name,
    originRegion: row.origin_region,
    originCountry: row.origin_country,
    originPort: row.origin_port,
    destinationRegion: row.destination_region,
    destinationCountry: row.destination_country,
    destinationPort: row.destination_port,
    transitTime: row.transit_time,
    frequency: row.frequency,
    cargoTypes: Array.isArray(row.cargo_types) ? row.cargo_types : [],
    isActive: row.is_active ?? true,
    isFeatured: row.is_featured ?? false,
  };
}

export async function GET() {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('trade_routes')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, data: data.map(mapSupabaseToRoute) });
      }
    } catch (err) {
      console.warn('[Supabase Routes Fetch Error]', err);
    }
  }

  const routes = store.getTradeRoutes();
  return NextResponse.json({ success: true, data: routes });
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
    if (!json.name) {
      return NextResponse.json({ success: false, error: 'Route name is required' }, { status: 400 });
    }

    const saved = store.saveTradeRoute(json);

    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const dbRecord = {
          name: json.name,
          origin_region: json.originRegion || 'Africa',
          origin_country: json.originCountry || 'Tanzania',
          origin_port: json.originPort || 'Mtwara',
          destination_region: json.destinationRegion || 'Asia',
          destination_country: json.destinationCountry || 'India',
          destination_port: json.destinationPort || 'Tuticorin',
          transit_time: json.transitTime || '14 - 18 Days',
          frequency: json.frequency || 'Weekly',
          cargo_types: json.cargoTypes || ['Raw Cashew Nuts'],
          is_active: json.isActive ?? true,
          is_featured: json.isFeatured ?? false,
        };

        let dbResult = null;
        if (json.id && UUID_REGEX.test(json.id)) {
          const { data, error } = await supabaseAdmin
            .from('trade_routes')
            .update(dbRecord)
            .eq('id', json.id)
            .select()
            .maybeSingle();

          if (!error && data) dbResult = data;
        }

        if (!dbResult) {
          const { data: existing } = await supabaseAdmin
            .from('trade_routes')
            .select('id')
            .eq('name', json.name)
            .maybeSingle();

          if (existing?.id) {
            const { data } = await supabaseAdmin
              .from('trade_routes')
              .update(dbRecord)
              .eq('id', existing.id)
              .select()
              .maybeSingle();
            dbResult = data;
          } else {
            const { data } = await supabaseAdmin
              .from('trade_routes')
              .insert({ ...dbRecord, created_at: new Date().toISOString() })
              .select()
              .maybeSingle();
            dbResult = data;
          }
        }

        if (dbResult) {
          return NextResponse.json({ success: true, data: mapSupabaseToRoute(dbResult) });
        }
      } catch (dbErr) {
        console.error('[Supabase Route Save Error]', dbErr);
      }
    }

    return NextResponse.json({ success: true, data: saved });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error saving route';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Administrator session required.' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing route id' }, { status: 400 });
    }

    const deleted = store.deleteTradeRoute(id);

    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        if (UUID_REGEX.test(id)) {
          await supabaseAdmin.from('trade_routes').delete().eq('id', id);
        } else {
          await supabaseAdmin.from('trade_routes').delete().eq('id', id);
        }
      } catch (dbErr) {
        console.error('[Supabase Route Delete Error]', dbErr);
      }
    }

    return NextResponse.json({ success: true, deleted });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error deleting route';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
