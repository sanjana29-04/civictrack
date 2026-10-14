import React, { useState, useEffect } from 'react';
import { incidentService } from '../../services/incidentService';
import { IncidentMapMarker, IncidentCategory, IncidentStatus } from '../../types';
import { IncidentMap } from '../../components/map/IncidentMap';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CategoryBadge } from '../../components/common/CategoryBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { Link } from 'react-router-dom';
import { MapPin, Search, Filter, Loader2, ThumbsUp, ChevronRight } from 'lucide-react';

export const InteractiveMapPage: React.FC = () => {
  const [markers, setMarkers] = useState<IncidentMapMarker[]>([]);
  const [filteredMarkers, setFilteredMarkers] = useState<IncidentMapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [activeCenter, setActiveCenter] = useState<[number, number]>([12.9716, 77.5946]);

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const data = await incidentService.getMapMarkers();
        setMarkers(data);
        setFilteredMarkers(data);
        if (data.length > 0 && data[0].latitude && data[0].longitude) {
          setActiveCenter([data[0].latitude, data[0].longitude]);
        }
      } catch (err) {
        console.error('Failed to load map markers', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkers();
  }, []);

  useEffect(() => {
    let result = [...markers];

    if (selectedCategory !== 'ALL') {
      result = result.filter((m) => m.category === selectedCategory);
    }

    if (selectedStatus !== 'ALL') {
      if (selectedStatus === 'OPEN') {
        result = result.filter((m) => ['SUBMITTED', 'UNDER_REVIEW', 'CONFIRMED'].includes(m.status));
      } else if (selectedStatus === 'ACTIVE') {
        result = result.filter((m) => ['IN_PROGRESS', 'ASSIGNED'].includes(m.status));
      } else if (selectedStatus === 'AWAITING') {
        result = result.filter((m) => m.status === 'RESOLVED_AWAITING_VERIFICATION');
      } else if (selectedStatus === 'CLOSED') {
        result = result.filter((m) => m.status === 'CLOSED');
      }
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.incidentNumber.toLowerCase().includes(q)
      );
    }

    setFilteredMarkers(result);
  }, [selectedCategory, selectedStatus, search, markers]);

  const handleSelectIncident = (marker: IncidentMapMarker) => {
    setActiveCenter([marker.latitude, marker.longitude]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-7 h-7 text-brand-600" />
            Interactive Incident Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time geospatial intelligence of civic infrastructure issues across neighborhoods.
          </p>
        </div>

        <Link
          to="/report"
          className="self-start sm:self-auto px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          + Report Problem Here
        </Link>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setSelectedStatus('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedStatus === 'ALL' ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Incidents ({markers.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedStatus('OPEN')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedStatus === 'OPEN' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            Open / Triage
          </button>
          <button
            type="button"
            onClick={() => setSelectedStatus('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedStatus === 'ACTIVE' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Work in Progress
          </button>
          <button
            type="button"
            onClick={() => setSelectedStatus('AWAITING')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedStatus === 'AWAITING' ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
            }`}
          >
            Awaiting Verification
          </button>
          <button
            type="button"
            onClick={() => setSelectedStatus('CLOSED')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedStatus === 'CLOSED' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Resolved & Verified
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search map markers..."
            className="w-full text-xs pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Main Map + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[650px]">
        {/* Map View */}
        <div className="lg:col-span-2 h-full">
          {loading ? (
            <div className="h-full bg-slate-100 rounded-2xl flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            </div>
          ) : (
            <IncidentMap
              markers={filteredMarkers}
              center={activeCenter}
              zoom={13}
              height="100%"
            />
          )}
        </div>

        {/* Incident List Drawer */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider">
              Filtered Incidents ({filteredMarkers.length})
            </h3>
            <span className="text-[11px] text-slate-400">Click to center map</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredMarkers.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No incidents match current map filters.
              </div>
            ) : (
              filteredMarkers.map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleSelectIncident(m)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-brand-300 bg-white hover:bg-brand-50/30 transition-all cursor-pointer space-y-1.5 group"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-slate-500">{m.incidentNumber}</span>
                    <PriorityBadge priority={m.priority} showIcon={false} />
                  </div>

                  <h4 className="text-xs font-bold text-navy-900 line-clamp-1 group-hover:text-brand-600 transition-colors">
                    {m.title}
                  </h4>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <StatusBadge status={m.status} size="sm" />
                    <CategoryBadge category={m.category} />
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-slate-600">
                      <ThumbsUp className="w-3 h-3 text-brand-600" />
                      {m.supportCount}
                    </span>

                    <Link
                      to={`/incidents/${m.id}`}
                      className="text-brand-600 hover:text-brand-800 font-semibold flex items-center gap-0.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Report
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
