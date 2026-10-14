import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { incidentService } from '../../services/incidentService';
import { Incident } from '../../types';
import { IncidentCard } from '../../components/incidents/IncidentCard';
import { PlusCircle, Loader2 } from 'lucide-react';

export const MyReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await incidentService.getMyReports(0, 50);
        setReports(res.content);
      } catch (err) {
        console.error('Failed to load my reports', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">
            My Submitted Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete history of civic issues you have reported and their progress across the accountability lifecycle.
          </p>
        </div>

        <Link
          to="/report"
          className="self-start sm:self-auto px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Report Another Issue
        </Link>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto">
          <h3 className="text-base font-bold text-navy-900">No Reports Yet</h3>
          <p className="text-xs text-slate-500">
            You haven't submitted any civic issue reports. See a pothole, leak, or dark street? Report it now!
          </p>
          <Link
            to="/report"
            className="inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-xs"
          >
            Submit A Report
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reports.map((report) => (
            <IncidentCard key={report.id} incident={report} />
          ))}
        </div>
      )}
    </div>
  );
};
