-- Fix infinite recursion in projects RLS policies
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Pros can view own projects" ON public.projects;
DROP POLICY IF EXISTS "Clients can view assigned projects" ON public.projects;

-- Recreate clean policies without recursion
-- Pros can only view their own projects (not all projects)
CREATE POLICY "Pros can view own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = owner_id);

-- Clients can view projects they are assigned to
CREATE POLICY "Clients can view assigned projects"
  ON public.projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 
      FROM public.project_clients pc
      JOIN public.clients c ON c.id = pc.client_id
      WHERE c.email = (SELECT email FROM public.profiles WHERE id = auth.uid())
      AND pc.project_id = projects.id
    )
  );