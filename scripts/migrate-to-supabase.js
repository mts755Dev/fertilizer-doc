import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.log('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to process fertility clinic data
function processFertilityData(rawData) {
  return rawData.map((clinic, index) => {
    const annualCycles = clinic["clinic_sr:annual_cycles"] === "N/A" || clinic["clinic_sr:annual_cycles"] === "?" 
      ? "N/A" 
      : clinic["clinic_sr:annual_cycles"];

    const slug = clinic.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    return {
      clinic_id: `clinic-${index + 1}`,
      slug: slug,
      name: clinic.name,
      url: clinic.url,
      annual_cycles: annualCycles,
      national_avg_annual_cycles: clinic["national_avg:annual_cycles"],
      
      // Success rates
      clinic_sr_under35: clinic["clinic_sr:<35"],
      national_avg_under35: clinic["national_avg:<35"],
      clinic_sr_35to37: clinic["clinic_sr:35-37"],
      national_avg_35to37: clinic["national_avg:35-37"],
      clinic_sr_38to40: clinic["clinic_sr:38-40"],
      national_avg_38to40: clinic["national_avg:38-40"],
      clinic_sr_over40: clinic["clinic_sr:>40"],
      national_avg_over40: clinic["national_avg:>40"],
      
      // JSON fields
      doctors: clinic.doctors,
      branches: clinic.branches,
      description: clinic.description || null
    };
  });
}

// Main migration function
async function migrateData() {
  try {
    console.log('Starting migration to Supabase...');
    
    // Read the JSONL file
    const jsonlPath = path.join(__dirname, '../public/fertilityiq.jsonl');
    const fileContent = fs.readFileSync(jsonlPath, 'utf8');
    const lines = fileContent.trim().split('\n');
    
    console.log(`Found ${lines.length} clinics in JSONL file`);
    
    // Parse JSONL data
    const rawData = lines.map(line => {
      try {
        return JSON.parse(line);
      } catch (error) {
        console.warn('Failed to parse JSON line:', line);
        return null;
      }
    }).filter(Boolean);
    
    console.log(`Successfully parsed ${rawData.length} clinics`);
    
    // Process the data
    const processedData = processFertilityData(rawData);
    
    console.log('Inserting data into Supabase...');
    
    // Insert data in batches to avoid hitting limits
    const batchSize = 50;
    let insertedCount = 0;
    
    for (let i = 0; i < processedData.length; i += batchSize) {
      const batch = processedData.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('fertility_clinics')
        .insert(batch);
      
      if (error) {
        console.error('Error inserting batch:', error);
        throw error;
      }
      
      insertedCount += batch.length;
      console.log(`Inserted ${insertedCount}/${processedData.length} clinics`);
    }
    
    console.log('✅ Migration completed successfully!');
    console.log(`Total clinics inserted: ${insertedCount}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateData(); 