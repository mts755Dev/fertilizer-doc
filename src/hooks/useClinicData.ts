
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Clinic {
  id: number;
  clinic_name: string;
  doctor_name: string | null;
  description: string | null;
  country: string | null;
  state_province: string | null;
  city: string | null;
  price_range: string | null;
  video_consultation: boolean | null;
  languages: string[] | null;
  clinic_url: string | null;
  created_at: string | null;
  updated_at: string | null;
  slug: string; // added slug property
  hero_image_url?: string;
  results_images?: string[];
  contact_email?: string;
  contact_phone?: string;
  doctors?: { name: string; position: string }[];
}

export const useClinicData = () => {
  return useQuery({
    queryKey: ['clinics'],
    queryFn: async () => {
      console.log('Fetching clinics from Supabase...');
      const { data, error } = await supabase
        .from('hair_clinics')
        .select('*')
        .order('clinic_name');
      if (error) {
        console.error('Error fetching clinics:', error);
        throw error;
      }
      // Ensure all clinics have slug, hero_image_url, and results_images fields
      const safeData = (data || []).map((c: Partial<Clinic>) => ({
        ...c,
        slug: c.slug || '',
        hero_image_url: c.hero_image_url || '',
        results_images: c.results_images || [],
      }));
      console.log('Fetched clinics:', safeData);
      return safeData as Clinic[];
    },
  });
};

export const useClinicsByCountry = (country: string) => {
  return useQuery({
    queryKey: ['clinics', 'country', country],
    queryFn: async () => {
      console.log(`Fetching clinics for country: ${country}`);
      const countryName = country.replace(/-/g, ' ');
      console.log(`Converted country name: ${countryName}`);
      const { data, error } = await supabase
        .from('hair_clinics')
        .select('*')
        .ilike('country', `%${countryName}%`)
        .order('clinic_name');
      if (error) {
        console.error('Error fetching clinics by country:', error);
        throw error;
      }
      const safeData = (data || []).map((c: Partial<Clinic>) => ({
        ...c,
        slug: c.slug || '',
        hero_image_url: c.hero_image_url || '',
        results_images: c.results_images || [],
      }));
      console.log(`Fetched clinics for ${countryName}:`, safeData);
      return safeData as Clinic[];
    },
    enabled: !!country,
  });
};

export const useClinicsByCity = (city: string) => {
  return useQuery({
    queryKey: ['clinics', 'city', city],
    queryFn: async () => {
      console.log(`Fetching clinics for city: ${city}`);
      const cityName = city.replace(/-/g, ' ');
      console.log(`Converted city name: ${cityName}`);
      const { data, error } = await supabase
        .from('hair_clinics')
        .select('*')
        .ilike('city', `%${cityName}%`)
        .order('clinic_name');
      if (error) {
        console.error('Error fetching clinics by city:', error);
        throw error;
      }
      const safeData = (data || []).map((c: Partial<Clinic>) => ({
        ...c,
        slug: c.slug || '',
        hero_image_url: c.hero_image_url || '',
        results_images: c.results_images || [],
      }));
      console.log(`Fetched clinics for ${cityName}:`, safeData);
      return safeData as Clinic[];
    },
    enabled: !!city,
  });
};
