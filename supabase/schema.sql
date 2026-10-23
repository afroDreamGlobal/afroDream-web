-- =====================================================================
-- AFRO DREAM GLOBAL — COMPLETE ALL-IN-ONE SUPABASE MIGRATION
-- =====================================================================
-- Copy and paste this entire file into your Supabase SQL Editor and click RUN.
-- It creates all required tables, indexes, Row Level Security (RLS) policies,
-- and inserts initial production seed data for services, trade routes, settings,
-- shipments, and quote inquiries.
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------
-- 1. PROFILES (Admin Users)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'operator')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 2. SERVICES
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  icon_name TEXT DEFAULT 'Ship',
  category TEXT DEFAULT 'Ocean Freight',
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  features JSONB DEFAULT '[]'::jsonb,
  route_highlight TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON public.services(display_order);

-- ---------------------------------------------------------------------
-- 3. QUOTE REQUESTS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  company_name TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  origin_country TEXT NOT NULL,
  origin_port TEXT NOT NULL,
  destination_country TEXT NOT NULL,
  destination_port TEXT NOT NULL,
  service_type TEXT NOT NULL,
  cargo_description TEXT NOT NULL,
  cargo_weight TEXT,
  cargo_volume TEXT,
  preferred_date DATE,
  additional_notes TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'quoted', 'accepted', 'rejected', 'closed')),
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON public.quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_ref ON public.quote_requests(reference_number);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created ON public.quote_requests(created_at DESC);

-- ---------------------------------------------------------------------
-- 4. TRADE ROUTES
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trade_routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  origin_region TEXT NOT NULL,
  origin_country TEXT NOT NULL,
  origin_port TEXT NOT NULL,
  destination_region TEXT NOT NULL,
  destination_country TEXT NOT NULL,
  destination_port TEXT NOT NULL,
  transit_time TEXT,
  frequency TEXT,
  cargo_types JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 5. SHIPMENTS & TRACKING
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_number TEXT UNIQUE NOT NULL,
  booking_reference TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  service_type TEXT NOT NULL,
  cargo_description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'processing', 'in_transit', 'arrived_pod', 'customs_clearance', 'delivered')),
  vessel_name TEXT,
  voyage_number TEXT,
  estimated_departure DATE,
  estimated_arrival DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON public.shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_booking ON public.shipments(booking_reference);

CREATE TABLE IF NOT EXISTS public.tracking_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  status_label TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  event_time TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tracking_events_shipment ON public.tracking_events(shipment_id);

-- ---------------------------------------------------------------------
-- 6. SITE SETTINGS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  settings_data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 1. SERVICES
DROP POLICY IF EXISTS "Public can view published services" ON public.services;
CREATE POLICY "Public can view published services"
  ON public.services FOR SELECT
  USING (is_published = true);

DROP POLICY IF EXISTS "Full access for service role on services" ON public.services;
CREATE POLICY "Full access for service role on services"
  ON public.services FOR ALL
  TO service_role, authenticated
  USING (true)
  WITH CHECK (true);

-- 2. TRADE ROUTES
DROP POLICY IF EXISTS "Public can view active trade routes" ON public.trade_routes;
CREATE POLICY "Public can view active trade routes"
  ON public.trade_routes FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Full access for service role on trade routes" ON public.trade_routes;
CREATE POLICY "Full access for service role on trade routes"
  ON public.trade_routes FOR ALL
  TO service_role, authenticated
  USING (true)
  WITH CHECK (true);

-- 3. QUOTE REQUESTS
DROP POLICY IF EXISTS "Public can submit quote requests" ON public.quote_requests;
CREATE POLICY "Public can submit quote requests"
  ON public.quote_requests FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Full access for service role on quote requests" ON public.quote_requests;
CREATE POLICY "Full access for service role on quote requests"
  ON public.quote_requests FOR ALL
  TO service_role, authenticated
  USING (true)
  WITH CHECK (true);

-- 4. SHIPMENTS & TRACKING
DROP POLICY IF EXISTS "Public can view shipments by reference" ON public.shipments;
CREATE POLICY "Public can view shipments by reference"
  ON public.shipments FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Full access for service role on shipments" ON public.shipments;
CREATE POLICY "Full access for service role on shipments"
  ON public.shipments FOR ALL
  TO service_role, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view tracking events" ON public.tracking_events;
CREATE POLICY "Public can view tracking events"
  ON public.tracking_events FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Full access for service role on tracking events" ON public.tracking_events;
CREATE POLICY "Full access for service role on tracking events"
  ON public.tracking_events FOR ALL
  TO service_role, authenticated
  USING (true)
  WITH CHECK (true);

