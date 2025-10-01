-- Add rich customization fields to hip_configurations
ALTER TABLE hip_configurations
ADD COLUMN IF NOT EXISTS custom_theme jsonb DEFAULT '{
  "backgroundColor": "hsl(var(--background))",
  "cardBackground": "hsl(var(--card))",
  "primaryColor": "hsl(var(--primary))",
  "secondaryColor": "hsl(var(--secondary))",
  "accentColor": "hsl(var(--accent))",
  "textColor": "hsl(var(--foreground))",
  "borderColor": "hsl(var(--border))",
  "borderRadius": "0.5rem",
  "sectionSpacing": "2rem"
}'::jsonb,
ADD COLUMN IF NOT EXISTS banner_image_url text,
ADD COLUMN IF NOT EXISTS agent_avatar_url text,
ADD COLUMN IF NOT EXISTS custom_css text;

-- Create storage buckets for user uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('hip-banners', 'hip-banners', true),
       ('hip-avatars', 'hip-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can upload their own banners" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own banners" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own banners" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view banners" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

-- Create storage policies for banner uploads
CREATE POLICY "Users can upload their own banners"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'hip-banners' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own banners"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'hip-banners' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own banners"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'hip-banners' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view banners"
ON storage.objects FOR SELECT
USING (bucket_id = 'hip-banners');

-- Create storage policies for avatar uploads
CREATE POLICY "Users can upload their own avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'hip-avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'hip-avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'hip-avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'hip-avatars');