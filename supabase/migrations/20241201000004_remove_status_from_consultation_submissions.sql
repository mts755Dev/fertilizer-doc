-- Remove status column from consultation_submissions table
ALTER TABLE public.consultation_submissions DROP COLUMN IF EXISTS status;

-- Drop the status index since we're removing the column
DROP INDEX IF EXISTS idx_consultation_submissions_status; 