-- SOLUTION RADICALE : Supprimer toutes les politiques RLS problématiques sur projects
-- et recréer des politiques ultra-simples sans aucune jointure

-- Désactiver temporairement RLS
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Pros can view own projects" ON public.projects;
DROP POLICY IF EXISTS "Clients can view assigned projects" ON public.projects;
DROP POLICY IF EXISTS "Users can create own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;

-- Réactiver RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Créer des politiques ultra-simples basées UNIQUEMENT sur owner_id
CREATE POLICY "Allow all for owners"
  ON public.projects
  FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);