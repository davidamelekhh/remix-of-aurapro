-- Add RLS policy to allow clients to view their own project assignments
CREATE POLICY "Clients can view their own project assignments"
  ON public.project_clients
  FOR SELECT
  USING (
    client_id IN (
      SELECT id 
      FROM public.clients 
      WHERE email ILIKE (
        SELECT email 
        FROM public.profiles 
        WHERE id = auth.uid()
      )
    )
  );

-- Add RLS policy to allow clients to view projects they are assigned to
CREATE POLICY "Clients can view their assigned projects"
  ON public.projects
  FOR SELECT
  USING (
    id IN (
      SELECT project_id 
      FROM public.project_clients 
      WHERE client_id IN (
        SELECT id 
        FROM public.clients 
        WHERE email ILIKE (
          SELECT email 
          FROM public.profiles 
          WHERE id = auth.uid()
        )
      )
    )
  );

-- Add RLS policy to allow clients to view property units they are assigned to
CREATE POLICY "Clients can view their assigned units"
  ON public.property_units
  FOR SELECT
  USING (
    id IN (
      SELECT unit_id 
      FROM public.project_clients 
      WHERE client_id IN (
        SELECT id 
        FROM public.clients 
        WHERE email ILIKE (
          SELECT email 
          FROM public.profiles 
          WHERE id = auth.uid()
        )
      )
    )
  );