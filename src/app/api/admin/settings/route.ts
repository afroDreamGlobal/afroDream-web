import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

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
          return NextResponse.json({ success: true, data: data.settings_data });
        }
      } catch (err) {
        console.warn('[Supabase Settings Fetch Fallback]', err);
      }
    }

    const settings = store.getSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error loading settings';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const updated = store.updateSettings(json);

    // If Supabase is configured, persist to database
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        await supabaseAdmin.from('site_settings').upsert({
          id: 'primary',
          settings_data: json,
          updated_at: new Date().toISOString(),
        });
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
