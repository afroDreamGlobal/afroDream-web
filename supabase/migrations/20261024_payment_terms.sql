-- Migration: Add payment_terms column to public.quote_requests
-- Created: 2026-10-24

ALTER TABLE public.quote_requests 
ADD COLUMN IF NOT EXISTS payment_terms TEXT;

COMMENT ON COLUMN public.quote_requests.payment_terms IS 'Settlement terms: Prepaid or Collect for containers, Advance % and Final Payment % for bulk vessels and truck bookings';
