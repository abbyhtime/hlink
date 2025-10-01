-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create executive_agents table
CREATE TABLE IF NOT EXISTS public.executive_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  gender TEXT,
  appearance JSONB DEFAULT '{}',
  personality TEXT DEFAULT 'professional',
  voice TEXT DEFAULT 'alloy',
  capabilities JSONB DEFAULT '[]',
  context JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.executive_agents ENABLE ROW LEVEL SECURITY;

-- Agent policies
CREATE POLICY "Users can view their own agent"
  ON public.executive_agents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own agent"
  ON public.executive_agents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agent"
  ON public.executive_agents FOR UPDATE
  USING (auth.uid() = user_id);

-- Create hip_configurations table (hTime Inquiry Pages)
CREATE TABLE IF NOT EXISTS public.hip_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT false,
  show_calendar BOOLEAN DEFAULT true,
  show_chatbot BOOLEAN DEFAULT true,
  profile_description TEXT,
  brand_colors JSONB DEFAULT '{}',
  custom_domain TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.hip_configurations ENABLE ROW LEVEL SECURITY;

-- HIP Configuration policies
CREATE POLICY "Users can view their own hip config"
  ON public.hip_configurations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own hip config"
  ON public.hip_configurations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hip config"
  ON public.hip_configurations FOR UPDATE
  USING (auth.uid() = user_id);

-- Public can view public hip configurations
CREATE POLICY "Anyone can view public hip configs"
  ON public.hip_configurations FOR SELECT
  USING (is_public = true);

-- Public can view public profiles
CREATE POLICY "Anyone can view public profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.hip_configurations
      WHERE hip_configurations.user_id = profiles.id
      AND hip_configurations.is_public = true
    )
  );

-- Public can view agents for public profiles
CREATE POLICY "Anyone can view agents for public profiles"
  ON public.executive_agents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.hip_configurations
      WHERE hip_configurations.user_id = executive_agents.user_id
      AND hip_configurations.is_public = true
    )
  );

-- Create agent_memory table for contextual mesh layer
CREATE TABLE IF NOT EXISTS public.agent_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.executive_agents(id) ON DELETE CASCADE,
  memory_type TEXT NOT NULL,
  content JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agent_memory ENABLE ROW LEVEL SECURITY;

-- Agent memory policies
CREATE POLICY "Users can view their agent memory"
  ON public.agent_memory FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.executive_agents
      WHERE executive_agents.id = agent_memory.agent_id
      AND executive_agents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their agent memory"
  ON public.agent_memory FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.executive_agents
      WHERE executive_agents.id = agent_memory.agent_id
      AND executive_agents.user_id = auth.uid()
    )
  );

-- Create trigger for profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON public.executive_agents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hip_updated_at
  BEFORE UPDATE ON public.hip_configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();