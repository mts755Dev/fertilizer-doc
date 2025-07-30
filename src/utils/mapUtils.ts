import mapboxgl from 'mapbox-gl';

// Get Mapbox access token from environment variable
// You'll need to get a free token from https://account.mapbox.com/
// and add it to your .env file as: VITE_MAPBOX_ACCESS_TOKEN=your_token_here
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example';

export interface ClinicLocation {
  id: string;
  name: string;
  address: string;
  cityZip: string;
  phone: string | null;
  coordinates?: [number, number]; // [longitude, latitude]
}

export interface MapConfig {
  center: [number, number]; // [longitude, latitude]
  zoom: number;
  style: string;
}

// Default map configuration for US fertility clinics
export const defaultMapConfig: MapConfig = {
  center: [-98.5795, 39.8283], // Center of USA
  zoom: 4,
  style: 'mapbox://styles/mapbox/light-v11'
};

// Function to extract coordinates from address using Mapbox Geocoding API
export async function geocodeAddress(address: string): Promise<[number, number] | null> {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}&country=US&types=address`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      return [longitude, latitude];
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Function to batch geocode multiple addresses
export async function geocodeClinicLocations(locations: ClinicLocation[]): Promise<ClinicLocation[]> {
  const geocodedLocations: ClinicLocation[] = [];
  
  for (const location of locations) {
    const fullAddress = `${location.address}, ${location.cityZip}`;
    const coordinates = await geocodeAddress(fullAddress);
    
    geocodedLocations.push({
      ...location,
      coordinates
    });
  }
  
  return geocodedLocations;
}

// Function to calculate map bounds from clinic locations
export function calculateMapBounds(locations: ClinicLocation[]): mapboxgl.LngLatBounds | null {
  const locationsWithCoordinates = locations.filter(loc => loc.coordinates);
  
  if (locationsWithCoordinates.length === 0) {
    return null;
  }
  
  const bounds = new mapboxgl.LngLatBounds();
  
  locationsWithCoordinates.forEach(location => {
    if (location.coordinates) {
      bounds.extend(location.coordinates);
    }
  });
  
  return bounds;
}

// Function to create a simple circular pin like in the screenshot
export function createSimplePin(): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  const markerEl = document.createElement('div');
  markerEl.className = 'simple-pin';
  markerEl.style.cssText = `
    cursor: pointer;
    pointer-events: auto;
    width: 16px;
    height: 16px;
    background-color: #2dd4bf;
    border: 2px solid #0d9488;
    border-radius: 50%;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: transform 0.2s ease;
    transform-origin: center center;
  `;
  
  // Add hover effect
  markerEl.addEventListener('mouseenter', () => {
    markerEl.style.transform = 'scale(1.1)';
  });
  
  markerEl.addEventListener('mouseleave', () => {
    markerEl.style.transform = 'scale(1)';
  });
  
  wrapper.appendChild(markerEl);
  return wrapper;
}

// Function to create a popup with clinic information
export function createClinicPopup(location: ClinicLocation): mapboxgl.Popup {
  const popupContent = document.createElement('div');
  popupContent.className = 'clinic-popup';
  popupContent.style.cssText = `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    max-width: 300px;
  `;
  
  popupContent.innerHTML = `
    <div style="padding: 16px;">
      <h3 style="font-weight: 700; font-size: 18px; margin-bottom: 12px; color: #111827;">${location.name}</h3>
      <div style="margin-bottom: 16px;">
        <p style="font-size: 14px; color: #374151; margin-bottom: 4px;">${location.address}</p>
        <p style="font-size: 14px; color: #374151; margin-bottom: 8px;">${location.cityZip}</p>
        ${location.phone ? `
          <div style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #374151;">
            <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            <span>${location.phone}</span>
          </div>
        ` : ''}
      </div>
      <button 
        class="open-maps-btn"
        style="width: 100%; background-color: #2563eb; color: white; font-size: 14px; font-weight: 500; padding: 8px 12px; border-radius: 6px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background-color 0.2s;"
        data-address="${location.address}, ${location.cityZip}"
        onmouseover="this.style.backgroundColor='#1d4ed8'"
        onmouseout="this.style.backgroundColor='#2563eb'"
      >
        <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
        </svg>
        <span>Open in Google Maps</span>
      </button>
    </div>
  `;
  
  // Add click event for the Google Maps button
  setTimeout(() => {
    const button = popupContent.querySelector('.open-maps-btn');
    if (button) {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const address = button.getAttribute('data-address');
        if (address) {
          window.open(
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
            '_blank'
          );
        }
      });
    }
  }, 100);
  
  return new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: false,
    maxWidth: '320px',
    className: 'clinic-popup-container',
    offset: 10
  }).setDOMContent(popupContent);
} 