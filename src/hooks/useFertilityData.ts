import { useQuery } from '@tanstack/react-query';
import { FertilityClinic, FertilityClinicRaw, processFertilityData } from '@/utils/fertilityUtils';

// Load and parse the fertility data from JSONL file
async function loadFertilityData(): Promise<FertilityClinic[]> {
  try {
    console.log('Loading fertility data...');
    // Read the JSONL file from the public directory
    const response = await fetch('/fertilityiq.jsonl');
    if (!response.ok) {
      throw new Error(`Failed to fetch fertility data: ${response.statusText}`);
    }
    
    const text = await response.text();
    console.log('Raw text length:', text.length);
    const lines = text.trim().split('\n');
    console.log('Number of lines:', lines.length);
    
    const rawData: FertilityClinicRaw[] = lines.map(line => {
      try {
        return JSON.parse(line);
      } catch (error) {
        console.warn('Failed to parse JSON line:', line);
        return null;
      }
    }).filter(Boolean) as FertilityClinicRaw[];
    
    console.log('Parsed raw data length:', rawData.length);
    if (rawData.length > 0) {
      console.log('Sample clinic:', rawData[0]);
    }
    
    // Process the raw data
    const processedData = processFertilityData(rawData);
    console.log('Processed data length:', processedData.length);
    return processedData;
  } catch (error) {
    console.error('Error loading fertility data:', error);
    throw error;
  }
}

export const useFertilityData = () => {
  return useQuery({
    queryKey: ['fertility-clinics'],
    queryFn: loadFertilityData,
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export const useFertilityClinicBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['fertility-clinic', 'slug', slug],
    queryFn: async () => {
      const clinics = await loadFertilityData();
      return clinics.find(clinic => clinic.slug === slug) || null;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export const useFertilityClinicsByLocation = (location: string) => {
  return useQuery({
    queryKey: ['fertility-clinics', 'location', location],
    queryFn: async () => {
      const clinics = await loadFertilityData();
      return clinics.filter(clinic => 
        clinic.branches.some(branch => 
          branch.cityZip.toLowerCase().includes(location.toLowerCase()) ||
          branch.name.toLowerCase().includes(location.toLowerCase())
        )
      );
    },
    enabled: !!location,
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export const useFertilityClinicsByState = (state: string) => {
  return useQuery({
    queryKey: ['fertility-clinics', 'state', state],
    queryFn: async () => {
      const clinics = await loadFertilityData();
      return clinics.filter(clinic => 
        clinic.branches.some(branch => 
          branch.cityZip.toLowerCase().includes(state.toLowerCase())
        )
      );
    },
    enabled: !!state,
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}; 