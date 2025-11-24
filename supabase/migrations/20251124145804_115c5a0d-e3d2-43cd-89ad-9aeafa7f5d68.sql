-- Create table for project expenses
CREATE TABLE public.project_expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  amount NUMERIC NOT NULL,
  category TEXT NOT NULL,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for project expenses
CREATE POLICY "Promoters can manage expenses for their projects"
ON public.project_expenses
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_expenses.project_id
    AND projects.owner_id = auth.uid()
  )
);

-- Create table for project partners
CREATE TABLE public.project_partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  percentage NUMERIC NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_partners ENABLE ROW LEVEL SECURITY;

-- Create policies for project partners
CREATE POLICY "Promoters can manage partners for their projects"
ON public.project_partners
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_partners.project_id
    AND projects.owner_id = auth.uid()
  )
);

-- Create trigger for updated_at on project_expenses
CREATE TRIGGER update_project_expenses_updated_at
BEFORE UPDATE ON public.project_expenses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on project_partners
CREATE TRIGGER update_project_partners_updated_at
BEFORE UPDATE ON public.project_partners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();