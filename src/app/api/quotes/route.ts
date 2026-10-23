import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { sendQuoteAcknowledgementEmail } from '@/lib/brevo';
import * as z from 'zod';

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
  cargoDescription: z.string().min(3),
  cargoWeight: z.string().optional(),
  cargoVolume: z.string().optional(),
  preferredDate: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const validated = quoteRequestSchema.parse(json);

    // Save in store
    const quote = store.createQuote(validated);

    // If Supabase is configured, also persist directly to PostgreSQL
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        await supabaseAdmin.from('quote_requests').insert({
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
          additional_notes: quote.additionalNotes || null,
          status: 'new',
        });
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

export async function GET() {
  const quotes = store.getQuotes();
  return NextResponse.json({ success: true, data: quotes });
}
