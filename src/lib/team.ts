import { supabaseAdmin, isSupabaseConfigured } from './supabase';
import { store } from './store';
import { TeamMember } from './types';

// Helper for guaranteed query timeout
async function withTimeout<T>(promise: PromiseLike<T>, ms = 2000): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Supabase query timed out')), ms);
  });
  return Promise.race([Promise.resolve(promise), timeoutPromise]).finally(() => clearTimeout(timer));
}

// Helper to determine division safely
function resolveDivision(row: { division?: string; department?: string; role?: string; name?: string }): string {
  if (row.division && row.division.trim() !== '') {
    return row.division.trim();
  }
  const text = `${row.department || ''} ${row.role || ''} ${row.name || ''}`.toLowerCase();
  if (text.includes('tanzan') || text.includes('mtwara') || text.includes('haulage') || text.includes('corridor')) {
    return 'Tanzanian Operation Team';
  }
  return 'Executive Leadership';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapSupabaseToTeamMember(row: any): TeamMember {
  return {
    id: row.id,
    name: row.name || '',
    role: row.role || '',
    division: resolveDivision(row),
    department: row.department || '',
    bio: row.bio || '',
    imageUrl: row.image_url || row.imageUrl || '',
    displayOrder: row.display_order ?? row.displayOrder ?? 0,
    isPublished: row.is_published ?? row.isPublished ?? true,
    email: row.email || '',
    phone: row.phone || row.whatsapp || '',
    whatsapp: row.whatsapp || row.phone || '',
    linkedinUrl: row.linkedin_url || row.linkedinUrl || '',
    quote: row.quote || '',
    createdAt: row.created_at || row.createdAt,
    updatedAt: row.updated_at || row.updatedAt,
  };
}

export function mapTeamMemberToSupabase(member: Partial<TeamMember>) {
  return {
    name: member.name,
    role: member.role,
    department: member.department ?? '',
    bio: member.bio ?? '',
    image_url: member.imageUrl ?? '',
    display_order: member.displayOrder ?? 0,
    is_published: member.isPublished ?? true,
    email: member.email ?? '',
    phone: member.whatsapp || member.phone || '',
    linkedin_url: member.linkedinUrl ?? '',
    quote: member.quote ?? '',
    updated_at: new Date().toISOString(),
  };
}

/**
 * Fetch team members with resilient Supabase table -> Supabase settings fallback -> Store fallback
 */
export async function getLiveTeamMembers(): Promise<TeamMember[]> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      // 1. Attempt reading from dedicated 'team_members' table with a 2-second timeout
      const res = await withTimeout(
        supabaseAdmin
          .from('team_members')
          .select('*')
          .order('display_order', { ascending: true }),
        2000
      );

      if (!res.error && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(mapSupabaseToTeamMember);
      }
    } catch (e) {
      console.warn('[Supabase Team Table Fetch Timeout/Error, trying fallback]', e);
    }

    try {
      // 2. Fallback: check site_settings.settings_data.team_members with a 1.5-second timeout
      const res = await withTimeout(
        supabaseAdmin
          .from('site_settings')
          .select('settings_data')
          .eq('id', 'primary')
          .maybeSingle(),
        1500
      );

      if (
        res.data?.settings_data &&
        Array.isArray(res.data.settings_data.team_members) &&
        res.data.settings_data.team_members.length > 0
      ) {
        return (res.data.settings_data.team_members as TeamMember[])
          .map(mapSupabaseToTeamMember)
          .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
      }
    } catch {
      // ignore
    }
  }

  return store.getTeamMembers();
}

export async function getLivePublishedTeamMembers(): Promise<TeamMember[]> {
  const members = await getLiveTeamMembers();
  return members.filter((m) => m.isPublished);
}

/**
 * Persist team members to both Supabase sources and the store
 */
export async function saveLiveTeamMember(
  memberData: Partial<TeamMember> & { name: string }
): Promise<TeamMember> {
  // 1. Update in-memory store immediately
  const saved = store.saveTeamMember(memberData);

  if (isSupabaseConfigured && supabaseAdmin) {
    // 2. Try inserting/updating public.team_members table with safety timeout
    try {
      const dbRecord = mapTeamMemberToSupabase(saved);
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      if (saved.id && uuidRegex.test(saved.id)) {
        await withTimeout(
          supabaseAdmin.from('team_members').update(dbRecord).eq('id', saved.id),
          2500
        );
      } else {
        const res = await withTimeout(
          supabaseAdmin
            .from('team_members')
            .insert({
              ...dbRecord,
              created_at: new Date().toISOString(),
            })
            .select()
            .maybeSingle(),
          2500
        );

        if (res.data?.id) {
          saved.id = res.data.id;
        }
      }
    } catch (dbErr) {
      console.warn('[Supabase Table Save Warning]', dbErr);
    }

    // 3. Guarantee persistence in site_settings.settings_data.team_members
    try {
      const res = await withTimeout(
        supabaseAdmin
          .from('site_settings')
          .select('settings_data')
          .eq('id', 'primary')
          .maybeSingle(),
        2000
      );

      const existingData = res.data?.settings_data || {};
      const currentList: TeamMember[] = Array.isArray(existingData.team_members)
        ? existingData.team_members
        : [];

      const updatedList = currentList.map((m) => (m.id === saved.id ? saved : m));
      if (!updatedList.some((m) => m.id === saved.id)) {
        updatedList.push(saved);
      }

      await withTimeout(
        supabaseAdmin
          .from('site_settings')
          .update({
            settings_data: {
              ...existingData,
              team_members: updatedList,
            },
            updated_at: new Date().toISOString(),
          })
          .eq('id', 'primary'),
        2000
      );
    } catch (settingsErr) {
      console.warn('[Supabase Team Settings Save Error]', settingsErr);
    }
  }

  return saved;
}

export async function deleteLiveTeamMember(id: string): Promise<boolean> {
  const deleted = store.deleteTeamMember(id);

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await withTimeout(
        supabaseAdmin.from('team_members').delete().eq('id', id),
        2000
      );
    } catch {
      // ignore
    }

    try {
      const res = await withTimeout(
        supabaseAdmin
          .from('site_settings')
          .select('settings_data')
          .eq('id', 'primary')
          .maybeSingle(),
        2000
      );

      if (res.data?.settings_data) {
        const currentList = Array.isArray(res.data.settings_data.team_members)
          ? res.data.settings_data.team_members.filter((m: { id: string }) => m.id !== id)
          : [];

        await withTimeout(
          supabaseAdmin
            .from('site_settings')
            .update({
              settings_data: {
                ...res.data.settings_data,
                team_members: currentList,
              },
              updated_at: new Date().toISOString(),
            })
            .eq('id', 'primary'),
          2000
        );
      }
    } catch {
      // ignore
    }
  }

  return deleted;
}
