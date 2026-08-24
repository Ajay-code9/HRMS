'use client';

import React, { useState } from 'react';
import { CalendarCheck, Upload, Fingerprint, CheckCircle2, Clock, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { AttendanceRecord, Employee } from '@/types/hrms';

interface AttendanceProps {
  attendance: AttendanceRecord[];
  employees: Employee[];
  onUpdateAttendance: (records: AttendanceRecord[]) => void;
}

export const AttendanceView: React.FC<AttendanceProps> = ({
  attendance,
  employees,
  onUpdateAttendance
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'daily' | 'monthly' | 'biometric'>('daily');
  const [selectedDate, setSelectedDate] = useState('2026-08-24');
  const [records, setRecords] = useState<AttendanceRecord[]>(attendance);

  const handleStatusChange = (id: string, status: 'Present' | 'Absent' | 'Half Day' | 'Leave') => {
    const updated = records.map(r => r.id === id ? { ...r, status } : r);
    setRecords(updated);
    onUpdateAttendance(updated);
  };

  const handleOvertimeChange = (id: string, overtimeHours: number) => {
    const updated = records.map(r => r.id === id ? { ...r, overtimeHours } : r);
    setRecords(updated);
    onUpdateAttendance(updated);
  };

  const handleBiometricSync = () => {
    const syncedRecords = employees.map(emp => ({
      id: `att-bio-${emp.id}`,
      empId: emp.id,
      empName: emp.name,
      date: selectedDate,
      inTime: '09:00 AM',
      outTime: '06:30 PM',
      status: 'Present' as const,
      overtimeHours: 0.5,
      source: 'Biometric' as const
    }));
    setRecords(syncedRecords);
    onUpdateAttendance(syncedRecords);
    alert('Biometric logs successfully synced from device terminal!');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-blue-900" /> Daily & Monthly Attendance Operations
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            Mark daily attendance, biometric logs seeding, monthly adjustments, and overtime tracking.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-100 p-1 border border-slate-300">
          <button
            onClick={() => setActiveSubTab('daily')}
            className={`px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'daily' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Daily Attendance
          </button>
          <button
            onClick={() => setActiveSubTab('monthly')}
            className={`px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'monthly' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Monthly Seeding
          </button>
          <button
            onClick={() => setActiveSubTab('biometric')}
            className={`px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'biometric' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Biometric Sync
          </button>
        </div>
      </div>

      {/* SubTab 1: Daily Attendance */}
      {activeSubTab === 'daily' && (
        <div className="space-y-4">
          <div className="bg-white p-4 border border-slate-300 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Select Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-xs px-3 py-1.5 font-bold focus:outline-none"
              />
            </div>
            <span className="text-xs text-blue-900 font-mono font-bold">
              Live Attendance Register for {selectedDate}
            </span>
          </div>

          <div className="bg-white border border-slate-300 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-300">
                <tr>
                  <th className="p-3.5 border-r border-slate-200">Employee Name</th>
                  <th className="p-3.5 border-r border-slate-200">In Time</th>
                  <th className="p-3.5 border-r border-slate-200">Out Time</th>
                  <th className="p-3.5 border-r border-slate-200">Overtime (Hrs)</th>
                  <th className="p-3.5 border-r border-slate-200">Source</th>
                  <th className="p-3.5 text-center">Status Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 border-r border-slate-200 font-bold text-slate-900">{r.empName}</td>
                    <td className="p-3.5 border-r border-slate-200 font-mono text-slate-700">{r.inTime}</td>
                    <td className="p-3.5 border-r border-slate-200 font-mono text-slate-700">{r.outTime}</td>
                    <td className="p-3.5 border-r border-slate-200">
                      <input
                        type="number"
                        step="0.5"
                        value={r.overtimeHours}
                        onChange={(e) => handleOvertimeChange(r.id, Number(e.target.value))}
                        className="w-16 bg-slate-50 border border-slate-300 px-2 py-1 text-blue-900 font-bold"
                      />
                    </td>
                    <td className="p-3.5 border-r border-slate-200 font-mono text-slate-600">{r.source}</td>
                    <td className="p-3.5 text-center space-x-1">
                      {(['Present', 'Absent', 'Half Day', 'Leave'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(r.id, st)}
                          className={`px-2.5 py-1 text-[10px] font-bold border transition ${
                            r.status === st
                              ? st === 'Present' ? 'bg-emerald-700 text-white border-emerald-800' :
                                st === 'Absent' ? 'bg-rose-700 text-white border-rose-800' :
                                st === 'Half Day' ? 'bg-amber-600 text-white border-amber-700' : 'bg-blue-900 text-white border-blue-950'
                              : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SubTab 2: Monthly Seeding */}
      {activeSubTab === 'monthly' && (
        <div className="bg-white p-6 border border-slate-300 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-900" /> Monthly Attendance Seeding & Template Upload
          </h3>

          <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 text-center space-y-3">
            <Upload className="w-10 h-10 text-blue-900 mx-auto" />
            <p className="text-xs text-slate-700 font-bold">
              Upload Monthly Attendance Excel Sheet
            </p>
            <input type="file" accept=".xlsx, .xls" className="hidden" id="monthly-att-file" />
            <label htmlFor="monthly-att-file" className="px-4 py-2 bg-blue-900 text-white font-bold text-xs cursor-pointer hover:bg-blue-800 inline-block">
              Choose Excel File
            </label>
          </div>
        </div>
      )}

      {/* SubTab 3: Biometric Sync */}
      {activeSubTab === 'biometric' && (
        <div className="bg-white p-6 border border-slate-300 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-blue-900" /> Biometric Terminal Sync
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Transfer punch IN/OUT timestamps directly from Essl / ZKTeco Biometric Terminals.
              </p>
            </div>
            <button
              onClick={handleBiometricSync}
              className="px-5 py-2.5 bg-blue-900 text-white font-bold text-xs hover:bg-blue-800 transition cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Fetch Punch Logs
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-300 space-y-2">
              <span className="text-xs text-slate-500 font-bold uppercase">Terminal Status:</span>
              <div className="flex items-center gap-2 text-emerald-800 font-black text-sm">
                <CheckCircle2 className="w-4 h-4" /> Terminal IP: 192.168.1.201 (ONLINE)
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-300 space-y-2">
              <span className="text-xs text-slate-500 font-bold uppercase">Last Device Sync:</span>
              <div className="flex items-center gap-2 text-blue-900 font-black text-sm">
                <Clock className="w-4 h-4" /> 2026-08-24 17:30 PM (AUTO SYNC ACTIVE)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
