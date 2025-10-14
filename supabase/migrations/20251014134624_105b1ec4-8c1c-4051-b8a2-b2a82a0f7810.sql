-- ============================================
-- COMPREHENSIVE BACKEND AUDIT & FIX
-- ============================================

-- 1. Add missing constraints and indexes for performance
-- ============================================

-- Add indexes on foreign keys for faster queries
CREATE INDEX IF NOT EXISTS idx_clients_owner_id ON public.clients(owner_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_payment_schedules_project_id ON public.payment_schedules(project_id);
CREATE INDEX IF NOT EXISTS idx_payment_schedules_client_id ON public.payment_schedules(client_id);
CREATE INDEX IF NOT EXISTS idx_payment_schedules_unit_id ON public.payment_schedules(unit_id);
CREATE INDEX IF NOT EXISTS idx_project_clients_project_id ON public.project_clients(project_id);
CREATE INDEX IF NOT EXISTS idx_project_clients_client_id ON public.project_clients(client_id);
CREATE INDEX IF NOT EXISTS idx_project_clients_unit_id ON public.project_clients(unit_id);
CREATE INDEX IF NOT EXISTS idx_project_documents_project_id ON public.project_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_project_messages_project_id ON public.project_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_project_updates_project_id ON public.project_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_property_units_project_id ON public.property_units(project_id);
CREATE INDEX IF NOT EXISTS idx_stakeholder_assignments_milestone_id ON public.stakeholder_assignments(milestone_id);
CREATE INDEX IF NOT EXISTS idx_stakeholder_assignments_stakeholder_id ON public.stakeholder_assignments(stakeholder_id);
CREATE INDEX IF NOT EXISTS idx_stakeholders_owner_id ON public.stakeholders(owner_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- 2. Add proper foreign key constraints with CASCADE behavior
-- ============================================

-- Clients table
ALTER TABLE public.clients DROP CONSTRAINT IF EXISTS clients_owner_id_fkey;
ALTER TABLE public.clients 
ADD CONSTRAINT clients_owner_id_fkey 
FOREIGN KEY (owner_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Payment schedules
ALTER TABLE public.payment_schedules DROP CONSTRAINT IF EXISTS payment_schedules_project_id_fkey;
ALTER TABLE public.payment_schedules 
ADD CONSTRAINT payment_schedules_project_id_fkey 
FOREIGN KEY (project_id) 
REFERENCES public.projects(id) 
ON DELETE CASCADE;

ALTER TABLE public.payment_schedules DROP CONSTRAINT IF EXISTS payment_schedules_client_id_fkey;
ALTER TABLE public.payment_schedules 
ADD CONSTRAINT payment_schedules_client_id_fkey 
FOREIGN KEY (client_id) 
REFERENCES public.clients(id) 
ON DELETE SET NULL;

ALTER TABLE public.payment_schedules DROP CONSTRAINT IF EXISTS payment_schedules_unit_id_fkey;
ALTER TABLE public.payment_schedules 
ADD CONSTRAINT payment_schedules_unit_id_fkey 
FOREIGN KEY (unit_id) 
REFERENCES public.property_units(id) 
ON DELETE SET NULL;

ALTER TABLE public.payment_schedules DROP CONSTRAINT IF EXISTS payment_schedules_created_by_fkey;
ALTER TABLE public.payment_schedules 
ADD CONSTRAINT payment_schedules_created_by_fkey 
FOREIGN KEY (created_by) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Project clients
ALTER TABLE public.project_clients DROP CONSTRAINT IF EXISTS project_clients_project_id_fkey;
ALTER TABLE public.project_clients 
ADD CONSTRAINT project_clients_project_id_fkey 
FOREIGN KEY (project_id) 
REFERENCES public.projects(id) 
ON DELETE CASCADE;

ALTER TABLE public.project_clients DROP CONSTRAINT IF EXISTS project_clients_client_id_fkey;
ALTER TABLE public.project_clients 
ADD CONSTRAINT project_clients_client_id_fkey 
FOREIGN KEY (client_id) 
REFERENCES public.clients(id) 
ON DELETE CASCADE;

ALTER TABLE public.project_clients DROP CONSTRAINT IF EXISTS project_clients_unit_id_fkey;
ALTER TABLE public.project_clients 
ADD CONSTRAINT project_clients_unit_id_fkey 
FOREIGN KEY (unit_id) 
REFERENCES public.property_units(id) 
ON DELETE CASCADE;

-- Project documents
ALTER TABLE public.project_documents DROP CONSTRAINT IF EXISTS project_documents_project_id_fkey;
ALTER TABLE public.project_documents 
ADD CONSTRAINT project_documents_project_id_fkey 
FOREIGN KEY (project_id) 
REFERENCES public.projects(id) 
ON DELETE CASCADE;

ALTER TABLE public.project_documents DROP CONSTRAINT IF EXISTS project_documents_uploaded_by_fkey;
ALTER TABLE public.project_documents 
ADD CONSTRAINT project_documents_uploaded_by_fkey 
FOREIGN KEY (uploaded_by) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Project messages
ALTER TABLE public.project_messages DROP CONSTRAINT IF EXISTS project_messages_project_id_fkey;
ALTER TABLE public.project_messages 
ADD CONSTRAINT project_messages_project_id_fkey 
FOREIGN KEY (project_id) 
REFERENCES public.projects(id) 
ON DELETE CASCADE;

ALTER TABLE public.project_messages DROP CONSTRAINT IF EXISTS project_messages_sender_id_fkey;
ALTER TABLE public.project_messages 
ADD CONSTRAINT project_messages_sender_id_fkey 
FOREIGN KEY (sender_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Project updates
ALTER TABLE public.project_updates DROP CONSTRAINT IF EXISTS project_updates_project_id_fkey;
ALTER TABLE public.project_updates 
ADD CONSTRAINT project_updates_project_id_fkey 
FOREIGN KEY (project_id) 
REFERENCES public.projects(id) 
ON DELETE CASCADE;

ALTER TABLE public.project_updates DROP CONSTRAINT IF EXISTS project_updates_created_by_fkey;
ALTER TABLE public.project_updates 
ADD CONSTRAINT project_updates_created_by_fkey 
FOREIGN KEY (created_by) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Projects
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_owner_id_fkey;
ALTER TABLE public.projects 
ADD CONSTRAINT projects_owner_id_fkey 
FOREIGN KEY (owner_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Property units
ALTER TABLE public.property_units DROP CONSTRAINT IF EXISTS property_units_project_id_fkey;
ALTER TABLE public.property_units 
ADD CONSTRAINT property_units_project_id_fkey 
FOREIGN KEY (project_id) 
REFERENCES public.projects(id) 
ON DELETE CASCADE;

-- Stakeholders
ALTER TABLE public.stakeholders DROP CONSTRAINT IF EXISTS stakeholders_owner_id_fkey;
ALTER TABLE public.stakeholders 
ADD CONSTRAINT stakeholders_owner_id_fkey 
FOREIGN KEY (owner_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- 3. Add unique constraints to prevent data duplication
-- ============================================

-- Ensure email uniqueness per promoter (not globally)
ALTER TABLE public.clients DROP CONSTRAINT IF EXISTS clients_email_owner_unique;
ALTER TABLE public.clients 
ADD CONSTRAINT clients_email_owner_unique 
UNIQUE (email, owner_id);

-- Ensure unit_number is unique per project
ALTER TABLE public.property_units DROP CONSTRAINT IF EXISTS property_units_unit_number_project_unique;
ALTER TABLE public.property_units 
ADD CONSTRAINT property_units_unit_number_project_unique 
UNIQUE (unit_number, project_id);

-- Ensure one client per unit
ALTER TABLE public.project_clients DROP CONSTRAINT IF EXISTS project_clients_unit_unique;
ALTER TABLE public.project_clients 
ADD CONSTRAINT project_clients_unit_unique 
UNIQUE (unit_id);

-- 4. Add NOT NULL constraints where critical
-- ============================================

-- Make sure critical fields are not null
ALTER TABLE public.clients ALTER COLUMN owner_id SET NOT NULL;
ALTER TABLE public.projects ALTER COLUMN owner_id SET NOT NULL;
ALTER TABLE public.property_units ALTER COLUMN project_id SET NOT NULL;
ALTER TABLE public.stakeholders ALTER COLUMN owner_id SET NOT NULL;
ALTER TABLE public.payment_schedules ALTER COLUMN project_id SET NOT NULL;
ALTER TABLE public.payment_schedules ALTER COLUMN created_by SET NOT NULL;
ALTER TABLE public.project_documents ALTER COLUMN project_id SET NOT NULL;
ALTER TABLE public.project_documents ALTER COLUMN uploaded_by SET NOT NULL;
ALTER TABLE public.project_messages ALTER COLUMN project_id SET NOT NULL;
ALTER TABLE public.project_messages ALTER COLUMN sender_id SET NOT NULL;
ALTER TABLE public.project_updates ALTER COLUMN project_id SET NOT NULL;
ALTER TABLE public.project_updates ALTER COLUMN created_by SET NOT NULL;

-- 5. Create a proper milestones table for project updates
-- ============================================

CREATE TABLE IF NOT EXISTS public.project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  milestone_key TEXT NOT NULL, -- 'foundation', 'structure', etc.
  label TEXT NOT NULL,
  description TEXT,
  progress_percentage INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, in_progress, completed
  start_date DATE,
  end_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, milestone_key)
);

-- Add RLS to project_milestones
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Promoters can manage milestones for their projects"
ON public.project_milestones
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_milestones.project_id
    AND projects.owner_id = auth.uid()
  )
);

CREATE POLICY "Clients can view milestones for their projects"
ON public.project_milestones
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.project_clients pc
    JOIN public.clients c ON c.id = pc.client_id
    JOIN public.profiles p ON p.email ILIKE c.email
    WHERE pc.project_id = project_milestones.project_id
    AND p.id = auth.uid()
  )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON public.project_milestones(project_id);

-- Add trigger for updated_at
CREATE TRIGGER update_project_milestones_updated_at
BEFORE UPDATE ON public.project_milestones
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Fix stakeholder_assignments to reference milestones properly
-- ============================================

ALTER TABLE public.stakeholder_assignments DROP CONSTRAINT IF EXISTS stakeholder_assignments_milestone_id_fkey;
ALTER TABLE public.stakeholder_assignments 
ADD CONSTRAINT stakeholder_assignments_milestone_id_fkey 
FOREIGN KEY (milestone_id) 
REFERENCES public.project_milestones(id) 
ON DELETE CASCADE;

ALTER TABLE public.stakeholder_assignments DROP CONSTRAINT IF EXISTS stakeholder_assignments_stakeholder_id_fkey;
ALTER TABLE public.stakeholder_assignments 
ADD CONSTRAINT stakeholder_assignments_stakeholder_id_fkey 
FOREIGN KEY (stakeholder_id) 
REFERENCES public.stakeholders(id) 
ON DELETE CASCADE;

-- 7. Add validation constraints
-- ============================================

-- Progress must be between 0 and 100
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_progress_check;
ALTER TABLE public.projects 
ADD CONSTRAINT projects_progress_check 
CHECK (progress >= 0 AND progress <= 100);

-- Surface area must be positive
ALTER TABLE public.property_units DROP CONSTRAINT IF EXISTS property_units_surface_check;
ALTER TABLE public.property_units 
ADD CONSTRAINT property_units_surface_check 
CHECK (surface_area IS NULL OR surface_area > 0);

-- Price must be positive
ALTER TABLE public.property_units DROP CONSTRAINT IF EXISTS property_units_price_check;
ALTER TABLE public.property_units 
ADD CONSTRAINT property_units_price_check 
CHECK (price IS NULL OR price > 0);

-- Payment amount must be positive
ALTER TABLE public.payment_schedules DROP CONSTRAINT IF EXISTS payment_schedules_amount_check;
ALTER TABLE public.payment_schedules 
ADD CONSTRAINT payment_schedules_amount_check 
CHECK (amount > 0);

-- Payment percentage must be between 0 and 100
ALTER TABLE public.payment_schedules DROP CONSTRAINT IF EXISTS payment_schedules_percentage_check;
ALTER TABLE public.payment_schedules 
ADD CONSTRAINT payment_schedules_percentage_check 
CHECK (payment_percentage IS NULL OR (payment_percentage >= 0 AND payment_percentage <= 100));