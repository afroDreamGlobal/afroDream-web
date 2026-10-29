import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { getLiveServices, mapSupabaseToService } from '@/lib/services';
import { verifyAdminRequest } from '@/lib/adminAuth';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET() {
  const services = await getLiveServices();
  return NextResponse.json({ success: true, data: services });
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
    if (!json.title) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }

    const saved = store.saveService(json);

    // Persist to Supabase if configured
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const slug =
            json.slug ||
            json.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)+/g, '');

        const dbRecord = {
          slug,
          title: json.title,
          short_description: json.shortDescription ?? saved.shortDescription ?? '',
          full_description: json.fullDescription ?? saved.fullDescription ?? '',
          image_url: json.imageUrl ?? saved.imageUrl ?? '',
          icon_name: json.iconName ?? saved.iconName ?? 'Ship',
          category: json.category ?? saved.category ?? 'Shipping Service',
          display_order: json.displayOrder ?? saved.displayOrder ?? 0,
          is_published: json.isPublished ?? saved.isPublished ?? true,
          features: json.features ?? saved.features ?? [],
          route_highlight: json.routeHighlight ?? saved.routeHighlight ?? '',
          updated_at: new Date().toISOString(),
        };

        let dbResult = null;

        if (json.id && UUID_REGEX.test(json.id)) {
          const { data, error } = await supabaseAdmin
            .from('services')
            .update(dbRecord)
            .eq('id', json.id)
            .select()
            .maybeSingle();

          if (!error && data) {
            dbResult = data;
          }
        }

        if (!dbResult) {
          // Check by slug
          const { data: existing } = await supabaseAdmin
            .from('services')
            .select('id')
            .eq('slug', slug)
            .maybeSingle();

          if (existing?.id) {
            const { data } = await supabaseAdmin
              .from('services')
              .update(dbRecord)
              .eq('id', existing.id)
              .select()
              .maybeSingle();
            dbResult = data;
          } else {
            const { data, error } = await supabaseAdmin
              .from('services')
              .insert({
                ...dbRecord,
                created_at: new Date().toISOString(),
              })
              .select()
              .maybeSingle();
            if (!error && data) {
              dbResult = data;
            }
          }
        }

        if (dbResult) {
          return NextResponse.json({ success: true, data: mapSupabaseToService(dbResult) });
        }
      } catch (dbErr) {
        console.error('[Supabase Service Save Error]', dbErr);
      }
    }

    return NextResponse.json({ success: true, data: saved });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error saving service';
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
      return NextResponse.json({ success: false, error: 'Missing service id' }, { status: 400 });
    }

    const deleted = store.deleteService(id);

    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        if (UUID_REGEX.test(id)) {
          await supabaseAdmin.from('services').delete().eq('id', id);
        } else {
          await supabaseAdmin.from('services').delete().or(`id.eq.${id},slug.eq.${id}`);
        }
      } catch (dbErr) {
        console.error('[Supabase Service Delete Error]', dbErr);
      }
    }

    return NextResponse.json({ success: true, deleted });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error deleting service';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
