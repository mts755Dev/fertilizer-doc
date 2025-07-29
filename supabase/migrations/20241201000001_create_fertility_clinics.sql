-- Create fertility clinics table
CREATE TABLE fertility_clinics (
  id SERIAL PRIMARY KEY,
  clinic_id VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  url TEXT,
  annual_cycles VARCHAR(50),
  national_avg_annual_cycles VARCHAR(50),
  
  -- Success rates by age group
  clinic_sr_under35 VARCHAR(20),
  national_avg_under35 VARCHAR(20),
  clinic_sr_35to37 VARCHAR(20),
  national_avg_35to37 VARCHAR(20),
  clinic_sr_38to40 VARCHAR(20),
  national_avg_38to40 VARCHAR(20),
  clinic_sr_over40 VARCHAR(20),
  national_avg_over40 VARCHAR(20),
  
  -- Doctors and branches as JSON
  doctors JSONB,
  branches JSONB,
  description TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_fertility_clinics_slug ON fertility_clinics(slug);
CREATE INDEX idx_fertility_clinics_name ON fertility_clinics(name);
CREATE INDEX idx_fertility_clinics_branches ON fertility_clinics USING GIN(branches);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_fertility_clinics_updated_at 
    BEFORE UPDATE ON fertility_clinics 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 