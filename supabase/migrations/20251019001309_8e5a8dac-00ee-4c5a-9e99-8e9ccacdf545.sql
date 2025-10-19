-- Fix 1: Restrict contact_submissions to admins only
DROP POLICY IF EXISTS "Only authenticated users can view submissions" ON contact_submissions;

CREATE POLICY "Only admins can view contact submissions"
ON contact_submissions FOR SELECT
USING (has_role(auth.uid(), 'pro'::app_role));

-- Fix 2: Secure project-documents storage bucket with ownership checks
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Users can view their project documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload documents to their projects" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete documents from their projects" ON storage.objects;

-- Create secure policies with project ownership verification
CREATE POLICY "Users can view their own project documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'project-documents'
  AND (
    -- Promoters can see their project docs
    (storage.foldername(name))[1]::uuid IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
    )
    OR
    -- Clients can see assigned project docs
    (storage.foldername(name))[1]::uuid IN (
      SELECT project_id FROM project_clients 
      WHERE client_id = get_current_user_client_id()
    )
  )
);

CREATE POLICY "Users can upload documents to their own projects"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-documents'
  AND (storage.foldername(name))[1]::uuid IN (
    SELECT id FROM projects WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Users can delete documents from their own projects"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-documents'
  AND (storage.foldername(name))[1]::uuid IN (
    SELECT id FROM projects WHERE owner_id = auth.uid()
  )
);