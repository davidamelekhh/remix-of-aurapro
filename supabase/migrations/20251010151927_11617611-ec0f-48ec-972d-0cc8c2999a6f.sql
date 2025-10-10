-- Add media fields to project_updates table
ALTER TABLE public.project_updates 
ADD COLUMN IF NOT EXISTS media_urls TEXT[];

-- Add comment to store the index
COMMENT ON COLUMN public.project_updates.media_urls IS 'Array of URLs for photos/videos attached to the update';