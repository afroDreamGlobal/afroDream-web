import { supabaseAdmin, isSupabaseConfigured } from './supabase';
import { store, INITIAL_TEAM_MEMBERS } from './store';
import { TeamMember } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapSupabaseToTeamMember(row: any): TeamMember {
  return {
    id: row.id,
    name: row.name || '',
    role: row.role || '',
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
      // 1. Attempt reading from dedicated 'team_members' table
      const { data, error } = await supabaseAdmin
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(mapSupabaseToTeamMember);
      }
    } catch {
      // ignore and try settings fallback
    }

    try {
      // 2. Fallback: check site_settings.settings_data.team_members
      const { data: settingsRow } = await supabaseAdmin
        .from('site_settings')
        .select('settings_data')
        .eq('id', 'primary')
        .maybeSingle();

      if (
        settingsRow?.settings_data &&
        Array.isArray(settingsRow.settings_data.team_members)
      ) {
        return (settingsRow.settings_data.team_members as TeamMember[]).sort(
          (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
        );
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
  // 1. Update in-memory store
  const saved = store.saveTeamMember(memberData);

  if (isSupabaseConfigured && supabaseAdmin) {
    // 2. Try inserting/updating public.team_members table
    try {
      const dbRecord = mapTeamMemberToSupabase(saved);
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      if (saved.id && uuidRegex.test(saved.id)) {
        await supabaseAdmin
          .from('team_members')
          .update(dbRecord)
          .eq('id', saved.id);
      } else {
        const { data: inserted } = await supabaseAdmin
          .from('team_members')
          .insert({
            ...dbRecord,
            created_at: new Date().toISOString(),
          })
          .select()
          .maybeSingle();

        if (inserted?.id) {
          saved.id = inserted.id;
        }
      }
    } catch {
      // Table may not exist yet in Postgres schema, continue to JSON storage
    }

    // 3. Guarantee persistence in site_settings.settings_data.team_members
    try {
      const { data: settingsRow } = await supabaseAdmin
        .from('site_settings')
        .select('settings_data')
        .eq('id', 'primary')
        .maybeSingle();

      const existingData = settingsRow?.settings_data || {};
      const currentList: TeamMember[] = Array.isArray(existingData.team_members)
        ? existingData.team_members
        : [];

      const updatedList = currentList.map((m) => (m.id === saved.id ? saved : m));
      if (!updatedList.some((m) => m.id === saved.id)) {
        updatedList.push(saved);
      }

      await supabaseAdmin
        .from('site_settings')
        .update({
          settings_data: {
            ...existingData,
            team_members: updatedList,
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', 'primary');
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
      await supabaseAdmin.from('team_members').delete().eq('id', id);
    } catch {
      // ignore
    }

    try {
      const { data: settingsRow } = await supabaseAdmin
        .from('site_settings')
        .select('settings_data')
        .eq('id', 'primary')
        .maybeSingle();

      if (settingsRow?.settings_data) {
        const currentList = Array.isArray(settingsRow.settings_data.team_members)
          ? settingsRow.settings_data.team_members.filter((m: { id: string }) => m.id !== id)
          : [];

        await supabaseAdmin
          .from('site_settings')
          .update({
            settings_data: {
              ...settingsRow.settings_data,
              team_members: currentList,
            },
            updated_at: new Date().toISOString(),
          })
          .eq('id', 'primary');
      }
    } catch {
      // ignore
    }
  }

  return deleted;
}
