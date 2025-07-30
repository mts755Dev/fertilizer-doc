-- Create consultation_submissions table
CREATE TABLE IF NOT EXISTS public.consultation_submissions (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT,
    clinic_slug TEXT NOT NULL,
    clinic_name TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_consultation_submissions_email ON public.consultation_submissions(email);

-- Create index on clinic_slug for filtering by clinic
CREATE INDEX IF NOT EXISTS idx_consultation_submissions_clinic_slug ON public.consultation_submissions(clinic_slug);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_consultation_submissions_created_at ON public.consultation_submissions(created_at DESC);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_consultation_submissions_status ON public.consultation_submissions(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.consultation_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all consultation submissions
CREATE POLICY "Allow authenticated users to read consultation submissions" ON public.consultation_submissions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow anyone to insert consultation submissions
CREATE POLICY "Allow anyone to insert consultation submissions" ON public.consultation_submissions
    FOR INSERT WITH CHECK (true);

-- Create policy to allow authenticated users to update consultation submissions
CREATE POLICY "Allow authenticated users to update consultation submissions" ON public.consultation_submissions
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_consultation_submissions_updated_at 
    BEFORE UPDATE ON public.consultation_submissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 