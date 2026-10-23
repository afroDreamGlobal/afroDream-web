import { supabaseAdmin, isSupabaseConfigured } from './supabase';
import { store } from './store';
import { Service } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapSupabaseToService(row: any): Service {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description || '',
    fullDescription: row.full_description || '',
    imageUrl: row.image_url || '',
    iconName: row.icon_name || 'Ship',
    category: row.category || 'Shipping Service',
    displayOrder: row.display_order ?? 0,
    isPublished: row.is_published ?? true,
    features: Array.isArray(row.features) ? row.features : [],
    routeHighlight: row.route_highlight || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getLiveServices(): Promise<Service[]> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(mapSupabaseToService);
      }
    } catch (err) {
      console.warn('[Supabase Services Fetch Error, falling back to store]', err);
    }
  }
  return store.getServices();
}

export async function getLivePublishedServices(): Promise<Service[]> {
  const services = await getLiveServices();
  return services.filter((s) => s.isPublished);
}

export async function getLiveServiceBySlug(slug: string): Promise<Service | undefined> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('services')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        return mapSupabaseToService(data);
      }
    } catch (err) {
      console.warn('[Supabase Service Slug Fetch Error]', err);
    }
  }
  return store.getServiceBySlug(slug);
}
