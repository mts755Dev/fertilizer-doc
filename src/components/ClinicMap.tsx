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
    // Check if Mapbox token is available
    if (!mapboxgl.accessToken || mapboxgl.accessToken.includes('example')) {
      setMapError('Mapbox access token not configured. Please add VITE_MAPBOX_ACCESS_TOKEN to your .env file.');
      setIsLoading(false);
      return;
    }

    // Initialize map
    if (!mapContainer.current) return;

    try {
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
        console.error('Mapbox error:', e);
        setMapError('Failed to load map. Please check your internet connection.');
      });

      // Close popups when clicking elsewhere on the map
      map.current.on('click', () => {
        popups.current.forEach(popup => popup.remove());
        setSelectedLocation(null);
      });

    } catch (error) {
      console.error('Failed to initialize map:', error);
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
      
      setIsLoading(true);
      try {
        const geocoded = await geocodeClinicLocations(locations);
        setGeocodedLocations(geocoded);
      } catch (error) {
        console.error('Failed to geocode locations:', error);
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
    if (!map.current || geocodedLocations.length === 0 || mapError) return;

    // Clear existing markers and popups
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    popups.current = [];

    // Add new markers with popups
    geocodedLocations.forEach((location, index) => {
      if (location.coordinates) {
        const markerEl = createSimplePin();
        const popup = createClinicPopup(location);
        
        const marker = new mapboxgl.Marker({
          element: markerEl,
          anchor: 'center' // Back to center with proper wrapper
        })
          .setLngLat(location.coordinates)
          .addTo(map.current!);

        // Add click event to marker element
        markerEl.addEventListener('click', (e) => {
          e.stopPropagation();
          setSelectedLocation(location);
          
          // Remove all other popups first
          popups.current.forEach(p => p.remove());
          
          // Show this popup
          popup.addTo(map.current!);
        });

        // Also add click event to the marker itself as backup
        marker.getElement().addEventListener('click', (e) => {
          e.stopPropagation();
          setSelectedLocation(location);
          
          // Remove all other popups first
          popups.current.forEach(p => p.remove());
          
          // Show this popup
          popup.addTo(map.current!);
        });

        markers.current.push(marker);
        popups.current.push(popup);
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
    <div className={`space-y-4 ${className}`}>
      {/* Office Count Indicator */}
      {locations.length > 0 && (
        <div className="text-sm text-muted-foreground">
          This clinic has {locations.length} office{locations.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Map Container */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary" />
            <span>Clinic Locations</span>
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