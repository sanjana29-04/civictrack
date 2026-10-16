import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Compass } from 'lucide-react';

interface Props {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lon: number) => void;
  height?: string;
}

const pickerIcon = L.divIcon({
  className: 'custom-picker-pin',
  html: `
    <div style="
      background-color: #e11d48;
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid white;
      box-shadow: 0 4px 10px rgba(0,0,0,0.4);
    ">
      <div style="
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const MapEventsHandler: React.FC<{ onChange: (lat: number, lon: number) => void }> = ({ onChange }) => {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const RecenterControl: React.FC<{ lat: number; lon: number }> = ({ lat, lon }) => {
  const map = useMap();
  const handleRecenter = (e: React.MouseEvent) => {
    e.preventDefault();
    map.setView([lat, lon], map.getZoom());
  };

  return (
    <button
      onClick={handleRecenter}
      className="absolute bottom-3 right-3 z-[1000] bg-white text-slate-700 hover:text-brand-600 p-2 rounded-xl shadow-md border border-slate-200 flex items-center gap-1.5 text-xs font-semibold"
      title="Center on selected marker"
    >
      <Compass className="w-4 h-4 text-brand-600" />
      Center Marker
    </button>
  );
};

export const LocationPicker: React.FC<Props> = ({
  latitude,
  longitude,
  onChange,
  height = '350px',
}) => {
  const [currentPos, setCurrentPos] = useState<[number, number]>([latitude, longitude]);

  const handlePositionChange = (lat: number, lon: number) => {
    const roundedLat = Math.round(lat * 10000) / 10000;
    const roundedLon = Math.round(lon * 10000) / 10000;
    setCurrentPos([roundedLat, roundedLon]);
    onChange(roundedLat, roundedLon);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handlePositionChange(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          alert('Could not access current location. Please click on the map to place the pin.');
        }
      );
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span className="flex items-center gap-1.5 font-medium">
          <MapPin className="w-4 h-4 text-brand-600" />
          Click anywhere on the map to pinpoint incident location:
        </span>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg border border-brand-200 transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" />
          Use GPS Location
        </button>
      </div>

      <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-slate-300 relative shadow-inner">
        <MapContainer
          center={[latitude, longitude]}
          zoom={14}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>, HERE, Garmin, USGS, OpenStreetMap contributors'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />
          <MapEventsHandler onChange={handlePositionChange} />
          <Marker
            position={currentPos}
            icon={pickerIcon}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                handlePositionChange(position.lat, position.lng);
              },
            }}
          />
          <RecenterControl lat={currentPos[0]} lon={currentPos[1]} />
        </MapContainer>
      </div>

      <div className="flex items-center gap-4 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-slate-700">
        <div>
          <span className="text-slate-400 mr-1">LAT:</span>
          <span className="font-semibold text-navy-900">{currentPos[0].toFixed(4)}</span>
        </div>
        <div>
          <span className="text-slate-400 mr-1">LON:</span>
          <span className="font-semibold text-navy-900">{currentPos[1].toFixed(4)}</span>
        </div>
        <div className="ml-auto text-[11px] text-slate-400 italic">
          (Draggable pin or click anywhere)
        </div>
      </div>
    </div>
  );
};
