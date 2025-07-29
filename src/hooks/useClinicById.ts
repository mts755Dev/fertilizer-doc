
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Clinic } from './useClinicData';
import { calculateMatchScore, findBestMatch } from '@/utils/clinicUtils';

export const useClinicById = (clinicId: number) => {
  return useQuery({
    queryKey: ['clinic', clinicId],
    queryFn: async () => {
      console.log(`Fetching clinic with ID: ${clinicId}`);
      const { data, error } = await supabase
        .from('hair_clinics')
        .select('*')
        .eq('id', clinicId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching clinic:', error);
        throw error;
      }
      
      console.log('Fetched clinic:', data);
      return data as Clinic | null;
    },
    enabled: !!clinicId,
  });
};

export const useClinicBySlug = (clinicSlug: string) => {
  return useQuery({
    queryKey: ['clinic', 'slug', clinicSlug],
    queryFn: async () => {
      console.log(`Fetching clinic with slug: ${clinicSlug}`);
      const { data, error } = await supabase
        .from('hair_clinics')
        .select('*')
        .eq('slug', clinicSlug)
        .maybeSingle();
      if (error) {
        console.error('Error fetching clinic by slug:', error);
        throw error;
      }
      console.log('Fetched clinic by slug:', data);
      return data as Clinic | null;
    },
    enabled: !!clinicSlug,
  });
};
