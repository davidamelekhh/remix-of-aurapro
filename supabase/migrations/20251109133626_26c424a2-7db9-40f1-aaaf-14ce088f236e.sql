-- Change order_index from integer to numeric to support decimal values for sub-milestones
ALTER TABLE public.project_milestones 
ALTER COLUMN order_index TYPE numeric;