-- Allow unauthenticated access to storage buckets
-- Run these commands in Supabase SQL Editor to enable public access

-- Enable Row Level Security on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to view images (public access)
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

-- If you also have a blog-images bucket, add these policies too:
-- Policy to allow anyone to view blog images
CREATE POLICY "Public Access Blog Images" ON storage.objects
    FOR SELECT USING (bucket_id = 'blog-images');

-- Policy to allow anyone to upload blog images
CREATE POLICY "Allow blog uploads" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'blog-images' AND
        (auth.role() = 'authenticated' OR auth.role() = 'anon')
    );

-- Policy to allow anyone to update blog images
CREATE POLICY "Allow blog updates" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'blog-images' AND
        (auth.role() = 'authenticated' OR auth.role() = 'anon')
    );

-- Policy to allow anyone to delete blog images
CREATE POLICY "Allow blog deletes" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'blog-images' AND
        (auth.role() = 'authenticated' OR auth.role() = 'anon')
    );

-- Make sure the buckets are set to public
UPDATE storage.buckets 
SET public = true 
WHERE id IN ('review-images', 'blog-images'); 