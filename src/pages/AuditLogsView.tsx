import React, { useState } from 'react';
import { History, Search, Filter, ShieldCheck, Download, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useApp();
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.module.toLowerCase().includes(search.toLowerCase()) ||
    log.userName.toLowerCase().includes(search.toLowerCase()) ||
    log.details.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = ['Timestamp,User,Role,Action,Module,Details'];
    const rows = filteredLogs.map(l => 
      `"${l.timestamp}","${l.userName}","${l.role}","${l.action}","${l.module}","${l.details.replace(/"/g, '""')}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `PharmaGlow_AuditTrail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              System Audit Trail & Compliance Log
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase">
              Immutable Trail
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Traceable activity logs for compliance inspections, inventory changes, and sales records.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-2 shadow-xs transition-all"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, user, module or details..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
          />
        </div>
        <div className="text-slate-500 font-medium">
          Logged Events: <span className="font-bold text-slate-800">{filteredLogs.length}</span>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-3">Actor / User</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Module</th>
                <th className="py-3 px-3">Action Type</th>
                <th className="py-3 px-4">Operational Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-800">
                    {log.userName}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {log.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-teal-800">
                    {log.module}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-700 font-bold">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-md">
                    {log.details}
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
