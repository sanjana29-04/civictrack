import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { CivicAnalytics } from '../../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  Layers,
  MapPin,
  ShieldCheck,
  Loader2,
  TrendingUp,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<CivicAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await analyticsService.getDashboardAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load civic analytics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!analytics) return null;

  const COLORS = ['#1e5aee', '#10b981', '#f59e0b', '#06b6d4', '#6366f1', '#ec4899', '#8b5cf6', '#64748b'];

  const categoryChartData = analytics.categoryDistribution.map((c) => ({
    name: c.displayName.split(' ')[0], // short name
    fullName: c.displayName,
    count: c.count,
    percentage: c.percentage,
  }));

  const statusChartData = analytics.statusDistribution
    .filter((s) => s.count > 0)
    .map((s) => ({
      name: s.displayName,
      value: s.count,
    }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4" />
          Civic Intelligence & Transparency
        </div>
        <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">
          Municipal Accountability Analytics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Real-time metrics, resolution confirmation rates, and recurring problem concentration analysis.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500">Total Tracked Issues</span>
          <span className="text-3xl font-extrabold text-navy-900 block">{analytics.totalIncidents}</span>
          <span className="text-[11px] text-slate-400">All neighborhood reports</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-emerald-700">Citizen Confirmation Rate</span>
          <span className="text-3xl font-extrabold text-emerald-600 block">
            {analytics.resolutionConfirmationRatePercent}%
          </span>
          <span className="text-[11px] text-slate-400">Community verified satisfactory</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-brand-700">Avg. Resolution Duration</span>
          <span className="text-3xl font-extrabold text-brand-600 block">
            {analytics.averageResolutionDays} days
          </span>
          <span className="text-[11px] text-slate-400">From submission to completion</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-indigo-700">Duplicate Tickets Consolidated</span>
          <span className="text-3xl font-extrabold text-indigo-600 block">
            {analytics.duplicateMergedCount}
          </span>
          <span className="text-[11px] text-slate-400">Unified with audit trail</span>
        </div>
      </div>

      {/* Charts Section: Category Bar Chart & Status Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-600" />
            Infrastructure Issue Distribution by Category
          </h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${val} incidents (${item.payload.percentage}%)`,
                    item.payload.fullName,
                  ]}
                />
                <Bar dataKey="count" fill="#1e5aee" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Lifecycle Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Current Lifecycle Resolution Statuses
          </h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recurring Hotspot Areas */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div>
          <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-600" />
            Geographic Concentration & Recurring Problem Hotspots
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Areas with elevated incident clusters identified through 1.1km geospatial grid clustering.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-3 font-semibold">Area / Corridor Landmark</th>
                <th className="p-3 font-semibold">GPS Coordinates</th>
                <th className="p-3 font-semibold">Primary Problem Type</th>
                <th className="p-3 font-semibold">Total Reports</th>
                <th className="p-3 font-semibold">Severity Concentration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {analytics.recurringHotspots.map((h, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="p-3 font-bold text-navy-900">{h.areaName}</td>
                  <td className="p-3 font-mono text-slate-500">
                    {h.latitude.toFixed(4)}, {h.longitude.toFixed(4)}
                  </td>
                  <td className="p-3 text-slate-700">{h.primaryCategory}</td>
                  <td className="p-3 font-bold text-brand-700">{h.incidentCount} reports</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      High Recurrence
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
