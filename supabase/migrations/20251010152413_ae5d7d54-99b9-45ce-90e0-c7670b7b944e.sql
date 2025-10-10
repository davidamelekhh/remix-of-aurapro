-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('pro', 'client');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Pros can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'pro'));

-- Update profiles table to add email
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Update handle_new_user function to assign role based on email domain
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email);
  
  -- Assign role (first user is pro, others are clients by default)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    CASE 
      WHEN (SELECT COUNT(*) FROM auth.users) = 1 THEN 'pro'::app_role
      ELSE 'client'::app_role
    END
  );
  
  RETURN NEW;
END;
$$;

-- Update RLS policies to use roles
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
CREATE POLICY "Pros can view own projects"
  ON public.projects FOR SELECT
  USING (
    auth.uid() = owner_id 
    OR public.has_role(auth.uid(), 'pro')
  );

CREATE POLICY "Clients can view assigned projects"
  ON public.projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.project_clients pc
      JOIN public.clients c ON c.id = pc.client_id
      JOIN public.profiles p ON p.email = c.email
      WHERE p.id = auth.uid()
      AND pc.project_id = projects.id
    )
  );

-- Update clients RLS to allow pros to manage
DROP POLICY IF EXISTS "Users can create own clients" ON public.clients;
CREATE POLICY "Pros can manage clients"
  ON public.clients FOR ALL
  USING (public.has_role(auth.uid(), 'pro'))
  WITH CHECK (public.has_role(auth.uid(), 'pro'));