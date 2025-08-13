# Storage Bucket Setup Guide

## Overview
This guide explains how to set up the storage buckets for review images and blog images in the fertilizer-doc project.

## Storage Buckets

### 1. Review Images Bucket (`review-images`)
- **Purpose**: Store treatment photos uploaded with reviews
- **Access**: Public (unauthenticated users can upload/delete/edit)
- **File Size Limit**: 5MB
- **Allowed Types**: JPEG, PNG, WebP, GIF
- **Path Structure**: `clinic_{clinic_id}/{timestamp}_{filename}`

### 2. Blog Images Bucket (`blog-images`)
- **Purpose**: Store images uploaded in blog posts via rich text editor
- **Access**: Public (unauthenticated users can upload/delete/edit)
- **File Size Limit**: 5MB
- **Allowed Types**: JPEG, PNG, WebP, GIF
- **Path Structure**: `blog-images/{timestamp}_{random}.{extension}`

## Setup Instructions

### Step 1: Run Database Migrations
```bash
# Run all migrations including storage setup
npx supabase db push
```

### Step 2: Verify Bucket Creation
1. Go to your Supabase Dashboard
2. Navigate to Storage section
3. Verify that both buckets are created:
   - `review-images`
   - `blog-images`

### Step 3: Test Upload Functionality
1. **Review Images**: Try uploading photos in the "Leave a Review" modal
2. **Blog Images**: Try uploading images in the blog post editor

## RLS Policies

### Review Images Bucket Policies
- ✅ **Public Access**: Anyone can view images
- ✅ **Upload**: Authenticated and anonymous users can upload
- ✅ **Update**: Authenticated and anonymous users can update
- ✅ **Delete**: Authenticated and anonymous users can delete

### Blog Images Bucket Policies
- ✅ **Public Access**: Anyone can view images
- ✅ **Upload**: Authenticated and anonymous users can upload
- ✅ **Update**: Authenticated and anonymous users can update
- ✅ **Delete**: Authenticated and anonymous users can delete

## Database Functions

### 1. `generate_review_image_path(clinic_id, file_name)`
- Generates unique file paths for review images
- Includes timestamp and sanitized filename
- Organizes by clinic ID

### 2. `cleanup_review_images()`
- Automatically deletes orphaned images when reviews are deleted
- Triggered before review deletion

### 3. `validate_review_image()`
- Validates file size (5MB limit)
- Validates file type (images only)
- Ensures files are uploaded to correct bucket

## Usage Examples

### Uploading Review Images
```typescript
// In LeaveReviewModal.tsx
const fileName = `review-photos/${clinicId}/${Date.now()}-${file.name}`;
const { data, error } = await supabase.storage
  .from('review-images')
  .upload(fileName, file);
```

### Uploading Blog Images
```typescript
// In RichTextEditor.tsx
const filePath = `blog-images/${fileName}`;
const { error: uploadError } = await supabase.storage
  .from('blog-images')
  .upload(filePath, file);
```

## Security Considerations

1. **File Type Validation**: Only image files are allowed
2. **File Size Limits**: 5MB maximum per file
3. **Path Sanitization**: File names are sanitized to prevent injection
4. **Automatic Cleanup**: Orphaned files are automatically deleted
5. **Public Access**: Images are publicly accessible (required for review display)

## Troubleshooting

### Common Issues

1. **"Bucket not found" error**
   - Ensure migrations have been run
   - Check bucket name spelling in code

2. **"Permission denied" error**
   - Verify RLS policies are in place
   - Check if bucket is public

3. **"File too large" error**
   - Check file size (5MB limit)
   - Compress image if needed

4. **"Invalid file type" error**
   - Ensure file is JPEG, PNG, WebP, or GIF
   - Check file extension

### Manual Bucket Creation
If migrations fail, you can manually create buckets in Supabase Dashboard:

1. Go to Storage section
2. Click "Create bucket"
3. Set bucket ID: `review-images` or `blog-images`
4. Enable public access
5. Set file size limit to 5MB
6. Add allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`

## Environment Variables
No additional environment variables are required for storage functionality. The Supabase client configuration handles authentication automatically. 