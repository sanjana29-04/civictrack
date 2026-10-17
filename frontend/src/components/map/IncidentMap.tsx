import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { IncidentMapMarker } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { Link } from 'react-router-dom';
import { ExternalLink, ThumbsUp } from 'lucide-react';

interface Props {
  markers: IncidentMapMarker[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  selectedIncidentId?: string;
}

import { POPULAR_CITIES } from '../../data/indiaIncidents';

// Custom map icon generator based on incident status and priority with vibrant Gen-Z styling
const createPinIcon = (status: string, priority: string) => {
  let gradient = 'linear-gradient(135deg, #6366f1, #8b5cf6)'; // electric violet
  let pulseGlow = 'rgba(139, 92, 246, 0.4)';

  if (priority === 'CRITICAL') {
    gradient = 'linear-gradient(135deg, #f43f5e, #dc2626)'; // neon red/rose
    pulseGlow = 'rgba(244, 63, 94, 0.6)';
  } else if (status === 'IN_PROGRESS') {
    gradient = 'linear-gradient(135deg, #f59e0b, #ea580c)'; // sunset amber
    pulseGlow = 'rgba(245, 158, 11, 0.5)';
  } else if (status === 'RESOLVED_AWAITING_VERIFICATION') {
    gradient = 'linear-gradient(135deg, #06b6d4, #0d9488)'; // cyber cyan
    pulseGlow = 'rgba(6, 182, 212, 0.5)';
  } else if (status === 'CLOSED') {
    gradient = 'linear-gradient(135deg, #10b981, #059669)'; // neon emerald
    pulseGlow = 'rgba(16, 185, 129, 0.5)';
  } else if (status === 'REOPENED') {
    gradient = 'linear-gradient(135deg, #ec4899, #be185d)'; // hot pink
    pulseGlow = 'rgba(236, 72, 153, 0.6)';
  }

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="position: relative; width: 32px; height: 32px;">
        <div style="
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: ${pulseGlow};
          filter: blur(4px);
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        "></div>
        <div style="
          background: ${gradient};
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffffff;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);
          position: relative;
          z-index: 2;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background: #ffffff;
            border-radius: 50%;
            transform: rotate(45deg);
            box-shadow: 0 0 4px rgba(255,255,255,0.8);
          "></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Component to handle map view reset when center/zoom change
const ChangeView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1 });
  }, [center, zoom, map]);
  return null;
};

export const IncidentMap: React.FC<Props> = ({
  markers,
  center = [21.7679, 78.8718], // Default to All-India view
  zoom = 5,
  height = '520px',
  selectedIncidentId,
}) => {
  const [currentCenter, setCurrentCenter] = React.useState<[number, number]>(center);
  const [currentZoom, setCurrentZoom] = React.useState<number>(zoom);
  const [activeCity, setActiveCity] = React.useState<string>('All India');

  const handleCitySelect = (city: typeof POPULAR_CITIES[0]) => {
    setActiveCity(city.name);
    setCurrentCenter(city.coords);
    setCurrentZoom(city.zoom);
  };

  return (
    <div className="space-y-3">
      {/* City Quick-Jump Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
        <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider pl-1 shrink-0 flex items-center gap-1">
          <span>⚡ Pan-India:</span>
        </span>
        {POPULAR_CITIES.map((city) => {
          const isActive = activeCity === city.name;
          return (
            <button
              key={city.name}
              type="button"
              onClick={() => handleCitySelect(city)}
              className={`px-3 py-1.5 rounded-full shrink-0 flex items-center gap-1.5 transition-all text-xs cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 text-white shadow-md shadow-violet-500/25 font-bold scale-105'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90 shadow-2xs'
              }`}
            >
              <span>{city.emoji}</span>
              <span>{city.name}</span>
            </button>
          );
        })}
      </div>

      <div style={{ height }} className="w-full rounded-3xl overflow-hidden border border-slate-200 shadow-md relative z-0">
        <MapContainer
          center={currentCenter}
          zoom={currentZoom}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <ChangeView center={currentCenter} zoom={currentZoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>, HERE, Garmin, USGS, OpenStreetMap contributors'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />

          {markers.map((marker) => {
            if (!marker.latitude || !marker.longitude) return null;

            return (
              <Marker
                key={marker.id}
                position={[marker.latitude, marker.longitude]}
                icon={createPinIcon(marker.status, marker.priority)}
              >
                <Popup className="civic-popup" minWidth={270} maxWidth={320}>
                  <div className="p-1 space-y-2.5 font-sans">
                    {marker.primaryPhotoUrl && (
                      <div className="relative h-32 overflow-hidden rounded-xl">
                        <img
                          src={marker.primaryPhotoUrl}
                          alt={marker.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <StatusBadge status={marker.status} size="sm" />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-1 text-[11px]">
                      <span className="font-mono font-bold text-slate-500">{marker.incidentNumber}</span>
                      <PriorityBadge priority={marker.priority} showIcon={false} />
                    </div>

                    <h4 className="text-xs font-bold text-navy-900 line-clamp-2 leading-snug">
                      {marker.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <CategoryBadge category={marker.category} />
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                      <span className="text-slate-600 flex items-center gap-1 font-semibold">
                        <span className="text-rose-500">🔥</span>
                        {marker.supportCount} supporters
                      </span>

                      <Link
                        to={`/incidents/${marker.id}`}
                        className="inline-flex items-center gap-1 text-xs font-extrabold text-violet-600 hover:text-violet-800"
                      >
                        Details
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};
