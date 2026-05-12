-- ============================================
-- MIGRATION: Add interactive columns to notices
-- Run this in your Supabase SQL Editor
-- ============================================

-- Add poll column (JSONB to store poll data)
ALTER TABLE notices ADD COLUMN IF NOT EXISTS poll JSONB DEFAULT NULL;

-- Add links column (JSONB array of {label, url})
ALTER TABLE notices ADD COLUMN IF NOT EXISTS links JSONB DEFAULT NULL;

-- Add is_survey flag
ALTER TABLE notices ADD COLUMN IF NOT EXISTS is_survey BOOLEAN DEFAULT FALSE;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'notices' 
ORDER BY ordinal_position;
