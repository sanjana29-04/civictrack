import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ApiResponse, PageResponse } from '../../types';
import { Layers, Calendar, User, ShieldCheck, Loader2 } from 'lucide-react';

interface AuditEventItem {
  id: string;
  entityName: string;
  entityId: string;
  action: string;
  performedBy: string;
  userRole: string;
  details: string;
  timestamp: string;
}

export const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditEventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get<ApiResponse<PageResponse<AuditEventItem>>>('/audit/logs?page=0&size=50');
        setLogs(res.data.data.content);
      } catch (err) {
        console.error('Failed to load audit logs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
          <Layers className="w-4 h-4" />
          System Compliance & Traceability
        </div>
        <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">
          Immutable System Audit Trail
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Cryptographically timestamped record of administrative status transitions, duplicate merges, and verification events.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
          No audit entries recorded yet.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-semibold">Timestamp</th>
                  <th className="p-4 font-semibold">Entity</th>
                  <th className="p-4 font-semibold">Action</th>
                  <th className="p-4 font-semibold">Performed By</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-mono text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{log.entityName}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-md font-bold bg-slate-100 text-slate-800 text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-navy-900">{log.performedBy}</td>
                    <td className="p-4">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 font-semibold border border-brand-200">
                        {log.userRole.replace('ROLE_', '')}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 max-w-md">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
