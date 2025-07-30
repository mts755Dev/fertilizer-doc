import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type FertilityClinic = Database['public']['Tables']['fertility_clinics']['Row'];

// Transform Supabase data to match the expected interface
function transformClinicData(clinic: FertilityClinic) {
  return {
    id: clinic.clinic_id,
    slug: clinic.slug,
    name: clinic.name,
    url: clinic.url,
    contact_phone: clinic.contact_phone,
    contact_email: clinic.contact_email,
    annual_cycles: clinic.annual_cycles || "N/A",
    "clinic_sr:annual_cycles": clinic.annual_cycles || "N/A",
    "national_avg:annual_cycles": clinic.national_avg_annual_cycles || "N/A",
    
    // Success rates
    "clinic_sr:<35": clinic.clinic_sr_under35,
    "national_avg:<35": clinic.national_avg_under35 || "N/A",
    "clinic_sr:35-37": clinic.clinic_sr_35to37,
    "national_avg:35-37": clinic.national_avg_35to37 || "N/A",
    "clinic_sr:38-40": clinic.clinic_sr_38to40,
    "national_avg:38-40": clinic.national_avg_38to40 || "N/A",
    "clinic_sr:>40": clinic.clinic_sr_over40,
    "national_avg:>40": clinic.national_avg_over40 || "N/A",
    
    // JSON fields
    doctors: clinic.doctors as Array<{ name: string; photo: string }> || [],
    branches: clinic.branches as Array<{ name: string; street: string; "city-zip": string; phone: string | null }> || [],
    description: clinic.description
  };
}

// Fetch all fertility clinics
export function useFertilityData() {
  return useQuery({
    queryKey: ['fertility-clinics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fertility_clinics')
        .select('*')
        .order('name');

      if (error) {
        throw new Error(`Failed to fetch fertility clinics: ${error.message}`);
      }

      return data.map(transformClinicData);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Fetch clinic by slug
export function useFertilityClinicBySlug(slug: string) {
  return useQuery({
    queryKey: ['fertility-clinic', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fertility_clinics')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        throw new Error(`Failed to fetch clinic: ${error.message}`);
      }

      return transformClinicData(data);
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Fetch clinics by state
export function useFertilityClinicsByState(stateCode: string) {
  return useQuery({
    queryKey: ['fertility-clinics-by-state', stateCode],
    queryFn: async () => {
      // Use PostgreSQL JSONB query to search within branches
      const { data, error } = await supabase
        .from('fertility_clinics')
        .select('*')
        .contains('branches', [{ "city-zip": { $ilike: `%${stateCode}%` } }])
        .order('name');

      if (error) {
        throw new Error(`Failed to fetch clinics by state: ${error.message}`);
      }

      return data.map(transformClinicData);
    },
    enabled: !!stateCode,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Search clinics
export function useSearchFertilityClinics(searchTerm: string) {
  return useQuery({
    queryKey: ['fertility-clinics-search', searchTerm],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fertility_clinics')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,clinic_id.ilike.%${searchTerm}%`)
        .order('name');

      if (error) {
        throw new Error(`Failed to search clinics: ${error.message}`);
      }

      return data.map(transformClinicData);
    },
    enabled: !!searchTerm && searchTerm.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
} 