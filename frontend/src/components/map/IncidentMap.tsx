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

// Custom map icon generator based on incident status and priority
const createPinIcon = (status: string, priority: string) => {
  let bgColor = '#1e5aee'; // default brand
  if (status === 'IN_PROGRESS') bgColor = '#d97706';
  else if (status === 'RESOLVED_AWAITING_VERIFICATION') bgColor = '#0d9488';
  else if (status === 'CLOSED') bgColor = '#059669';
  else if (status === 'REOPENED') bgColor = '#e11d48';
  else if (priority === 'CRITICAL') bgColor = '#dc2626';

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background-color: ${bgColor};
        width: 28px;
        height: 28px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

// Component to handle map view reset when center/markers change
const ChangeView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export const IncidentMap: React.FC<Props> = ({
  markers,
  center = [12.9716, 77.5946], // Default Bangalore / Metro coordinates
  zoom = 13,
  height = '500px',
  selectedIncidentId,
}) => {
  const effectiveCenter = markers.length > 0 && !center ? [markers[0].latitude, markers[0].longitude] as [number, number] : center;

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
      <MapContainer
        center={effectiveCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <ChangeView center={effectiveCenter} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
              <Popup className="civic-popup" minWidth={260} maxWidth={320}>
                <div className="p-1 space-y-2">
                  {marker.primaryPhotoUrl && (
                    <img
                      src={marker.primaryPhotoUrl}
                      alt={marker.title}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                  )}

                  <div className="flex items-center justify-between gap-1 text-[11px]">
                    <span className="font-bold text-slate-500">{marker.incidentNumber}</span>
                    <PriorityBadge priority={marker.priority} showIcon={false} />
                  </div>

                  <h4 className="text-xs font-bold text-navy-900 line-clamp-2 leading-snug">
                    {marker.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <StatusBadge status={marker.status} size="sm" />
                    <CategoryBadge category={marker.category} />
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                    <span className="text-slate-500 flex items-center gap-1 font-medium">
                      <ThumbsUp className="w-3.5 h-3.5 text-brand-600" />
                      {marker.supportCount} supporters
                    </span>

                    <Link
                      to={`/incidents/${marker.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800"
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
  );
};
