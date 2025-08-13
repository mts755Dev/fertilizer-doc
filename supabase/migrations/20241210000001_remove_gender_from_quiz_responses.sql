-- Remove gender column from quiz_responses table
-- This migration removes the gender field that is no longer needed

-- Remove the gender column from quiz_responses table
ALTER TABLE public.quiz_responses 
DROP COLUMN IF EXISTS gender;

-- Note: The gender column had a default value of 'mr' and was VARCHAR(10)
-- This change simplifies the quiz response data structure 