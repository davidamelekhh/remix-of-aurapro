-- Add estimated_revenue column to projects table
ALTER TABLE public.projects
ADD COLUMN estimated_revenue NUMERIC DEFAULT 0;