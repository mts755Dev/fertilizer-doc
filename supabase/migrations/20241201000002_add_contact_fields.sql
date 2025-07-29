-- Add contact fields to fertility_clinics table
ALTER TABLE fertility_clinics 
ADD COLUMN contact_phone VARCHAR(50),
ADD COLUMN contact_email VARCHAR(255); 