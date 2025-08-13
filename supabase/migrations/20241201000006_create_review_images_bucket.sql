-- Create storage bucket for review images
-- This migration sets up a bucket with proper RLS policies for unauthenticated access

-- Create the review-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'review-images',
    'review-images',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security on the bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to view images (public bucket)
CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT USING (bucket_id = 'review-images');

-- Policy to allow anyone to upload images
CREATE POLICY "Allow uploads" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'review-images' AND
        (auth.role() = 'authenticated' OR auth.role() = 'anon')
    );

-- Policy to allow anyone to update images
CREATE POLICY "Allow updates" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'review-images' AND
        (auth.role() = 'authenticated' OR auth.role() = 'anon')
    );

-- Policy to allow anyone to delete images
CREATE POLICY "Allow deletes" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'review-images' AND
        (auth.role() = 'authenticated' OR auth.role() = 'anon')
    );

-- Create function to generate unique file names for review images
CREATE OR REPLACE FUNCTION generate_review_image_path(clinic_id BIGINT, file_name TEXT)
RETURNS TEXT AS $$
DECLARE
    timestamp_val TEXT;
    sanitized_name TEXT;
    file_extension TEXT;
    unique_path TEXT;
BEGIN
    -- Get current timestamp
    timestamp_val := to_char(now(), 'YYYYMMDD_HH24MISS');
    
    -- Extract file extension
    file_extension := substring(file_name from '\.([^.]*)$');
    IF file_extension IS NULL THEN
        file_extension := 'jpg'; -- default extension
    END IF;
    
    -- Sanitize file name (remove special characters, keep only alphanumeric and dots)
    sanitized_name := regexp_replace(file_name, '[^a-zA-Z0-9.]', '_', 'g');
    
    -- Generate unique path
    unique_path := 'clinic_' || clinic_id || '/' || timestamp_val || '_' || sanitized_name;
    
    RETURN unique_path;
END;
$$ LANGUAGE plpgsql;

-- Create function to clean up orphaned images when reviews are deleted
CREATE OR REPLACE FUNCTION cleanup_review_images()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete associated images when a review is deleted
    IF OLD.treatment_photos IS NOT NULL AND array_length(OLD.treatment_photos, 1) > 0 THEN
        -- Extract file paths from the treatment_photos array
        -- This is a simplified cleanup - in production you might want more sophisticated logic
        DELETE FROM storage.objects 
        WHERE bucket_id = 'review-images' 
        AND name = ANY(OLD.treatment_photos);
    END IF;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically clean up images when reviews are deleted
CREATE TRIGGER cleanup_review_images_trigger
    BEFORE DELETE ON public.clinic_reviews
    FOR EACH ROW
    EXECUTE FUNCTION cleanup_review_images();

-- Create function to validate image uploads
CREATE OR REPLACE FUNCTION validate_review_image()
RETURNS TRIGGER AS $$
BEGIN
    -- Check file size (5MB limit)
    IF NEW.metadata->>'size'::text::bigint > 5242880 THEN
        RAISE EXCEPTION 'File size exceeds 5MB limit';
    END IF;
    
    -- Check file type
    IF NEW.mime_type NOT IN ('image/jpeg', 'image/png', 'image/webp', 'image/gif') THEN
        RAISE EXCEPTION 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed';
    END IF;
    
    -- Ensure the file is in the review-images bucket
    IF NEW.bucket_id != 'review-images' THEN
        RAISE EXCEPTION 'File must be uploaded to review-images bucket';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate image uploads
CREATE TRIGGER validate_review_image_trigger
    BEFORE INSERT ON storage.objects
    FOR EACH ROW
    EXECUTE FUNCTION validate_review_image(); 