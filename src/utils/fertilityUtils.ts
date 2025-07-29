// Types for fertility clinic data
export interface FertilityClinicRaw {
  url: string;
  name: string;
  "clinic_sr:annual_cycles": string;
  "national_avg:annual_cycles": string;
  "clinic_sr:<35": string | null;
  "national_avg:<35": string;
  "clinic_sr:35-37": string | null;
  "national_avg:35-37": string;
  "clinic_sr:38-40": string | null;
  "national_avg:38-40": string;
  "clinic_sr:>40": string | null;
  "national_avg:>40": string;
  doctors: Array<{
    name: string;
    photo: string;
  }>;
  branches: Array<{
    name: string;
    street: string;
    "city-zip": string;
    phone: string | null;
  }>;
  description?: string;
}

export interface FertilityClinic extends FertilityClinicRaw {
  id: string;
  slug: string;
  annual_cycles: string;
}

// Process raw fertility data and add computed fields
export function processFertilityData(rawData: FertilityClinicRaw[]): FertilityClinic[] {
  return rawData.map((clinic, index) => {
    // Handle annual_cycles that might be "N/A" or "?"
    const annualCycles = clinic["clinic_sr:annual_cycles"] === "N/A" || clinic["clinic_sr:annual_cycles"] === "?" 
      ? "N/A" 
      : clinic["clinic_sr:annual_cycles"];

    return {
      ...clinic,
      id: `clinic-${index + 1}`,
      slug: clinic.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim(),
      annual_cycles: annualCycles,
    };
  });
}

// Utility functions for location-based filtering
export function getClinicsByState(clinics: FertilityClinic[], stateCode: string): FertilityClinic[] {
  return clinics.filter(clinic => 
    clinic.branches.some(branch => 
      branch["city-zip"].toLowerCase().includes(stateCode.toLowerCase())
    )
  );
}

export function getClinicsByCity(clinics: FertilityClinic[], city: string): FertilityClinic[] {
  return clinics.filter(clinic => 
    clinic.branches.some(branch => 
      branch["city-zip"].toLowerCase().includes(city.toLowerCase())
    )
  );
}

// Mapbox utilities
export interface ClinicLocation {
  name: string;
  street: string;
  cityZip: string;
  phone: string;
  coordinates?: [number, number];
}

export interface MapConfig {
  center: [number, number];
  zoom: number;
  style: string;
}

export const defaultMapConfig: MapConfig = {
  center: [-98.5795, 39.8283], // Center of US
  zoom: 4,
  style: 'mapbox://styles/mapbox/light-v11'
};

// Geocode an address using Mapbox
export async function geocodeAddress(address: string): Promise<[number, number] | null> {
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    console.warn('Mapbox access token not found');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${accessToken}&country=US`
    );
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return [lng, lat];
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Geocode clinic locations
export async function geocodeClinicLocations(clinics: FertilityClinic[]): Promise<ClinicLocation[]> {
  const locations: ClinicLocation[] = [];
  
  for (const clinic of clinics) {
    for (const branch of clinic.branches) {
      const fullAddress = `${branch.street}, ${branch["city-zip"]}`;
      const coordinates = await geocodeAddress(fullAddress);
      
      locations.push({
        name: branch.name,
        street: branch.street,
        cityZip: branch["city-zip"],
        phone: branch.phone,
        coordinates: coordinates || undefined
      });
    }
  }
  
  return locations;
}

// Calculate map bounds from clinic locations
export function calculateMapBounds(locations: ClinicLocation[]): MapConfig | null {
  const validLocations = locations.filter(loc => loc.coordinates);
  
  if (validLocations.length === 0) {
    return null;
  }
  
  const lngs = validLocations.map(loc => loc.coordinates![0]);
  const lats = validLocations.map(loc => loc.coordinates![1]);
  
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  
  const centerLng = (minLng + maxLng) / 2;
  const centerLat = (minLat + maxLat) / 2;
  
  return {
    center: [centerLng, centerLat],
    zoom: 10,
    style: 'mapbox://styles/mapbox/light-v11'
  };
}

// Create a simple pin element for Mapbox
export function createSimplePin(): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'simple-pin-wrapper';
  wrapper.style.cssText = `
    width: 30px;
    height: 30px;
    position: relative;
    cursor: pointer;
  `;

  const pin = document.createElement('div');
  pin.className = 'simple-pin';
  pin.style.cssText = `
    width: 30px;
    height: 30px;
    background: #3b82f6;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    position: relative;
    transition: all 0.3s ease;
  `;

  const inner = document.createElement('div');
  inner.style.cssText = `
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
  `;

  pin.appendChild(inner);
  wrapper.appendChild(pin);

  // Add hover effect
  wrapper.addEventListener('mouseenter', () => {
    pin.style.transform = 'rotate(-45deg) scale(1.1)';
    pin.style.background = '#2563eb';
  });

  wrapper.addEventListener('mouseleave', () => {
    pin.style.transform = 'rotate(-45deg) scale(1)';
    pin.style.background = '#3b82f6';
  });

  return wrapper;
}

// Create a popup for clinic information
export function createClinicPopup(clinic: FertilityClinic, branch: { name: string; street: string; cityZip: string; phone: string }): HTMLElement {
  const popup = document.createElement('div');
  popup.className = 'clinic-popup-container';
  popup.style.cssText = `
    max-width: 300px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  const content = document.createElement('div');
  content.className = 'clinic-popup';
  content.style.cssText = `
    background: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    border: 1px solid #e5e7eb;
  `;

  const title = document.createElement('h3');
  title.textContent = clinic.name;
  title.style.cssText = `
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
  `;

  const branchName = document.createElement('p');
  branchName.textContent = branch.name;
  branchName.style.cssText = `
    margin: 0 0 8px 0;
    font-size: 14px;
    color: #6b7280;
    font-weight: 500;
  `;

  const address = document.createElement('p');
  address.textContent = `${branch.street}, ${branch.cityZip}`;
  address.style.cssText = `
    margin: 0 0 8px 0;
    font-size: 13px;
    color: #6b7280;
    line-height: 1.4;
  `;

  const phone = document.createElement('p');
  phone.textContent = branch.phone;
  phone.style.cssText = `
    margin: 0 0 12px 0;
    font-size: 13px;
    color: #6b7280;
  `;

  const openMapsBtn = document.createElement('button');
  openMapsBtn.textContent = 'Open in Maps';
  openMapsBtn.className = 'open-maps-btn';
  openMapsBtn.style.cssText = `
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;
    width: 100%;
  `;

  openMapsBtn.addEventListener('mouseenter', () => {
    openMapsBtn.style.background = '#2563eb';
  });

  openMapsBtn.addEventListener('mouseleave', () => {
    openMapsBtn.style.background = '#3b82f6';
  });

  openMapsBtn.addEventListener('click', () => {
    const address = `${branch.street}, ${branch.cityZip}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
  });

  content.appendChild(title);
  content.appendChild(branchName);
  content.appendChild(address);
  content.appendChild(phone);
  content.appendChild(openMapsBtn);
  popup.appendChild(content);

  return popup;
} 