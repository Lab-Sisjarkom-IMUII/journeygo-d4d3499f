import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';

interface Location {
  name: string;
  coordinates: [number, number]; // [lng, lat]
  description?: string;
}

interface MapViewProps {
  locations: Location[];
  center?: [number, number];
  zoom?: number;
}

const MapView = ({ locations, center, zoom = 10 }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('mapbox_api_key') || '';
  });
  const [showInput, setShowInput] = useState<boolean>(false);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) return; // Initialize map only once

    try {
      // Get Mapbox token from state or environment
      const mapboxToken = apiKey || import.meta.env.VITE_MAPBOX_API_KEY;
      
      if (!mapboxToken) {
        setShowInput(true);
        setMapError('Mapbox API Key belum dikonfigurasi');
        return;
      }

      mapboxgl.accessToken = mapboxToken;

      // Calculate center from locations if not provided
      const mapCenter = center || (locations.length > 0 
        ? locations[0].coordinates 
        : [106.8456, -6.2088]); // Default to Jakarta

      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: mapCenter,
        zoom: zoom,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add markers for each location
      locations.forEach((location) => {
        if (!map.current) return;

        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = 'hsl(30, 30%, 41%)';
        el.style.border = '3px solid white';
        el.style.cursor = 'pointer';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

        // Create popup
        const popup = new mapboxgl.Popup({ offset: 35 }).setHTML(
          `<div style="padding: 8px;">
            <h3 style="font-weight: bold; margin-bottom: 4px; color: hsl(30, 30%, 41%);">${location.name}</h3>
            ${location.description ? `<p style="font-size: 14px; color: hsl(30, 20%, 45%);">${location.description}</p>` : ''}
          </div>`
        );

        // Add marker to map
        new mapboxgl.Marker(el)
          .setLngLat(location.coordinates)
          .setPopup(popup)
          .addTo(map.current);
      });

      // Fit map to show all markers if multiple locations
      if (locations.length > 1) {
        const bounds = new mapboxgl.LngLatBounds();
        locations.forEach((location) => {
          bounds.extend(location.coordinates);
        });
        map.current.fitBounds(bounds, { padding: 50 });
      }

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Gagal memuat peta. Periksa koneksi internet Anda.');
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [locations, center, zoom, apiKey]);

  const handleSaveApiKey = (key: string) => {
    localStorage.setItem('mapbox_api_key', key);
    setApiKey(key);
    setShowInput(false);
    setMapError(null);
    // Reload page to reinitialize map
    window.location.reload();
  };

  if (mapError && showInput) {
    return (
      <Card className="p-6 space-y-4">
        <div className="text-center space-y-2">
          <p className="text-destructive font-semibold">⚠️ {mapError}</p>
          <p className="text-sm text-muted-foreground">
            Dapatkan token dari{' '}
            <a 
              href="https://mapbox.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Masukkan Mapbox Public Token..."
            className="flex-1 px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                handleSaveApiKey(e.currentTarget.value.trim());
              }
            }}
          />
          <button
            onClick={(e) => {
              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
              if (input?.value.trim()) {
                handleSaveApiKey(input.value.trim());
              }
            }}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Simpan
          </button>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-lg">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default MapView;
