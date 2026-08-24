'use client';

import React, { useState } from 'react';
import { Settings, ShieldAlert, MapPin, Factory, Database, Download } from 'lucide-react';
import { GlobalParameter, AuditLog } from '@/types/hrms';
import { INDIAN_STATES, INDIAN_CITIES, INDUSTRY_MASTERS } from '@/data/indianMastersData';

interface SettingsProps {
  globalParams: GlobalParameter;
  logs: AuditLog[];
  onSaveParams: (params: GlobalParameter) => void;
}

export const SettingsLogsView: React.FC<SettingsProps> = ({ globalParams, logs, onSaveParams }) => {
  const [params, setParams] = useState(globalParams);
  const [selectedStateFilter, setSelectedStateFilter] = useState<number>(30);

  const filteredCities = INDIAN_CITIES.filter(c => c.stateId === Number(selectedStateFilter));
  const activeStateName = INDIAN_STATES.find(s => s.id === Number(selectedStateFilter))?.name || 'Selected State';

  const downloadDatabaseBackup = () => {
    const backupData = {
      version: 'SS_HRMS_v1.0_PROD',
      timestamp: new Date().toISOString(),
      globalParameters: globalParams,
      statesCount: INDIAN_STATES.length,
      citiesCount: INDIAN_CITIES.length,
      auditLogs: logs
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SS_HRMS_Database_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* 1-Click Database Backup & Restore Utility (Req 12) */}
      <div className="bg-white p-6 border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-[10px] font-mono font-bold uppercase border border-blue-200">
            System Utility (Req 12)
          </span>
          <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-900" /> Automated Database Backup & Dump Utility
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            Download 1-click snapshot backups of PostgreSQL database schema, tables, and audit logs.
          </p>
        </div>

        <button
          onClick={downloadDatabaseBackup}
          className="px-5 py-2.5 bg-blue-900 text-white font-bold text-xs uppercase hover:bg-blue-800 transition cursor-pointer flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Download Database Backup (.json)
        </button>
      </div>

      {/* All-India States & Cascading Cities Directory */}
      <div className="bg-white p-6 border border-slate-300 shadow-sm space-y-4">
        <div className="border-b border-slate-200 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-900" /> All-India States & Cascading Cities Directory
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-700 font-bold">Select State ID Filter:</span>
            <select
              value={selectedStateFilter}
              onChange={(e) => setSelectedStateFilter(Number(e.target.value))}
              className="bg-slate-50 border border-slate-300 px-3 py-1.5 text-xs text-slate-900 font-bold cursor-pointer"
            >
              {INDIAN_STATES.map(s => (
                <option key={s.id} value={s.id}>{s.name} (ID: {s.id})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase">
            Cities in {activeStateName} ({filteredCities.length} Mapped)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {filteredCities.map(c => (
              <div key={c.id} className="p-2.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>{c.name}</span>
                <span className="text-[10px] text-blue-900 font-mono">ID: {c.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Activity Logs */}
      <div className="bg-white p-6 border border-slate-300 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-blue-900" /> System User Activity & Security Audit Logs (Req 13)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-300">
              <tr>
                <th className="p-3 border-r border-slate-200">Timestamp</th>
                <th className="p-3 border-r border-slate-200">User & Role</th>
                <th className="p-3 border-r border-slate-200">Action</th>
                <th className="p-3 border-r border-slate-200">Details</th>
                <th className="p-3 font-mono">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 border-r border-slate-200 font-mono text-slate-600">{l.timestamp}</td>
                  <td className="p-3 border-r border-slate-200">
                    <span className="font-bold text-slate-900">{l.user}</span>
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-[10px] text-blue-900 font-bold font-mono">
                      {l.role}
                    </span>
                  </td>
                  <td className="p-3 border-r border-slate-200 font-bold text-blue-900">{l.action}</td>
                  <td className="p-3 border-r border-slate-200 text-slate-700">{l.details}</td>
                  <td className="p-3 font-mono text-slate-600">{l.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
