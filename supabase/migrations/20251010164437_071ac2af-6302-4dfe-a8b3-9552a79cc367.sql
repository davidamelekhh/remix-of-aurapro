-- Add RLS policy to allow clients to read their own record from clients table
-- Clients need to be able to find their client_id based on their email
CREATE POLICY "Clients can view their own client record"
  ON public.clients
  FOR SELECT
  USING (
    email ILIKE (
      SELECT email 
      FROM public.profiles 
      WHERE id = auth.uid()
    )
  );