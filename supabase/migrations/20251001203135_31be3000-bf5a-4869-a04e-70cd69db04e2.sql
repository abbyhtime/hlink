-- Add publishing state columns to hip_configurations
ALTER TABLE hip_configurations 
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_unpublished_changes BOOLEAN DEFAULT true;

-- Set existing configurations as published to avoid breaking current users
UPDATE hip_configurations 
SET is_published = true, has_unpublished_changes = false 
WHERE is_public = true;