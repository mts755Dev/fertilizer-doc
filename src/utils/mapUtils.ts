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
  popupContent.innerHTML = `
    <div class="p-4">
      <h3 class="font-bold text-lg mb-3 text-gray-900">${location.name}</h3>
      <div class="space-y-2 mb-4">
        <p class="text-sm text-gray-700">${location.address}</p>
        <p class="text-sm text-gray-700">${location.cityZip}</p>
        ${location.phone ? `
          <div class="flex items-center space-x-2 text-sm text-gray-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            <span>${location.phone}</span>
          </div>
        ` : ''}
      </div>
      <button 
        class="open-maps-btn w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
        data-address="${location.address}, ${location.cityZip}"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    className: 'clinic-popup-container'
  }).setDOMContent(popupContent);
} 