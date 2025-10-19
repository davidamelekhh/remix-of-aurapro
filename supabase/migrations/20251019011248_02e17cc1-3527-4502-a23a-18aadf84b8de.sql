-- Add missing columns to waitlist table for early adopter form
ALTER TABLE public.waitlist
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS project_count TEXT;