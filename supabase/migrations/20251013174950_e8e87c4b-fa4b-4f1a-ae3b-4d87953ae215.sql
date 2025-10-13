-- Create payment schedule table
CREATE TABLE public.payment_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES public.property_units(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  amount NUMERIC NOT NULL,
  due_date DATE NOT NULL,
  payment_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'partial')),
  payment_percentage INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID NOT NULL REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.payment_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Promoters can manage payment schedules for their projects"
ON public.payment_schedules
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = payment_schedules.project_id
    AND projects.owner_id = auth.uid()
  )
);

CREATE POLICY "Clients can view their payment schedules"
ON public.payment_schedules
FOR SELECT
USING (
  client_id = get_current_user_client_id()
);

-- Trigger for updated_at
CREATE TRIGGER update_payment_schedules_updated_at
BEFORE UPDATE ON public.payment_schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();