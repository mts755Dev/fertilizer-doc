
export const generateClinicSlug = (clinicName: string): string => {
  return clinicName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

export const getClinicDetailUrl = (clinicName: string): string => {
  const slug = generateClinicSlug(clinicName);
  return `/en/clinic/${slug}`;
};

// New function to calculate match score for clinic names
export const calculateMatchScore = (clinicName: string, searchSlug: string): number => {
  const clinicSlug = generateClinicSlug(clinicName);
  const normalizedSearch = searchSlug.toLowerCase();
  
  // Exact match gets highest score
  if (clinicSlug === normalizedSearch) {
    return 100;
  }
  
  // Check if clinic slug starts with search slug
  if (clinicSlug.startsWith(normalizedSearch)) {
    return 90;
  }
  
  // Check if search slug is contained in clinic slug
  if (clinicSlug.includes(normalizedSearch)) {
    return 80;
  }
  
  // Calculate similarity based on common words
  const clinicWords = clinicSlug.split('-');
  const searchWords = normalizedSearch.split('-');
  const commonWords = searchWords.filter(word => clinicWords.includes(word));
  
  if (commonWords.length > 0) {
    return (commonWords.length / searchWords.length) * 70;
  }
  
  return 0;
};

// Function to find best matching clinic from multiple results
export const findBestMatch = (clinics: any[], searchSlug: string): any | null => {
  if (!clinics || clinics.length === 0) return null;
  if (clinics.length === 1) return clinics[0];
  
  // Score each clinic and find the best match
  const scoredClinics = clinics.map(clinic => ({
    clinic,
    score: calculateMatchScore(clinic.clinic_name, searchSlug)
  }));
  
  // Sort by score (highest first), then by name length (shorter first for exact matches)
  scoredClinics.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.clinic.clinic_name.length - b.clinic.clinic_name.length;
  });
  
  return scoredClinics[0]?.clinic || null;
};
