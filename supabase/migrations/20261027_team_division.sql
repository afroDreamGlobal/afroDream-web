-- =====================================================================
-- TEAM MEMBERS TABLE SCHEMA FOR AFRO DREAM GLOBAL
-- =====================================================================
-- Run this in your Supabase SQL Editor.
-- It creates the clean table, indexes, and Row-Level Security (RLS) policies.
-- NO dummy or demo data is included — you will add all real members
-- directly from your Admin Panel.
-- =====================================================================

-- 1. Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT,
  bio TEXT,
  image_url TEXT DEFAULT '',
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  quote TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON public.team_members(display_order);
CREATE INDEX IF NOT EXISTS idx_team_members_is_published ON public.team_members(is_published);

-- 4. Row Level Security (RLS)
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Allow public to view published team members
DROP POLICY IF EXISTS "Public can view published team members" ON public.team_members;
CREATE POLICY "Public can view published team members" 
  ON public.team_members 
  FOR SELECT 
  USING (is_published = true);

-- Allow service_role (Admin Panel) full CRUD access
DROP POLICY IF EXISTS "Service role full access on team_members" ON public.team_members;
CREATE POLICY "Service role full access on team_members" 
  ON public.team_members 
  FOR ALL 
  TO service_role 
  USING (true) 
  WITH CHECK (true);
