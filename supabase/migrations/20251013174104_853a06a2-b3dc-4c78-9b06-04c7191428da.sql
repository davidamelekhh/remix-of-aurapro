-- Add start_date and end_date to project_updates for milestone scheduling
ALTER TABLE public.project_updates 
ADD COLUMN start_date date,
ADD COLUMN end_date date;

-- Add status field for color coding
ALTER TABLE public.project_updates
ADD COLUMN status text DEFAULT 'on_time' CHECK (status IN ('on_time', 'delayed', 'overdue'));