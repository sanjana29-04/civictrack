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
  const [activeCenter, setActiveCenter] = useState<[number, number]>([21.7679, 78.8718]);
  const [activeZoom, setActiveZoom] = useState<number>(5);

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const data = await incidentService.getMapMarkers();
        setMarkers(data);
        setFilteredMarkers(data);
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
    setActiveZoom(15);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
            <span>🇮🇳</span>
            SnapFix • Fixing Our India Together
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight flex items-center gap-2 font-display">
            <MapPin className="w-7 h-7 text-rose-500" />
            Pan-India Interactive Incident Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time geospatial intelligence of 26+ civic infrastructure issues across Indian cities. Fixing our India together.
          </p>
        </div>

        <Link
          to="/report"
          className="self-start sm:self-auto px-5 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-violet-600 hover:from-emerald-400 hover:to-violet-500 text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
        >
          + Snap & Report Here
        </Link>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 text-xs font-bold overflow-x-auto pb-1 scrollbar-none max-w-full">
          <button
            type="button"
            onClick={() => setSelectedStatus('ALL')}
            className={`px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
              selectedStatus === 'ALL' ? 'bg-navy-950 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Hotspots ({markers.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedStatus('OPEN')}
            className={`px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
              selectedStatus === 'OPEN' ? 'bg-violet-600 text-white shadow-sm' : 'bg-violet-50 text-violet-700 hover:bg-violet-100'
            }`}
          >
            Open / Triage
          </button>
          <button
            type="button"
            onClick={() => setSelectedStatus('ACTIVE')}
            className={`px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
              selectedStatus === 'ACTIVE' ? 'bg-amber-500 text-white shadow-sm' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            In Progress
          </button>
          <button
            type="button"
            onClick={() => setSelectedStatus('AWAITING')}
            className={`px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
              selectedStatus === 'AWAITING' ? 'bg-cyan-600 text-white shadow-sm' : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
            }`}
          >
            Citizen Verification
          </button>
          <button
            type="button"
            onClick={() => setSelectedStatus('CLOSED')}
            className={`px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
              selectedStatus === 'CLOSED' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Verified Fixed
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
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/30 font-medium"
          />
        </div>
      </div>

      {/* Main Map + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[560px] lg:h-[680px]">
        {/* Map View */}
        <div className="lg:col-span-2 min-h-[480px] sm:min-h-[540px] lg:h-full flex flex-col">
          {loading ? (
            <div className="h-full min-h-[480px] bg-slate-100 rounded-3xl flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            </div>
          ) : (
            <IncidentMap
              markers={filteredMarkers}
              center={activeCenter}
              zoom={activeZoom}
              height="100%"
            />
          )}
        </div>


        {/* Incident List Drawer */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm flex flex-col h-[480px] lg:h-full overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider font-display">
              Pan-India Hotspots ({filteredMarkers.length})
            </h3>
            <span className="text-[11px] text-violet-600 font-semibold">Tap to focus map</span>
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
                  className="p-3.5 rounded-2xl border border-slate-200/90 hover:border-violet-400 bg-white hover:bg-violet-50/40 transition-all cursor-pointer space-y-2 group shadow-2xs hover:shadow-md"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-slate-500">{m.incidentNumber}</span>
                    <PriorityBadge priority={m.priority} showIcon={false} />
                  </div>

                  <h4 className="text-xs font-bold text-navy-900 line-clamp-1 group-hover:text-violet-600 transition-colors font-display">
                    {m.title}
                  </h4>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <StatusBadge status={m.status} size="sm" />
                    <CategoryBadge category={m.category} />
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-slate-600 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60">
                      <span className="text-rose-500">🔥</span>
                      {m.supportCount} hype
                    </span>

                    <Link
                      to={`/incidents/${m.id}`}
                      className="text-violet-600 hover:text-violet-800 font-extrabold flex items-center gap-0.5"
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
