-- Create stakeholders table
CREATE TABLE public.stakeholders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stakeholder_assignments table for linking stakeholders to milestones
CREATE TABLE public.stakeholder_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stakeholder_id UUID NOT NULL REFERENCES public.stakeholders(id) ON DELETE CASCADE,
  milestone_id UUID NOT NULL REFERENCES public.project_updates(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(stakeholder_id, milestone_id)
);

-- Enable RLS
ALTER TABLE public.stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholder_assignments ENABLE ROW LEVEL SECURITY;

-- RLS policies for stakeholders
CREATE POLICY "Promoters can manage their stakeholders"
ON public.stakeholders
FOR ALL
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- RLS policies for stakeholder_assignments
CREATE POLICY "Promoters can manage stakeholder assignments"
ON public.stakeholder_assignments
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.stakeholders s
    WHERE s.id = stakeholder_assignments.stakeholder_id
    AND s.owner_id = auth.uid()
  )
);

CREATE POLICY "Stakeholders can view their assignments"
ON public.stakeholder_assignments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.stakeholders s
    JOIN public.profiles p ON s.email ILIKE p.email
    WHERE s.id = stakeholder_assignments.stakeholder_id
    AND p.id = auth.uid()
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_stakeholders_updated_at
BEFORE UPDATE ON public.stakeholders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();