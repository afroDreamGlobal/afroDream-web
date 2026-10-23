import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function PUT(request: Request) {
  try {
    const json = await request.json();
    const { id, status, internalNotes } = json;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Missing id or status' }, { status: 400 });
    }

    const updated = store.updateQuoteStatus(id, status, internalNotes);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Quote not found' }, { status: 404 });
    }

    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        await supabaseAdmin
          .from('quote_requests')
          .update({
            status,
            internal_notes: internalNotes || null,
            updated_at: new Date().toISOString(),
          })
          .eq('reference_number', updated.referenceNumber);
      } catch (err) {
        console.error('[Supabase quote update error]', err);
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error updating quote';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