-- 5. SITE SETTINGS
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings"
  ON public.site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Full access for service role on site settings" ON public.site_settings;
CREATE POLICY "Full access for service role on site settings"
  ON public.site_settings FOR ALL
  TO service_role, authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================================
-- PRODUCTION SEED DATA INSERTION
-- =====================================================================

-- 1. INITIAL SERVICES (Matching client reference images)
INSERT INTO public.services (slug, title, short_description, full_description, image_url, icon_name, category, display_order, is_published, features, route_highlight)
VALUES
(
  'container-shipment',
  'Container Shipment',
  'We are Providing Best rate and administration supports in container shipments from Mtwara port especially for Raw Cashew Nut Traders and Buyers.',
  'Specialized international containerized shipping solutions connecting East and West Africa to global ports. We provide competitive freight rates, dedicated container leasing, seamless booking management, and comprehensive documentation support. Specially optimized for Raw Cashew Nut (RCN) traders, exporters, and international commodity buyers.',
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
  'Container',
  'Ocean Freight',
  1,
  true,
  '["Origin port operations at Mtwara & Bissau", "Specialized Raw Cashew Nut (RCN) container stuffing", "Direct carrier contracts for competitive ocean freight", "Moisture control and quality inspection support", "Full bill of lading and export document processing"]'::jsonb,
  'Mtwara / Bissau to Global Hubs'
),
(
  'bulk-vessel-shipment',
  'Bulk Vessel Shipment',
  'One of our attractive part in the shipment of Tanzania is Bulk Vessel shipment. Join and feel the difference.',
  'High-capacity breakbulk and dry bulk vessel chartering services for large commodity volumes. We manage vessel loading, berthing priority, stevedoring supervision, hatch inspection, and comprehensive maritime documentation across African deep-water terminals.',
  'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80',
  'Ship',
  'Maritime Cargo',
  2,
  true,
  '["Full and part vessel charter arrangements", "Port captaincy and stevedore supervision", "Fast turnaround time at origin loading berths", "Bulk agricultural commodities handling expertise", "Real-time vessel position updates and laytime calculations"]'::jsonb,
  'Tanzania & West Africa Deep-water Ports'
),
(
  'local-transportation-tanzania',
  'Local Transportation in Tanzania',
  'we are handling the local transportation from different warehouses in all regions of southern Tanzania.',
  'Reliable inland haulage and trucking networks covering southern and coastal Tanzania. We connect inland farms, collection centers, and primary warehouses directly to port storage facilities and ocean terminals, ensuring safety and zero transit delay for sensitive agricultural cargo.',
  'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
  'Truck',
  'Inland Logistics',
  3,
  true,
  '["Extensive fleet of heavy-duty flatbed and box trucks", "Southern Tanzania warehouse-to-port direct corridors", "GPS monitored transit and security escorts where required", "Weighbridge inspection and tally verification", "Flexible dispatch for peak seasonal harvesting volumes"]'::jsonb,
  'Southern Tanzania to Mtwara Port'
),
(
  'clearing-port-of-destination',
  'Clearing in the Port of Destination (POD)',
  'We clearing your cargo in the destination port like Mangalore, Tuticorin, Ho Chi Minh etc...',
  'Professional customs brokerage and import clearance services at strategic destination ports across India and Southeast Asia. We navigate customs regulations, phytosanitary requirements, duty assessments, and port authority procedures for rapid cargo release.',
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
  'Anchor',
  'Customs & Port Services',
  4,
  true,
  '["Active customs clearance at Tuticorin, Mangalore, Mundra, and Visakhapatnam", "Southeast Asia port operations including Ho Chi Minh, Vietnam", "Plant quarantine and phytosanitary inspection management", "Rapid delivery order (DO) and port fee settlement", "Transparent documentation with zero hidden port demurrage"]'::jsonb,
  'Tuticorin, Mangalore, Mundra, Ho Chi Minh'
),
(
  'local-transportation-india',
  'Local Transportation in India',
  'We can take your materials from your warehouse door in African Continental to the Indian Warehouse door of yours.',
  'True end-to-end multimodal logistics. From the moment your cargo is cleared at Indian ports (Tuticorin, Mangalore, Mundra, etc.), our bonded and commercial transport fleet delivers containers directly to your processing mills and warehouse doors across India.',
  'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80',
  'MapPin',
  'Door-to-Door Delivery',
  5,
  true,
  '["Door-to-door multimodal freight from Africa to India", "Direct connectivity from port gate to factory/warehouse", "Container de-stuffing and palletized distribution options", "Real-time transport tracking and electronic proof of delivery (e-POD)", "Dedicated handling for cashew processing units and agro-mills"]'::jsonb,
  'Indian Coastal Ports to Inland Processing Hubs'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  image_url = EXCLUDED.image_url,
  features = EXCLUDED.features;

-- 2. INITIAL TRADE ROUTES
INSERT INTO public.trade_routes (name, origin_region, origin_country, origin_port, destination_region, destination_country, destination_port, transit_time, frequency, cargo_types, is_active, is_featured)
VALUES
(
  'Tanzania to South India (Tuticorin & Mangalore)',
  'East Africa',
  'Tanzania',
  'Mtwara Port',
  'South Asia',
  'India',
  'Tuticorin / Mangalore',
  '14 - 18 Days',
  'Weekly departures during season',
  '["Raw Cashew Nuts", "Agricultural Commodities", "Dry Bulk"]'::jsonb,
  true,
  true
),
(
  'Tanzania to West India (Mundra)',
  'East Africa',
  'Tanzania',
  'Mtwara Port',
  'South Asia',
  'India',
  'Mundra Port',
  '16 - 20 Days',
  'Bi-weekly scheduled sailings',
  '["Raw Cashew Nuts", "Pulses", "Timber", "Minerals"]'::jsonb,
  true,
  true
),
(
  'West Africa to India & Vietnam Corridor',
  'West Africa',
  'Guinea-Bissau',
  'Bissau Port',
  'Asia',
  'India / Vietnam',
  'Tuticorin / Ho Chi Minh',
  '24 - 30 Days',
  'Regular seasonal container service',
  '["Raw Cashew Nuts", "Commercial Freight"]'::jsonb,
  true,
  true
),
(
  'East Africa to Southeast Asia (Vietnam)',
  'East Africa',
  'Tanzania',
  'Mtwara / Dar es Salaam',
  'Southeast Asia',
  'Vietnam',
  'Ho Chi Minh Port',
  '18 - 22 Days',
  'Weekly departures',
  '["Raw Cashew Nuts", "Agricultural Cargo"]'::jsonb,
  true,
  true
)
ON CONFLICT DO NOTHING;

-- 3. SITE SETTINGS
INSERT INTO public.site_settings (id, settings_data)
VALUES (
  'primary',
  '{
    "companyName": "Afro Dream Global",
    "tagline": "Reliable Shipping Solutions Connecting Africa to Global Markets",
    "announcementBarText": "Active container & bulk sailings from Mtwara Port (TZ) & Bissau (GW) to India & Vietnam",
    "announcementBarEnabled": true,
    "phoneGuineaBissau": "+245 955 888 123",
    "phoneTanzania": "+255 744 555 890",
    "phoneIndia": "+91 98401 23456",
    "primaryEmail": "info@afrodreamglobal.com",
    "quotesEmail": "quotes@afrodreamglobal.com",
    "addressGuineaBissau": "CAJU SWIFT SARL / CSS, Port Area, Bissau, Guinea-Bissau",
    "addressTanzania": "Mtwara Port Logistics Corridor, Mtwara, Tanzania",
    "addressIndia": "Port Logistics Wing, Tuticorin & Mangalore, India",
    "whatsappNumber": "+255744555890",
    "heroBadge": "RELIABLE SHIPPING SOLUTIONS",
    "heroHeadline": "CONNECTING AFRICA TO GLOBAL MARKETS",
    "heroSubheadline": "Comprehensive logistics and shipping solutions for Raw Cashew Nuts and global cargo. Reliable, efficient, and professional services across Africa and beyond.",
    "heroBannerImageUrl": "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=2000&q=85",
    "showHeroTextOverlay": true,
    "showHeroCtaButtons": true,
    "aboutHeadline": "ABOUT AFRO DREAM GLOBAL",
    "aboutDescription": "AFRO DREAM GLOBAL (CAJU SWIFT SARL / CSS in Guinea-Bissau) is a logistics and shipping service provider based in West Africa. Since 2022, we have specialized in the containerized shipment of raw cashew nuts, establishing ourselves as a reliable partner in the shipping and logistics industry."
  }'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  settings_data = EXCLUDED.settings_data,
  updated_at = NOW();

-- 4. INITIAL SAMPLE SHIPMENTS
DO $$
DECLARE
  v_shp_id UUID;
BEGIN
  -- Shipment 1
  INSERT INTO public.shipments (tracking_number, booking_reference, customer_name, origin, destination, service_type, cargo_description, status, vessel_name, voyage_number, estimated_departure, estimated_arrival)
  VALUES ('ADG7892401', 'BK-2026-1044', 'Kishore Commodities LLP', 'Mtwara Port, Tanzania', 'Tuticorin Port, India', 'Container Shipment', 'Raw Cashew Nuts (25 x 40ft)', 'in_transit', 'MV OCEAN BLUE EXPRESS', 'OBE-2610E', '2026-10-18', '2026-10-31')
  ON CONFLICT (tracking_number) DO UPDATE SET status = 'in_transit'
  RETURNING id INTO v_shp_id;

  IF v_shp_id IS NOT NULL THEN
    DELETE FROM public.tracking_events WHERE shipment_id = v_shp_id;
    INSERT INTO public.tracking_events (shipment_id, status, status_label, location, description, event_time)
    VALUES
      (v_shp_id, 'registered', 'Shipment Registered', 'Mtwara Logistics Depot, Tanzania', 'Booking confirmed and empty containers released for stuffing.', '2026-10-15 10:30:00+00'),
      (v_shp_id, 'processing', 'Customs & Port Loading', 'Mtwara Ocean Terminal, Tanzania', 'Export customs cleared and loaded aboard MV OCEAN BLUE EXPRESS.', '2026-10-17 18:45:00+00'),
      (v_shp_id, 'in_transit', 'In Transit', 'Indian Ocean Corridor', 'Vessel en route to Tuticorin Port. On schedule.', '2026-10-20 12:00:00+00');
  END IF;

  -- Shipment 2
  INSERT INTO public.shipments (tracking_number, booking_reference, customer_name, origin, destination, service_type, cargo_description, status, vessel_name, voyage_number, estimated_departure, estimated_arrival)
  VALUES ('ADG6541198', 'BK-2026-1022', 'Saigon Agro Imports Co.', 'Bissau Port, Guinea-Bissau', 'Ho Chi Minh Port, Vietnam', 'Container Shipment', 'Raw Cashew Nuts (15 Containers)', 'arrived_pod', 'MV CASHEW TRADER', 'CT-2609', '2026-09-28', '2026-10-22')
  ON CONFLICT (tracking_number) DO UPDATE SET status = 'arrived_pod'
  RETURNING id INTO v_shp_id;

  IF v_shp_id IS NOT NULL THEN
    DELETE FROM public.tracking_events WHERE shipment_id = v_shp_id;
    INSERT INTO public.tracking_events (shipment_id, status, status_label, location, description, event_time)
    VALUES
      (v_shp_id, 'registered', 'Shipment Registered', 'Bissau, Guinea-Bissau', 'Containers stuffed at export consolidation warehouse.', '2026-09-25 09:00:00+00'),
      (v_shp_id, 'in_transit', 'Maritime Transit', 'Cape Route -> Southeast Asia', 'Deep sea voyage proceeding smoothly.', '2026-10-05 14:20:00+00'),
      (v_shp_id, 'arrived_pod', 'Arrived at Destination Port', 'Ho Chi Minh Port, Vietnam', 'Vessel arrived at anchorage; discharging underway.', '2026-10-22 06:15:00+00');
  END IF;
END $$;

-- 5. INITIAL SAMPLE QUOTES
INSERT INTO public.quote_requests (reference_number, customer_name, company_name, email, phone, origin_country, origin_port, destination_country, destination_port, service_type, cargo_description, cargo_weight, cargo_volume, preferred_date, additional_notes, status, internal_notes)
VALUES
(
  'ADG-Q-2026-001',
  'Kishore Agro Traders',
  'Kishore Commodities LLP',
  'operations@kishoreagro.in',
  '+91 98405 67890',
  'Tanzania',
  'Mtwara Port',
  'India',
  'Tuticorin',
  'Container Shipment',
  '500 MT Raw Cashew Nuts (In Shell)',
  '500 MT',
  '25 x 40ft High Cube Containers',
  '2026-11-15',
  'Need phytosanitary assistance and pre-cooling container inspection.',
  'reviewing',
  'Contacted carrier for special slot allotment on direct vessel.'
),
(
  'ADG-Q-2026-002',
  'Nguyen Van Minh',
  'Saigon Agro Imports Co.',
  'minh.nguyen@saigoncashew.vn',
  '+84 903 123 456',
  'Guinea-Bissau',
  'Bissau Port',
  'Vietnam',
  'Ho Chi Minh',
  'Container Shipment',
  '300 MT High Grade Raw Cashew Nuts',
  '300 MT',
  '15 x 40ft Containers',
  '2026-11-20',
  'Require clearing at POD and barge transfer support.',
  'new',
  NULL
)
ON CONFLICT (reference_number) DO NOTHING;
