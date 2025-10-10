-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true);

-- Storage policies for project images
CREATE POLICY "Anyone can view project images"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can upload project images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own project images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'project-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their own project images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-images' 
  AND auth.role() = 'authenticated'
);

-- Create property_units (lots) table
CREATE TABLE public.property_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  unit_type TEXT NOT NULL,
  surface_area NUMERIC,
  price NUMERIC,
  status TEXT NOT NULL DEFAULT 'Disponible',
  floor TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, unit_number)
);

ALTER TABLE public.property_units ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view units of their projects"
  ON public.property_units FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = property_units.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create units in their projects"
  ON public.property_units FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = property_units.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update units in their projects"
  ON public.property_units FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = property_units.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete units in their projects"
  ON public.property_units FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = property_units.project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- Add unit_id to project_clients table (optional - for clients assigned to specific units)
ALTER TABLE public.project_clients
ADD COLUMN unit_id UUID REFERENCES public.property_units(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX idx_property_units_project_id ON public.property_units(project_id);
CREATE INDEX idx_project_clients_unit_id ON public.project_clients(unit_id);

-- Add trigger for property_units updated_at
CREATE TRIGGER update_property_units_updated_at
  BEFORE UPDATE ON public.property_units
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();