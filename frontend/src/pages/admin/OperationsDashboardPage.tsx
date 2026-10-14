import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';
import { incidentService } from '../../services/incidentService';
import { CivicAnalytics, Incident } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { CategoryBadge } from '../../components/common/CategoryBadge';
import {
  Wrench,
  FileText,
  CopyCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BarChart3,
  Layers,
  Clock,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

export const OperationsDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<CivicAnalytics | null>(null);
  const [activeQueue, setActiveQueue] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stats, queueRes] = await Promise.all([
          analyticsService.getDashboardAnalytics(),
          incidentService.explore({ status: 'IN_PROGRESS', page: 0, size: 5 }),
        ]);
        setAnalytics(stats);
        setActiveQueue(queueRes.content);
      } catch (err) {
        console.error('Failed to load operations dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <Wrench className="w-4 h-4" />
            Municipal Operations Desk
          </div>
          <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">
            Field Operations & Triage Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Dispatch field crews, propose resolution evidence, and resolve citizen disputes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/resolution"
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            Propose Resolution
          </Link>
          <Link
            to="/admin/duplicates"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
          >
            <CopyCheck className="w-4 h-4" />
            Duplicate Triage
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-500">Open Incidents</span>
            <span className="text-3xl font-extrabold text-blue-600 block">{analytics.openIncidents}</span>
            <span className="text-[11px] text-slate-400">Awaiting triage & assignment</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-amber-700">Active Field Work</span>
            <span className="text-3xl font-extrabold text-amber-600 block">{analytics.inProgressIncidents}</span>
            <span className="text-[11px] text-slate-400">Assigned / In Progress</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-teal-700">Awaiting Citizen Verification</span>
            <span className="text-3xl font-extrabold text-teal-600 block">{analytics.awaitingVerificationCount}</span>
            <span className="text-[11px] text-slate-400">Evidence under review</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-rose-700">Reopened / Disputed</span>
            <span className="text-3xl font-extrabold text-rose-600 block">{analytics.reopenedCount}</span>
            <span className="text-[11px] text-slate-400">Requires follow-up remediation</span>
          </div>
        </div>
      )}

      {/* Quick Queues Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          to="/admin/reviews"
          className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700">
              <FileText className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-navy-900">Incident Review Queue</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Verify new citizen submissions, confirm AI-suggested categories, and set priorities.
          </p>
        </Link>

        <Link
          to="/admin/duplicates"
          className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700">
              <CopyCheck className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-navy-900">Duplicate Triage Desk</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Inspect AI & proximity-detected duplicate pairs and merge with complete audit trails.
          </p>
        </Link>

        <Link
          to="/admin/resolution"
          className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-navy-900">Resolution & Dispute Review</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Upload completion photos for citizen confirmation and review community disputes.
          </p>
        </Link>
      </div>

      {/* Active Work in Progress Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-navy-900">Current Field Work In Progress</h2>
          <Link
            to="/explore?status=IN_PROGRESS"
            className="text-xs font-semibold text-brand-600 hover:underline"
          >
            View All Active
          </Link>
        </div>

        {loading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
          </div>
        ) : activeQueue.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No active field work currently in progress.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3 font-semibold">Incident #</th>
                  <th className="p-3 font-semibold">Title</th>
                  <th className="p-3 font-semibold">Category</th>
                  <th className="p-3 font-semibold">Priority</th>
                  <th className="p-3 font-semibold">Assigned Team</th>
                  <th className="p-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-bold text-slate-700">{item.incidentNumber}</td>
                    <td className="p-3 font-medium text-navy-900 max-w-xs truncate">{item.title}</td>
                    <td className="p-3"><CategoryBadge category={item.category} /></td>
                    <td className="p-3"><PriorityBadge priority={item.priority} /></td>
                    <td className="p-3 text-slate-600">{item.assignedTeam || 'Unassigned'}</td>
                    <td className="p-3 text-right">
                      <Link
                        to={`/incidents/${item.id}`}
                        className="px-3 py-1 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
