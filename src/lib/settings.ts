import { supabaseAdmin, isSupabaseConfigured } from './supabase';
import { store, INITIAL_SETTINGS } from './store';
import { SiteSettings } from './types';

export async function getLiveSettings(): Promise<SiteSettings> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('site_settings')
        .select('settings_data')
        .eq('id', 'primary')
        .maybeSingle();

      if (!error && data && data.settings_data) {
        return {
          ...INITIAL_SETTINGS,
          ...store.getSettings(),
          ...data.settings_data,
        };
      }
    } catch (err) {
      console.warn('[Supabase Settings Fetch Error, falling back to local store]:', err);
    }
  }

  return {
    ...INITIAL_SETTINGS,
    ...store.getSettings(),
  };
}
