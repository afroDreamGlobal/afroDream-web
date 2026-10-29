import { NextResponse } from 'next/server';
import { store, INITIAL_SETTINGS } from '@/lib/store';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { verifyAdminRequest } from '@/lib/adminAuth';

export async function GET() {
  try {
    // If Supabase is configured and has settings, fetch from Supabase
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin
          .from('site_settings')
          .select('settings_data')
          .eq('id', 'primary')
          .maybeSingle();

        if (data && data.settings_data) {
          return NextResponse.json({
            success: true,
            data: {
              ...INITIAL_SETTINGS,
              ...store.getSettings(),
              ...data.settings_data,
            },
          });
        }
      } catch (err) {
        console.warn('[Supabase Settings Fetch Fallback]', err);
      }
    }

    const settings = { ...INITIAL_SETTINGS, ...store.getSettings() };
    return NextResponse.json({ success: true, data: settings });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error loading settings';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
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
    const updated = store.updateSettings(json);

    // If Supabase is configured, persist to database with deep merge
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const { data: existing } = await supabaseAdmin
          .from('site_settings')
          .select('settings_data')
          .eq('id', 'primary')
          .maybeSingle();

        const mergedSettings = {
          ...INITIAL_SETTINGS,
          ...(existing?.settings_data || {}),
          ...json,
        };

        const { error: upsertError } = await supabaseAdmin.from('site_settings').upsert({
          id: 'primary',
          settings_data: mergedSettings,
          updated_at: new Date().toISOString(),
        });

        if (upsertError) {
          console.error('[Supabase Settings Upsert Error]', upsertError);
        }
      } catch (dbErr) {
        console.error('[Supabase Settings Save Error]', dbErr);
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error updating settings';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
