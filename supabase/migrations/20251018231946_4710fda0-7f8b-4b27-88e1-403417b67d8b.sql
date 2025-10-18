-- Add language column to waitlist table
ALTER TABLE public.waitlist 
ADD COLUMN language TEXT NOT NULL DEFAULT 'fr';