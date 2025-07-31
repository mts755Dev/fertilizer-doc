import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, ExternalLink, AlertCircle } from 'lucide-react';
import { 
  ClinicLocation, 
  defaultMapConfig, 
  geocodeClinicLocations, 
  calculateMapBounds,
  createSimplePin,
  createClinicPopup
} from '@/utils/mapUtils';
import 'mapbox-gl/dist/mapbox-gl.css';

// Add custom CSS for popups
const popupStyles = `
  .mapboxgl-popup {
    z-index: 1000;
  }
  .mapboxgl-popup-content {
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    border: none;
    padding: 0;
  }
  .mapboxgl-popup-tip {
    border-top-color: white;
  }
  .clinic-popup-content {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  .mapboxgl-popup-close-button {
    font-size: 20px !important;
    font-weight: bold !important;
    color: #6b7280 !important;
    background: white !important;
    border: none !important;
    border-radius: 50% !important;
    width: 30px !important;
    height: 30px !important;
    line-height: 30px !important;
    text-align: center !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  }
  .mapboxgl-popup-close-button:hover {
    background: #f3f4f6 !important;
    color: #374151 !important;
    transform: scale(1.1) !important;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = popupStyles;
  document.head.appendChild(styleSheet);
}

interface ClinicMapProps {
  locations: ClinicLocation[];
  clinicName: string;
  className?: string;
}

export const ClinicMap = ({ locations, clinicName, className = '' }: ClinicMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const popups = useRef<mapboxgl.Popup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [geocodedLocations, setGeocodedLocations] = useState<ClinicLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<ClinicLocation | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    console.log('ClinicMap: Initializing map...');
    console.log('ClinicMap: Mapbox token:', mapboxgl.accessToken ? 'Present' : 'Missing');
    
    // Check if Mapbox token is available
    if (!mapboxgl.accessToken || mapboxgl.accessToken.includes('example')) {
      const errorMsg = 'Mapbox access token not configured. Please add VITE_MAPBOX_ACCESS_TOKEN to your .env file.';
      console.error('ClinicMap:', errorMsg);
      setMapError(errorMsg);
      setIsLoading(false);
      return;
    }

    // Initialize map
    if (!mapContainer.current) {
      console.error('ClinicMap: Map container not found');
      return;
    }

    try {
      console.log('ClinicMap: Creating map instance...');
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: defaultMapConfig.style,
        center: defaultMapConfig.center,
        zoom: defaultMapConfig.zoom,
        attributionControl: false
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add fullscreen control
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

      // Handle map errors
      map.current.on('error', (e) => {
        console.error('ClinicMap: Mapbox error:', e);
        setMapError('Failed to load map. Please check your internet connection.');
      });

      // Close popups when clicking elsewhere on the map
      map.current.on('click', () => {
        console.log('ClinicMap: Map clicked, closing popups');
        popups.current.forEach(popup => popup.remove());
        setSelectedLocation(null);
      });

      console.log('ClinicMap: Map initialized successfully');

    } catch (error) {
      console.error('ClinicMap: Failed to initialize map:', error);
      setMapError('Failed to initialize map. Please check your Mapbox configuration.');
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    // Geocode locations when they change
    const geocodeLocations = async () => {
      if (mapError) return;
      
      console.log('ClinicMap: Geocoding locations...', locations);
      setIsLoading(true);
      try {
        const geocoded = await geocodeClinicLocations(locations);
        console.log('ClinicMap: Geocoded locations:', geocoded);
        setGeocodedLocations(geocoded);
      } catch (error) {
        console.error('ClinicMap: Failed to geocode locations:', error);
        setGeocodedLocations(locations);
      } finally {
        setIsLoading(false);
      }
    };

    if (locations.length > 0) {
      geocodeLocations();
    }
  }, [locations, mapError]);

  useEffect(() => {
    // Add markers when geocoded locations are available
    if (!map.current || geocodedLocations.length === 0 || mapError) {
      console.log('ClinicMap: Skipping marker creation - map:', !!map.current, 'locations:', geocodedLocations.length, 'error:', !!mapError);
      return;
    }

    console.log('ClinicMap: Adding markers...', geocodedLocations);

    // Clear existing markers and popups
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    popups.current = [];

    // Add new markers with popups
    geocodedLocations.forEach((location, index) => {
      if (location.coordinates) {
        console.log('ClinicMap: Creating marker for location:', location.name, 'at coordinates:', location.coordinates);
        
        // Create popup content
        const popupContent = `
          <div style="padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 300px;">
            <h3 style="font-weight: 700; font-size: 18px; margin-bottom: 12px; color: #111827;">${location.name}</h3>
            <div style="margin-bottom: 16px;">
              <p style="font-size: 14px; color: #374151; margin-bottom: 4px;">${location.address}</p>
              <p style="font-size: 14px; color: #374151; margin-bottom: 8px;">${location.cityZip}</p>
              ${location.phone ? `
                
                <a 
                  href="tel:${location.phone.replace(/\s+/g, '')}"
                  style="width: 100%; background-color: #2563eb; color: white; font-size: 14px; font-weight: 500; padding: 8px 12px; border-radius: 6px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background-color 0.2s; text-decoration: none;"
                  onmouseover="this.style.backgroundColor='#1d4ed8'"
                  onmouseout="this.style.backgroundColor='#2563eb'"
                >
                  <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span>Call ${location.phone}</span>
                </a>
              ` : ''}
            </div>
          </div>
        `;

        // Create popup
        const popup = new mapboxgl.Popup({
          closeButton: true,
          closeOnClick: false,
          maxWidth: '320px',
          offset: 10
        }).setHTML(popupContent);

        const markerEl = createSimplePin();
        
        const marker = new mapboxgl.Marker({
          element: markerEl,
          anchor: 'center'
        })
          .setLngLat(location.coordinates)
          .setPopup(popup)
          .addTo(map.current!);

        // Add click event to marker element
        markerEl.addEventListener('click', (e) => {
          console.log('ClinicMap: Marker clicked:', location.name);
          e.stopPropagation();
          setSelectedLocation(location);
          
          // Close all other popups first
          popups.current.forEach(p => p.remove());
          
          // Show this popup
          popup.addTo(map.current!);
          
          // Debug: Log popup state
          console.log('ClinicMap: Popup added to map for:', location.name);
          console.log('ClinicMap: Popup element:', popup.getElement());
        });

        // Also add click event to the marker itself as backup
        marker.getElement().addEventListener('click', (e) => {
          console.log('ClinicMap: Marker backup click:', location.name);
          e.stopPropagation();
          setSelectedLocation(location);
          
          // Close all other popups first
          popups.current.forEach(p => p.remove());
          
          // Show this popup
          popup.addTo(map.current!);
        });

        markers.current.push(marker);
        popups.current.push(popup);
        
        console.log('ClinicMap: Marker added successfully for:', location.name);
      } else {
        console.warn('ClinicMap: No coordinates for location:', location.name);
      }
    });

    // Fit map to show all markers
    const bounds = calculateMapBounds(geocodedLocations);
    if (bounds && geocodedLocations.length > 1) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    } else if (geocodedLocations.length === 1 && geocodedLocations[0].coordinates) {
      map.current.setCenter(geocodedLocations[0].coordinates);
      map.current.setZoom(12);
    }

    console.log('ClinicMap: All markers added successfully');

  }, [geocodedLocations, mapError]);

  // Fallback view when map is not available
  if (mapError) {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Office Count Indicator */}
        {locations.length > 0 && (
          <div className="text-sm text-muted-foreground">
            This clinic has {locations.length} office{locations.length !== 1 ? 's' : ''}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Clinic Locations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
              <AlertCircle className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">{mapError}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Get a free Mapbox token from{' '}
                  <a 
                    href="https://account.mapbox.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://account.mapbox.com/
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fallback Location List */}
        <Card>
          <CardHeader>
            <CardTitle>All Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {locations.map((location, index) => (
                <div
                  key={`${location.name}-${index}`}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">
                        {location.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {location.address}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {location.cityZip}
                      </p>
                      {location.phone && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span>{location.phone}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Open in Google Maps
                          const address = `${location.address}, ${location.cityZip}`;
                          window.open(
                            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
                            '_blank'
                          );
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Office Count Header - Make it bigger */}
      {locations.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            This clinic has {locations.length} office{locations.length !== 1 ? 's' : ''}
          </h2>
        </div>
      )}

      {/* Clinic Addresses List First */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary" />
            <span>Clinic Addresses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {locations.map((location, index) => (
              <div key={`${location.name}-${index}`} className="flex items-start space-x-4">
                {/* Location Icon */}
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                
                {/* Location Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-foreground mb-1">
                    {location.name}
                  </h4>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">
                      {location.address}
                    </p>
                    <p className="text-muted-foreground">
                      {location.cityZip}
                    </p>
                  </div>
                  {location.phone && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-3">
                      <Phone className="w-4 h-4" />
                      <span>{location.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Map Container - Now below addresses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary" />
            <span>Map View</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative">
            <div 
              ref={mapContainer} 
              className="w-full h-96 rounded-b-lg"
              style={{ minHeight: '400px' }}
            />
            
            {isLoading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-b-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Loading map...</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 