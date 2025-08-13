-- Enhance clinic_reviews table with missing columns for admin functionality
-- This migration adds columns needed for review approval/rejection and enhanced review data

-- Add new columns for enhanced review information
ALTER TABLE public.clinic_reviews 
ADD COLUMN IF NOT EXISTS treatment_photos TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS treatment_cost DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS treatment_duration_hours INTEGER,
ADD COLUMN IF NOT EXISTS recovery_time_days INTEGER,
ADD COLUMN IF NOT EXISTS pain_level INTEGER CHECK (pain_level >= 1 AND pain_level <= 10),
ADD COLUMN IF NOT EXISTS results_satisfaction INTEGER CHECK (results_satisfaction >= 1 AND results_satisfaction <= 5),
ADD COLUMN IF NOT EXISTS would_recommend BOOLEAN,
ADD COLUMN IF NOT EXISTS follow_up_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approved_by VARCHAR(255),
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clinic_reviews_treatment_photos ON public.clinic_reviews USING GIN (treatment_photos);
CREATE INDEX IF NOT EXISTS idx_clinic_reviews_treatment_cost ON public.clinic_reviews(treatment_cost);
CREATE INDEX IF NOT EXISTS idx_clinic_reviews_results_satisfaction ON public.clinic_reviews(results_satisfaction);
CREATE INDEX IF NOT EXISTS idx_clinic_reviews_approved_at ON public.clinic_reviews(approved_at);
CREATE INDEX IF NOT EXISTS idx_clinic_reviews_approved_by ON public.clinic_reviews(approved_by);

-- Create function to get clinic statistics
CREATE OR REPLACE FUNCTION get_clinic_stats(clinic_id_param BIGINT)
RETURNS TABLE(
    total_reviews INTEGER,
    avg_rating DECIMAL,
    avg_cost DECIMAL,
    avg_duration_hours DECIMAL,
    avg_recovery_days DECIMAL,
    recommendation_rate DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_reviews,
        ROUND(AVG(rating), 1) as avg_rating,
        ROUND(AVG(treatment_cost), 2) as avg_cost,
        ROUND(AVG(treatment_duration_hours), 1) as avg_duration_hours,
        ROUND(AVG(recovery_time_days), 1) as avg_recovery_days,
        ROUND((COUNT(CASE WHEN would_recommend = true THEN 1 END) * 100.0 / COUNT(*)), 1) as recommendation_rate
    FROM public.clinic_reviews
    WHERE clinic_id = clinic_id_param AND status = 'approved';
END;
$$ language 'plpgsql';

-- Create RLS policies for clinic_reviews table
ALTER TABLE public.clinic_reviews ENABLE ROW LEVEL SECURITY;

-- Policy to allow all users to read approved reviews
CREATE POLICY "Allow read approved reviews" ON public.clinic_reviews
    FOR SELECT USING (status = 'approved');

-- Policy to allow authenticated users to insert reviews
CREATE POLICY "Allow insert reviews" ON public.clinic_reviews
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Policy to allow admin users to update reviews (for approval/rejection)
CREATE POLICY "Allow admin update reviews" ON public.clinic_reviews
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy to allow admin users to delete reviews
CREATE POLICY "Allow admin delete reviews" ON public.clinic_reviews
    FOR DELETE USING (auth.role() = 'authenticated'); 