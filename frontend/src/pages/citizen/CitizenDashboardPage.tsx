import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { incidentService } from '../../services/incidentService';
import { Incident } from '../../types';
import { IncidentCard } from '../../components/incidents/IncidentCard';
import { PlusCircle, FileText, CheckCircle2, AlertTriangle, ThumbsUp, ArrowRight, Loader2 } from 'lucide-react';

export const CitizenDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [myReports, setMyReports] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserReports = async () => {
      try {
        const res = await incidentService.getMyReports(0, 4);
        setMyReports(res.content);
      } catch (err) {
        console.error('Failed to load user reports', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReports();
  }, []);

  const totalReports = myReports.length;
  const inProgress = myReports.filter((r) => r.status === 'IN_PROGRESS' || r.status === 'ASSIGNED').length;
  const awaitingVerification = myReports.filter((r) => r.status === 'RESOLVED_AWAITING_VERIFICATION').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-400/30 inline-block">
            Citizen Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Track the status of your reported problems, verify repairs completed by field staff, and endorse community initiatives.
          </p>
        </div>

        <Link
          to="/report"
          className="self-start md:self-auto px-6 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all hover:scale-105 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Report New Problem
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Your Submitted Reports</span>
            <FileText className="w-4 h-4 text-brand-600" />
          </div>
          <span className="text-3xl font-extrabold text-navy-900 block">{totalReports}</span>
          <span className="text-xs text-slate-400">Total civic issues filed by you</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-700">
            <span>Active Field Work</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-3xl font-extrabold text-amber-600 block">{inProgress}</span>
          <span className="text-xs text-slate-400">Currently assigned or in-progress</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-teal-700">
            <span>Awaiting Your Verification</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <span className="text-3xl font-extrabold text-teal-600 block">{awaitingVerification}</span>
          <span className="text-xs text-slate-400">Repairs requiring your confirmation</span>
        </div>
      </div>

      {/* Recent My Reports Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-navy-900">Your Recent Reports</h2>
          <Link
            to="/my-reports"
            className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
          </div>
        ) : myReports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <p className="text-xs text-slate-500">You haven't submitted any civic issue reports yet.</p>
            <Link
              to="/report"
              className="inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
            >
              Submit Your First Report
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {myReports.map((report) => (
              <IncidentCard key={report.id} incident={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
