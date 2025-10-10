-- Clean up all existing policies on clients table
DROP POLICY IF EXISTS "Users can view own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can update own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can delete own clients" ON public.clients;
DROP POLICY IF EXISTS "Pros can insert clients" ON public.clients;
DROP POLICY IF EXISTS "Pros can view all their clients" ON public.clients;
DROP POLICY IF EXISTS "Pros can update their clients" ON public.clients;
DROP POLICY IF EXISTS "Pros can delete their clients" ON public.clients;

-- Create a single, clear policy for pros to manage their clients
CREATE POLICY "Pros manage their own clients"
  ON public.clients
  FOR ALL
  USING (has_role(auth.uid(), 'pro'::app_role) AND auth.uid() = owner_id)
  WITH CHECK (has_role(auth.uid(), 'pro'::app_role) AND auth.uid() = owner_id);