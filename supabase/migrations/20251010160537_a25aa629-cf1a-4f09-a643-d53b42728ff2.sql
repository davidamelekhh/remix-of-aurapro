-- Fix RLS policy for clients table to allow pros to insert clients
-- Drop the overly restrictive ALL policy
DROP POLICY IF EXISTS "Pros can manage clients" ON public.clients;

-- Create separate policies for better control
CREATE POLICY "Pros can insert clients"
  ON public.clients
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'pro'::app_role) AND auth.uid() = owner_id);

CREATE POLICY "Pros can view all their clients"
  ON public.clients
  FOR SELECT
  USING (has_role(auth.uid(), 'pro'::app_role) AND auth.uid() = owner_id);

CREATE POLICY "Pros can update their clients"
  ON public.clients
  FOR UPDATE
  USING (has_role(auth.uid(), 'pro'::app_role) AND auth.uid() = owner_id);

CREATE POLICY "Pros can delete their clients"
  ON public.clients
  FOR DELETE
  USING (has_role(auth.uid(), 'pro'::app_role) AND auth.uid() = owner_id);