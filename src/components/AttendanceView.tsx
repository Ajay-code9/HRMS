'use client';

import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, Upload, Fingerprint, CheckCircle2, Clock, 
  FileSpreadsheet, RefreshCw, Calendar as CalendarIcon, 
  AlertCircle, Check, X, Pencil, User, CheckSquare, XSquare, Plus
} from 'lucide-react';
import { AttendanceRecord, Employee, AttendanceRegularizationRequest } from '@/types/hrms';
import { UserAccount } from '@/data/authData';

interface AttendanceProps {
  attendance: AttendanceRecord[];
  employees: Employee[];
  onUpdateAttendance: (records: AttendanceRecord[]) => void;
  currentUser?: UserAccount;
}

export const AttendanceView: React.FC<AttendanceProps> = ({
  attendance,
  employees,
  onUpdateAttendance,
  currentUser
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'calendar' | 'daily' | 'regularization' | 'monthly' | 'biometric'>('calendar');
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-24');
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-08');
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || 'emp-101');
  const [records, setRecords] = useState<AttendanceRecord[]>(attendance);
  
  // Web Punch state
  const [punchedIn, setPunchedIn] = useState<boolean>(false);
  const [todayPunchInTime, setTodayPunchInTime] = useState<string>('');
  const [todayPunchOutTime, setTodayPunchOutTime] = useState<string>('');
  const [liveTime, setLiveTime] = useState<string>('');

  // Regularization Requests state
  const [regularizationRequests, setRegularizationRequests] = useState<AttendanceRegularizationRequest[]>([
    {
      id: 'reg-1',
      empId: 'emp-101',
      empName: 'Rohan Sharma',
      date: '2026-08-20',
      requestedInTime: '09:15 AM',
      requestedOutTime: '06:30 PM',
      requestedStatus: 'Present',
      reason: 'Biometric scanner error at front gate',
      status: 'Pending',
      requestedAt: '2026-08-21 10:00 AM'
    }
  ]);

  // Modals state
  const [showRegModal, setShowRegModal] = useState<boolean>(false);
  const [regForm, setRegForm] = useState({
    date: '2026-08-20',
    inTime: '09:00 AM',
    outTime: '06:30 PM',
    status: 'Present' as 'Present' | 'Half Day' | 'Leave',
    reason: ''
  });

  const [overrideDay, setOverrideDay] = useState<{ dayNum: number; record?: AttendanceRecord; dateStr: string } | null>(null);
  const [overrideForm, setOverrideForm] = useState({
    status: 'Present' as 'Present' | 'Absent' | 'Half Day' | 'Leave',
    inTime: '09:00 AM',
    outTime: '06:30 PM',
    overtimeHours: 0,
    remarks: ''
  });

  const isAdminOrHR = currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin' || currentUser?.role === 'Company HR' || currentUser?.role === 'Company Owner';

  // Live ticking clock
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString('en-IN'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Web Punch Handlers
  const handlePunchIn = () => {
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const todayDate = new Date().toISOString().split('T')[0];
    setPunchedIn(true);
    setTodayPunchInTime(timeStr);
    
    // Find or create today's record
    const targetEmp = employees.find(e => e.email === currentUser?.email) || employees[0];
    const existingIndex = records.findIndex(r => r.empId === targetEmp.id && r.date === todayDate);

    let updated: AttendanceRecord[];
    if (existingIndex !== -1) {
      updated = records.map((r, i) => i === existingIndex ? { ...r, inTime: timeStr, status: 'Present', source: 'Web Punch' } : r);
    } else {
      const newRec: AttendanceRecord = {
        id: `att-web-${Date.now()}`,
        empId: targetEmp.id,
        empName: targetEmp.name,
        date: todayDate,
        inTime: timeStr,
        outTime: 'Working...',
        status: 'Present',
        overtimeHours: 0,
        source: 'Web Punch'
      };
      updated = [newRec, ...records];
    }
    setRecords(updated);
    onUpdateAttendance(updated);
    alert(`🟢 Web Punch IN Recorded at ${timeStr}`);
  };

  const handlePunchOut = () => {
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const todayDate = new Date().toISOString().split('T')[0];
    setPunchedIn(false);
    setTodayPunchOutTime(timeStr);

    const targetEmp = employees.find(e => e.email === currentUser?.email) || employees[0];
    const updated = records.map(r => r.empId === targetEmp.id && r.date === todayDate ? {
      ...r,
      outTime: timeStr,
      status: 'Present' as const,
      remarks: `Punched out via Web App at ${timeStr}`
    } : r);
    setRecords(updated);
    onUpdateAttendance(updated);
    alert(`🔴 Web Punch OUT Recorded at ${timeStr}`);
  };

  // Status & Overtime updates for Daily Tab
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

  // Biometric sync
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
    alert('✅ Biometric logs successfully synced from device terminal!');
  };

  // Submit Regularization Request
  const handleSubmitRegularization = () => {
    if (!regForm.reason) {
      alert('Please enter a reason for attendance regularization.');
      return;
    }
    const targetEmp = employees.find(e => e.id === selectedEmpId) || employees[0];
    const newReq: AttendanceRegularizationRequest = {
      id: `reg-${Date.now()}`,
      empId: targetEmp.id,
      empName: targetEmp.name,
      date: regForm.date,
      requestedInTime: regForm.inTime,
      requestedOutTime: regForm.outTime,
      requestedStatus: regForm.status,
      reason: regForm.reason,
      status: 'Pending',
      requestedAt: new Date().toLocaleString()
    };
    setRegularizationRequests(prev => [newReq, ...prev]);
    setShowRegModal(false);
    alert('📩 Regularization request submitted to HR/Admin for approval.');
  };

  // Approve / Reject Regularization Request
  const handleReviewRegularization = (id: string, action: 'Approved' | 'Rejected', remarks?: string) => {
    const reviewer = currentUser?.name || 'HR Admin';
    const nowStr = new Date().toLocaleString();

    setRegularizationRequests(prev => prev.map(req => {
      if (req.id !== id) return req;
      return {
        ...req,
        status: action,
        reviewedBy: reviewer,
        reviewedAt: nowStr,
        reviewRemarks: remarks || ''
      };
    }));

    if (action === 'Approved') {
      const targetReq = regularizationRequests.find(r => r.id === id);
      if (targetReq) {
        // Update or insert attendance record
        const existingIdx = records.findIndex(r => r.empId === targetReq.empId && r.date === targetReq.date);
        let updated: AttendanceRecord[];
        if (existingIdx !== -1) {
          updated = records.map((r, idx) => idx === existingIdx ? {
            ...r,
            status: targetReq.requestedStatus as 'Present' | 'Half Day' | 'Leave',
            inTime: targetReq.requestedInTime,
            outTime: targetReq.requestedOutTime,
            source: 'Manual' as const,
            remarks: `Rectified via Regularization Request: ${targetReq.reason}`,
            rectifiedBy: reviewer
          } : r);
        } else {
          const newAtt: AttendanceRecord = {
            id: `att-rect-${Date.now()}`,
            empId: targetReq.empId,
            empName: targetReq.empName,
            date: targetReq.date,
            inTime: targetReq.requestedInTime,
            outTime: targetReq.requestedOutTime,
            status: targetReq.requestedStatus as 'Present' | 'Half Day' | 'Leave',
            overtimeHours: 0,
            source: 'Manual',
            remarks: `Rectified via Regularization Request: ${targetReq.reason}`,
            rectifiedBy: reviewer
          };
          updated = [newAtt, ...records];
        }
        setRecords(updated);
        onUpdateAttendance(updated);
      }
    }
  };

  // HR / Admin Direct Override Handler
  const handleSaveHRRectification = () => {
    if (!overrideDay) return;
    const reviewer = currentUser?.name || 'HR Admin';
    const targetEmp = employees.find(e => e.id === selectedEmpId) || employees[0];
    const existingIdx = records.findIndex(r => r.empId === targetEmp.id && r.date === overrideDay.dateStr);

    let updated: AttendanceRecord[];
    if (existingIdx !== -1) {
      updated = records.map((r, idx) => idx === existingIdx ? {
        ...r,
        status: overrideForm.status,
        inTime: overrideForm.inTime,
        outTime: overrideForm.outTime,
        overtimeHours: overrideForm.overtimeHours,
        remarks: overrideForm.remarks || `Rectified by ${reviewer}`,
        rectifiedBy: reviewer
      } : r);
    } else {
      const newAtt: AttendanceRecord = {
        id: `att-hr-${Date.now()}`,
        empId: targetEmp.id,
        empName: targetEmp.name,
        date: overrideDay.dateStr,
        inTime: overrideForm.inTime,
        outTime: overrideForm.outTime,
        status: overrideForm.status,
        overtimeHours: overrideForm.overtimeHours,
        source: 'Manual',
        remarks: overrideForm.remarks || `Rectified by ${reviewer}`,
        rectifiedBy: reviewer
      };
      updated = [newAtt, ...records];
    }
    setRecords(updated);
    onUpdateAttendance(updated);
    setOverrideDay(null);
    alert(`✅ Attendance for ${overrideDay.dateStr} updated successfully.`);
  };

  // Helper for Calendar Days Grid (August 2026 = 31 days)
  const currentEmp = employees.find(e => e.id === selectedEmpId) || employees[0];
  const pendingCount = regularizationRequests.filter(r => r.status === 'Pending').length;

  return (
    <div className="space-y-6">

      {/* ── 1. Web Punch & Top Header Banner ─────────────────────────────────── */}
      <div className="bg-white p-5 border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-blue-900" /> Attendance, Web Punch & Calendar Systems
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            Color-coded monthly calendar, Web punch in/out, punch regularization, and biometric sync.
          </p>
        </div>

        {/* Live Web Punch In / Out Actions */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3 border border-slate-300 rounded-xl">
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Today&apos;s Web Punch</div>
            <div className="text-xs font-mono font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-900 inline" /> {liveTime || '09:00:00 AM'}
            </div>
          </div>

          {!punchedIn ? (
            <button
              onClick={handlePunchIn}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              🟢 PUNCH IN
            </button>
          ) : (
            <button
              onClick={handlePunchOut}
              className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              🔴 PUNCH OUT
            </button>
          )}
        </div>
      </div>

      {/* ── 2. Tab Navigation ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 border border-slate-300 shadow-sm">
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setActiveSubTab('calendar')}
            className={`px-4 py-2 text-xs font-bold transition rounded-lg cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'calendar' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <CalendarIcon className="w-4 h-4" /> Monthly Calendar
          </button>
          <button
            onClick={() => setActiveSubTab('daily')}
            className={`px-4 py-2 text-xs font-bold transition rounded-lg cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'daily' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <CalendarCheck className="w-4 h-4" /> Daily Register
          </button>
          <button
            onClick={() => setActiveSubTab('regularization')}
            className={`px-4 py-2 text-xs font-bold transition rounded-lg cursor-pointer flex items-center gap-1.5 relative ${
              activeSubTab === 'regularization' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <AlertCircle className="w-4 h-4" /> Regularization Requests
            {pendingCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveSubTab('monthly')}
            className={`px-4 py-2 text-xs font-bold transition rounded-lg cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'monthly' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" /> Excel Seeding
          </button>
          <button
            onClick={() => setActiveSubTab('biometric')}
            className={`px-4 py-2 text-xs font-bold transition rounded-lg cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'biometric' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Fingerprint className="w-4 h-4" /> Biometric Sync
          </button>
        </div>

        <button
          onClick={() => {
            setRegForm({ date: '2026-08-20', inTime: '09:00 AM', outTime: '06:30 PM', status: 'Present', reason: '' });
            setShowRegModal(true);
          }}
          className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" /> Request Punch Regularization
        </button>
      </div>

      {/* ── 3. Tab 1: Interactive Monthly Color-Coded Calendar ───────────────── */}
      {activeSubTab === 'calendar' && (
        <div className="bg-white border border-slate-300 shadow-sm space-y-4 p-5">
          {/* Calendar Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Employee:</span>
              <select
                value={selectedEmpId}
                onChange={e => setSelectedEmpId(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-xs px-3 py-1.5 font-bold focus:outline-none rounded-lg cursor-pointer"
              >
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.empCode}) — {emp.department}</option>
                ))}
              </select>
            </div>

            {/* Legend Indicators */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-md">
                🟢 Full Day (Present)
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-md">
                🟡 Half Day
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-100 text-rose-900 border border-rose-300 rounded-md">
                🔴 Absent
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-900 border border-blue-300 rounded-md">
                🔵 Leave
              </span>
            </div>
          </div>

          {/* Calendar Title & Month Header */}
          <div className="flex items-center justify-between px-2">
            <h3 className="font-extrabold text-base text-slate-900">
              August 2026 Attendance Calendar — {currentEmp?.name}
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              Click any calendar day box to edit or request punch regularization
            </span>
          </div>

          {/* 31-Day Interactive Calendar Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {Array.from({ length: 31 }, (_, i) => {
              const dayNum = i + 1;
              const dateStr = `2026-08-${String(dayNum).padStart(2, '0')}`;
              const dayRecord = records.find(r => r.empId === selectedEmpId && r.date === dateStr);

              // Default status logic for demo
              let status: 'Present' | 'Absent' | 'Half Day' | 'Leave' = 'Present';
              if (dayRecord) {
                status = dayRecord.status;
              } else if (dayNum % 7 === 0 || dayNum === 15) {
                status = 'Absent';
              } else if (dayNum % 5 === 0) {
                status = 'Half Day';
              }

              // Color styles
              let cardBg = 'bg-emerald-50 border-emerald-300 text-emerald-950 hover:bg-emerald-100';
              let badgeColor = 'bg-emerald-700 text-white';
              let dotColor = '🟢';

              if (status === 'Absent') {
                cardBg = 'bg-rose-50 border-rose-300 text-rose-950 hover:bg-rose-100';
                badgeColor = 'bg-rose-700 text-white';
                dotColor = '🔴';
              } else if (status === 'Half Day') {
                cardBg = 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100';
                badgeColor = 'bg-amber-600 text-white';
                dotColor = '🟡';
              } else if (status === 'Leave') {
                cardBg = 'bg-blue-50 border-blue-300 text-blue-950 hover:bg-blue-100';
                badgeColor = 'bg-blue-800 text-white';
                dotColor = '🔵';
              }

              return (
                <div
                  key={dayNum}
                  onClick={() => {
                    if (isAdminOrHR) {
                      setOverrideDay({ dayNum, record: dayRecord, dateStr });
                      setOverrideForm({
                        status: dayRecord ? dayRecord.status : status,
                        inTime: dayRecord?.inTime || '09:00 AM',
                        outTime: dayRecord?.outTime || '06:30 PM',
                        overtimeHours: dayRecord?.overtimeHours || 0,
                        remarks: dayRecord?.remarks || ''
                      });
                    } else {
                      setRegForm({
                        date: dateStr,
                        inTime: '09:00 AM',
                        outTime: '06:30 PM',
                        status: status === 'Absent' ? 'Present' : 'Half Day',
                        reason: `Missing punch on ${dateStr}`
                      });
                      setShowRegModal(true);
                    }
                  }}
                  className={`p-3 border rounded-xl transition cursor-pointer flex flex-col justify-between h-28 shadow-sm relative group ${cardBg}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm">{dayNum} Aug</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badgeColor}`}>
                      {status}
                    </span>
                  </div>

                  <div className="space-y-0.5 my-1">
                    <div className="text-[10px] font-mono flex items-center gap-1">
                      <span>{dotColor}</span>
                      <span>{dayRecord?.inTime || '09:00 AM'} - {dayRecord?.outTime || '06:30 PM'}</span>
                    </div>
                    {dayRecord?.remarks && (
                      <div className="text-[9px] font-sans truncate text-slate-700 italic">
                        📝 {dayRecord.remarks}
                      </div>
                    )}
                  </div>

                  <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500 flex justify-between items-center">
                    <span>{dayRecord?.source || 'Biometric'}</span>
                    <span className="text-blue-900 underline opacity-0 group-hover:opacity-100 transition">
                      {isAdminOrHR ? 'Edit' : 'Request'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 4. Tab 2: Daily Register List ───────────────────────────────────── */}
      {activeSubTab === 'daily' && (
        <div className="space-y-4">
          <div className="bg-white p-4 border border-slate-300 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Select Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-xs px-3 py-1.5 font-bold focus:outline-none rounded-lg"
              />
            </div>
            <span className="text-xs text-blue-900 font-mono font-bold">
              Daily Attendance Register for {selectedDate}
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
                  <th className="p-3.5 border-r border-slate-200">Remarks / Rectification</th>
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
                        className="w-16 bg-slate-50 border border-slate-300 px-2 py-1 text-blue-900 font-bold rounded"
                      />
                    </td>
                    <td className="p-3.5 border-r border-slate-200 font-mono text-slate-600">{r.source}</td>
                    <td className="p-3.5 border-r border-slate-200 text-[11px] text-slate-600">
                      {r.remarks || '—'}
                      {r.rectifiedBy && <div className="text-[10px] text-blue-900 font-bold mt-0.5">By: {r.rectifiedBy}</div>}
                    </td>
                    <td className="p-3.5 text-center space-x-1">
                      {(['Present', 'Absent', 'Half Day', 'Leave'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(r.id, st)}
                          className={`px-2.5 py-1 text-[10px] font-bold border rounded transition cursor-pointer ${
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

      {/* ── 5. Tab 3: Attendance Regularization Requests ─────────────────────── */}
      {activeSubTab === 'regularization' && (
        <div className="bg-white border border-slate-300 shadow-sm space-y-4 p-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" /> Attendance Regularization & Missing Punch Requests
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Review and approve employee requests for missing punches, forgotten logins, or attendance corrections.
              </p>
            </div>
            <button
              onClick={() => {
                setRegForm({ date: '2026-08-20', inTime: '09:00 AM', outTime: '06:30 PM', status: 'Present', reason: '' });
                setShowRegModal(true);
              }}
              className="px-4 py-2 bg-blue-900 text-white font-bold text-xs rounded-lg hover:bg-blue-800 transition cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> New Regularization Request
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-300">
                <tr>
                  <th className="p-3 border-r border-slate-200">Employee</th>
                  <th className="p-3 border-r border-slate-200">Date</th>
                  <th className="p-3 border-r border-slate-200">Requested Punch</th>
                  <th className="p-3 border-r border-slate-200">Requested Status</th>
                  <th className="p-3 border-r border-slate-200">Employee Reason</th>
                  <th className="p-3 border-r border-slate-200">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {regularizationRequests.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-slate-400">No regularization requests found.</td></tr>
                )}
                {regularizationRequests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 border-r border-slate-200 font-bold text-slate-900">{req.empName}</td>
                    <td className="p-3 border-r border-slate-200 font-mono font-bold text-blue-900">{req.date}</td>
                    <td className="p-3 border-r border-slate-200 font-mono text-slate-800">
                      {req.requestedInTime} - {req.requestedOutTime}
                    </td>
                    <td className="p-3 border-r border-slate-200">
                      <span className={`px-2 py-0.5 font-bold text-[10px] rounded ${req.requestedStatus === 'Present' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {req.requestedStatus}
                      </span>
                    </td>
                    <td className="p-3 border-r border-slate-200 text-slate-700 italic max-w-xs">{req.reason}</td>
                    <td className="p-3 border-r border-slate-200">
                      <span className={`px-2.5 py-1 font-bold text-[10px] rounded ${req.status === 'Pending' ? 'bg-amber-100 text-amber-900 border border-amber-300' : req.status === 'Approved' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {req.status === 'Pending' && isAdminOrHR ? (
                        <div className="flex justify-center gap-1.5">
                          <button
                            onClick={() => handleReviewRegularization(req.id, 'Approved')}
                            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] rounded transition cursor-pointer flex items-center gap-1"
                          >
                            <CheckSquare className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleReviewRegularization(req.id, 'Rejected', 'Rejected by HR')}
                            className="px-3 py-1 bg-rose-700 hover:bg-rose-800 text-white font-bold text-[11px] rounded transition cursor-pointer flex items-center gap-1"
                          >
                            <XSquare className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-semibold">
                          {req.reviewedBy ? `Reviewed by ${req.reviewedBy}` : 'Completed'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 6. Tab 4: Monthly Excel Seeding ─────────────────────────────────── */}
      {activeSubTab === 'monthly' && (
        <div className="bg-white p-6 border border-slate-300 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-900" /> Monthly Attendance Seeding & Template Upload
          </h3>

          <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 text-center space-y-3 rounded-xl">
            <Upload className="w-10 h-10 text-blue-900 mx-auto" />
            <p className="text-xs text-slate-700 font-bold">
              Upload Monthly Attendance Excel Sheet
            </p>
            <input type="file" accept=".xlsx, .xls" className="hidden" id="monthly-att-file" />
            <label htmlFor="monthly-att-file" className="px-4 py-2 bg-blue-900 text-white font-bold text-xs cursor-pointer hover:bg-blue-800 inline-block rounded-lg">
              Choose Excel File
            </label>
          </div>
        </div>
      )}

      {/* ── 7. Tab 5: Biometric Sync ────────────────────────────────────────── */}
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
              className="px-5 py-2.5 bg-blue-900 text-white font-bold text-xs hover:bg-blue-800 transition cursor-pointer flex items-center gap-2 rounded-lg"
            >
              <RefreshCw className="w-4 h-4" /> Fetch Punch Logs
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-300 space-y-2 rounded-xl">
              <span className="text-xs text-slate-500 font-bold uppercase">Terminal Status:</span>
              <div className="flex items-center gap-2 text-emerald-800 font-black text-sm">
                <CheckCircle2 className="w-4 h-4" /> Terminal IP: 192.168.1.201 (ONLINE)
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-300 space-y-2 rounded-xl">
              <span className="text-xs text-slate-500 font-bold uppercase">Last Device Sync:</span>
              <div className="flex items-center gap-2 text-blue-900 font-black text-sm">
                <Clock className="w-4 h-4" /> 2026-08-24 17:30 PM (AUTO SYNC ACTIVE)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 8. Employee Regularization Request Modal ──────────────────────────── */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 border-2 border-blue-900 shadow-2xl space-y-4 rounded-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" /> Request Punch Regularization
              </h3>
              <button onClick={() => setShowRegModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Date:</label>
                <input
                  type="date"
                  value={regForm.date}
                  onChange={e => setRegForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 p-2 font-bold text-slate-900 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">In Time:</label>
                  <input
                    type="text"
                    value={regForm.inTime}
                    onChange={e => setRegForm(p => ({ ...p, inTime: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 p-2 font-mono text-slate-900 rounded"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Out Time:</label>
                  <input
                    type="text"
                    value={regForm.outTime}
                    onChange={e => setRegForm(p => ({ ...p, outTime: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 p-2 font-mono text-slate-900 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Requested Status:</label>
                <select
                  value={regForm.status}
                  onChange={e => setRegForm(p => ({ ...p, status: e.target.value as 'Present' | 'Half Day' | 'Leave' }))}
                  className="w-full bg-slate-50 border border-slate-300 p-2 font-bold text-slate-900 rounded"
                >
                  <option value="Present">Present (Full Day)</option>
                  <option value="Half Day">Half Day</option>
                  <option value="Leave">On Leave</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason / Note for Missing Punch:</label>
                <textarea
                  rows={3}
                  value={regForm.reason}
                  onChange={e => setRegForm(p => ({ ...p, reason: e.target.value }))}
                  placeholder="E.g. Forgot to punch in at gate, client site visit, network issue..."
                  className="w-full bg-slate-50 border border-slate-300 p-2 text-slate-900 rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowRegModal(false)}
                className="px-4 py-2 bg-slate-200 text-slate-800 font-bold text-xs rounded hover:bg-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRegularization}
                className="px-4 py-2 bg-blue-900 text-white font-bold text-xs rounded hover:bg-blue-800 cursor-pointer"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 9. HR Attendance Override & Rectification Dialog ─────────────────── */}
      {overrideDay && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 border-2 border-blue-900 shadow-2xl space-y-4 rounded-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Pencil className="w-5 h-5 text-blue-900" /> HR Attendance Override — {overrideDay.dateStr}
              </h3>
              <button onClick={() => setOverrideDay(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 text-slate-700">
                Employee: <strong className="text-slate-900">{currentEmp?.name} ({currentEmp?.empCode})</strong>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Set Attendance Status:</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Present', 'Half Day', 'Absent', 'Leave'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setOverrideForm(p => ({ ...p, status: st }))}
                      className={`p-2 font-bold text-xs rounded border text-center transition cursor-pointer ${
                        overrideForm.status === st
                          ? st === 'Present' ? 'bg-emerald-700 text-white border-emerald-800' :
                            st === 'Absent' ? 'bg-rose-700 text-white border-rose-800' :
                            st === 'Half Day' ? 'bg-amber-600 text-white border-amber-700' : 'bg-blue-900 text-white border-blue-950'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {st === 'Present' ? '🟢 Present' : st === 'Half Day' ? '🟡 Half Day' : st === 'Absent' ? '🔴 Absent' : '🔵 Leave'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">In Time:</label>
                  <input
                    type="text"
                    value={overrideForm.inTime}
                    onChange={e => setOverrideForm(p => ({ ...p, inTime: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 p-2 font-mono text-slate-900 rounded"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Out Time:</label>
                  <input
                    type="text"
                    value={overrideForm.outTime}
                    onChange={e => setOverrideForm(p => ({ ...p, outTime: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 p-2 font-mono text-slate-900 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Overtime Hours:</label>
                <input
                  type="number"
                  step="0.5"
                  value={overrideForm.overtimeHours}
                  onChange={e => setOverrideForm(p => ({ ...p, overtimeHours: Number(e.target.value) }))}
                  className="w-full bg-slate-50 border border-slate-300 p-2 font-mono font-bold text-slate-900 rounded"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">HR Rectification Remarks / Reason:</label>
                <input
                  type="text"
                  value={overrideForm.remarks}
                  onChange={e => setOverrideForm(p => ({ ...p, remarks: e.target.value }))}
                  placeholder="E.g. Approved site visit, Rectified by HR"
                  className="w-full bg-slate-50 border border-slate-300 p-2 text-slate-900 rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setOverrideDay(null)}
                className="px-4 py-2 bg-slate-200 text-slate-800 font-bold text-xs rounded hover:bg-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveHRRectification}
                className="px-4 py-2 bg-blue-900 text-white font-bold text-xs rounded hover:bg-blue-800 cursor-pointer"
              >
                💾 Save Rectification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

