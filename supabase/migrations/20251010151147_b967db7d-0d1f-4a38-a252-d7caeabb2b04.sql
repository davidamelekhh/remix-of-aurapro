-- Create project_updates table for timeline/progress updates
CREATE TABLE public.project_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  update_type TEXT NOT NULL DEFAULT 'general',
  progress_percentage INTEGER,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.project_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view updates of their projects"
  ON public.project_updates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_updates.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create updates in their projects"
  ON public.project_updates FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_updates.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their project updates"
  ON public.project_updates FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_updates.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their project updates"
  ON public.project_updates FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_updates.project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- Create storage bucket for project documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-documents', 'project-documents', false);

-- Storage policies for project documents
CREATE POLICY "Users can view their project documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'project-documents'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can upload project documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-documents'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their project documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'project-documents'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their project documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-documents'
  AND auth.role() = 'authenticated'
);

-- Create project_documents table for document metadata
CREATE TABLE public.project_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  description TEXT,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view documents of their projects"
  ON public.project_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_documents.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload documents to their projects"
  ON public.project_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_documents.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete documents from their projects"
  ON public.project_documents FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_documents.project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- Create project_messages table for chat
CREATE TABLE public.project_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.project_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages of their projects"
  ON public.project_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_messages.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to their projects"
  ON public.project_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_messages.project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- Add indexes for better performance
CREATE INDEX idx_project_updates_project_id ON public.project_updates(project_id);
CREATE INDEX idx_project_documents_project_id ON public.project_documents(project_id);
CREATE INDEX idx_project_messages_project_id ON public.project_messages(project_id);
CREATE INDEX idx_project_messages_created_at ON public.project_messages(created_at);

-- Add triggers for updated_at
CREATE TRIGGER update_project_updates_updated_at
  BEFORE UPDATE ON public.project_updates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_documents_updated_at
  BEFORE UPDATE ON public.project_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_messages;