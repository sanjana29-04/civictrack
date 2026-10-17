import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { incidentService } from '../../services/incidentService';
import { Incident, IncidentCategory, IncidentPriority, IncidentStatus, PageResponse } from '../../types';
import { IncidentCard } from '../../components/incidents/IncidentCard';
import { Search, Filter, RotateCcw, AlertCircle, Loader2 } from 'lucide-react';

export const ExploreIncidentsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [pageData, setPageData] = useState<PageResponse<Incident> | null>(null);
  const [loading, setLoading] = useState(true);

  // Filter states from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState<IncidentCategory | ''>(
    (searchParams.get('category') as IncidentCategory) || ''
  );
  const [status, setStatus] = useState<IncidentStatus | ''>(
    (searchParams.get('status') as IncidentStatus) || ''
  );
  const [priority, setPriority] = useState<IncidentPriority | ''>(
    (searchParams.get('priority') as IncidentPriority) || ''
  );
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page') || 0));

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const data = await incidentService.explore({
        search: search.trim() || undefined,
        category: category || undefined,
        status: status || undefined,
        priority: priority || undefined,
        page: currentPage,
        size: 12,
        sortBy: 'createdAt',
        direction: 'desc',
      });
      setIncidents(data.content);
      setPageData(data);
    } catch (err) {
      console.error('Failed to load incidents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [category, status, priority, currentPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchIncidents();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setStatus('');
    setPriority('');
    setCurrentPage(0);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
          <span>🇮🇳</span>
          SnapFix • Fixing Our India Together
        </div>
        <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight font-display">
          Explore Public Incidents
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Search, filter, and track verified civic infrastructure reports across all neighborhoods.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keywords, incident #, road name, or landmark..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as IncidentCategory);
              setCurrentPage(0);
            }}
            className="text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
          >
            <option value="">All Infrastructure Categories</option>
            <option value="ROADS_POTHOLES">Roads & Potholes</option>
            <option value="GARBAGE_SANITATION">Garbage & Sanitation</option>
            <option value="STREETLIGHTS">Streetlights</option>
            <option value="DRAINAGE_WATERLOGGING">Drainage & Waterlogging</option>
            <option value="WATER_SUPPLY_LEAKAGE">Water Supply & Leakage</option>
            <option value="FOOTPATHS_ACCESSIBILITY">Footpaths & Accessibility</option>
            <option value="PUBLIC_PROPERTY_DAMAGE">Public Property Damage</option>
            <option value="OTHER">Other Issues</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as IncidentStatus);
              setCurrentPage(0);
            }}
            className="text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
          >
            <option value="">All Lifecycle Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLUTION_PROPOSED">Resolution Proposed</option>
            <option value="RESOLVED_AWAITING_VERIFICATION">Resolved — Awaiting Verification</option>
            <option value="REOPENED">Reopened</option>
            <option value="CLOSED">Closed & Verified</option>
          </select>

          {/* Priority Dropdown */}
          <select
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value as IncidentPriority);
              setCurrentPage(0);
            }}
            className="text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
          >
            <option value="">All Priority Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Reset Filters button */}
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-navy-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        </div>
      </div>

      {/* Incidents Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
          <p className="text-xs font-medium text-slate-500">Loading civic incident records...</p>
        </div>
      ) : incidents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 max-w-lg mx-auto">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-navy-900">No Incidents Found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No civic reports match your selected criteria. Try adjusting the category, status, or search keywords.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-2 px-4 py-2 text-xs font-bold text-brand-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {incidents.length} of {pageData?.totalElements || incidents.length} reports
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {incidents.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>

          {/* Pagination */}
          {pageData && pageData.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                type="button"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Previous
              </button>

              <span className="text-xs font-medium text-slate-600 px-3">
                Page {currentPage + 1} of {pageData.totalPages}
              </span>

              <button
                type="button"
                disabled={pageData.last}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
