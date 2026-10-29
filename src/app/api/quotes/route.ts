import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { sendQuoteAcknowledgementEmail } from '@/lib/brevo';
import * as z from 'zod';
import { verifyAdminRequest } from '@/lib/adminAuth';

const quoteRequestSchema = z.object({
  customerName: z.string().min(2),
  companyName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(7),
  originCountry: z.string().min(2),
  originPort: z.string().min(2),
  destinationCountry: z.string().min(2),
  destinationPort: z.string().min(2),
  serviceType: z.string().min(1),
  paymentTerms: z.string().optional(),
  advancePercentage: z.string().optional(),
  finalPercentage: z.string().optional(),
  cargoDescription: z.string().min(3),
  cargoWeight: z.string().optional(),
  cargoVolume: z.string().optional(),
  preferredDate: z.string().optional(),
  additionalNotes: z.string().optional(),
});

// PUBLIC: Allows customers on /quote and homepage to submit quote inquiries
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const validated = quoteRequestSchema.parse(json);

    // Save in store
    const quote = store.createQuote(validated);

    // If Supabase is configured, also persist directly to PostgreSQL
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const paymentNotes = quote.paymentTerms ? `[Payment Terms: ${quote.paymentTerms}]` : '';
        const combinedNotes = [quote.additionalNotes, paymentNotes].filter(Boolean).join('\n');

        const baseRecord = {
          reference_number: quote.referenceNumber,
          customer_name: quote.customerName,
          company_name: quote.companyName || null,
          email: quote.email,
          phone: quote.phone,
          origin_country: quote.originCountry,
          origin_port: quote.originPort,
          destination_country: quote.destinationCountry,
          destination_port: quote.destinationPort,
          service_type: quote.serviceType,
          cargo_description: quote.cargoDescription,
          cargo_weight: quote.cargoWeight || null,
          cargo_volume: quote.cargoVolume || null,
          preferred_date: quote.preferredDate || null,
          additional_notes: combinedNotes || null,
          status: 'new',
        };

        // Try inserting with payment_terms column if present in table
        const { error: insertErr } = await supabaseAdmin.from('quote_requests').insert({
          ...baseRecord,
          payment_terms: quote.paymentTerms || null,
        });

        if (insertErr) {
          // Fallback if payment_terms column does not exist yet in remote Supabase
          await supabaseAdmin.from('quote_requests').insert(baseRecord);
        }
      } catch (dbErr) {
        console.error('[Database Insert Error]', dbErr);
      }
    }

    // Trigger Brevo email notification asynchronously without blocking response
    sendQuoteAcknowledgementEmail(quote).catch((emailErr) => {
      console.error('[Brevo Email Notification Error]', emailErr);
    });

    return NextResponse.json({
      success: true,
      data: quote,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: err.errors },
        { status: 400 }
      );
    }

    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSupabaseToQuote(row: any) {
  // Extract payment terms if stored in additional_notes or payment_terms column
  const notesMatch = row.additional_notes?.match(/\[Payment Terms:\s*([^\]]+)\]/);
  const paymentTerms = row.payment_terms || (notesMatch ? notesMatch[1] : undefined);

  return {
    id: row.id,
    referenceNumber: row.reference_number,
    customerName: row.customer_name,
    companyName: row.company_name || undefined,
    email: row.email,
    phone: row.phone,
    originCountry: row.origin_country,
    originPort: row.origin_port,
    destinationCountry: row.destination_country,
    destinationPort: row.destination_port,
    serviceType: row.service_type,
    paymentTerms,
    cargoDescription: row.cargo_description,
    cargoWeight: row.cargo_weight || undefined,
    cargoVolume: row.cargo_volume || undefined,
    preferredDate: row.preferred_date || undefined,
    additionalNotes: row.additional_notes || undefined,
    status: row.status,
    internalNotes: row.internal_notes || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// PRIVILEGED: Only authenticated administrators can fetch customer quote inquiries
export async function GET(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Administrator session required.' },
      { status: 401 }
    );
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return NextResponse.json({ success: true, data: data.map(mapSupabaseToQuote) });
      }
    } catch (err) {
      console.warn('[Supabase Quotes Fetch Error]', err);
    }
  }

  const quotes = store.getQuotes();
  return NextResponse.json({ success: true, data: quotes });
}
