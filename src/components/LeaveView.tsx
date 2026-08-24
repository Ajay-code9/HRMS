'use client';

import React, { useState } from 'react';
import { Award, Plus, CheckCircle2, Clock, Calendar, ShieldCheck, UserCheck, Check, X } from 'lucide-react';
import { LeaveRequest } from '@/types/hrms';
import { UserAccount } from '@/data/authData';

interface LeaveProps {
  leaves: LeaveRequest[];
  currentUser: UserAccount;
  onApproveLeave: (id: string, approverName: string, remarks: string) => void;
  onRejectLeave: (id: string, approverName: string, remarks: string) => void;
  onAddLeaveRequest: (req: LeaveRequest) => void;
}

export const LeaveView: React.FC<LeaveProps> = ({
  leaves,
  currentUser,
  onApproveLeave,
  onRejectLeave,
  onAddLeaveRequest
}) => {
  const [showModal, setShowModal] = useState(false);
  const [approvalModalId, setApprovalModalId] = useState<string | null>(null);
  const [approvalActionType, setApprovalActionType] = useState<'Approve' | 'Reject'>('Approve');
  const [approvalRemarks, setApprovalRemarks] = useState('');

  // New Request Form
  const [leaveType, setLeaveType] = useState<'Casual' | 'Sick' | 'Earned'>('Casual');
  const [fromDate, setFromDate] = useState('2026-08-28');
  const [toDate, setToDate] = useState('2026-08-29');
  const [days, setDays] = useState(2);
  const [reason, setReason] = useState('');

  const isEmployee = currentUser.role === 'Employee';

  const handleCreateLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: LeaveRequest = {
      id: `lv-${Date.now()}`,
      empId: currentUser.empId || 'emp-101',
      empName: currentUser.name,
      leaveType,
      fromDate,
      toDate,
      days,
      reason,
      status: 'Pending'
    };
    onAddLeaveRequest(newReq);
    setShowModal(false);
    setReason('');
  };

  const handleConfirmAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvalModalId) return;

    if (approvalActionType === 'Approve') {
      onApproveLeave(approvalModalId, `${currentUser.name} (${currentUser.role})`, approvalRemarks || 'Approved');
    } else {
      onRejectLeave(approvalModalId, `${currentUser.name} (${currentUser.role})`, approvalRemarks || 'Rejected');
    }
    setApprovalModalId(null);
    setApprovalRemarks('');
  };

  const displayedLeaves = isEmployee 
    ? leaves.filter(l => l.empName.includes(currentUser.name.split(' ')[0]))
    : leaves;

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-900" /> Leave Management & Auditor Stamped Workflow
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            Multi-level leave approval engine with identity auditor stamps and timestamp verification.
          </p>
        </div>

        {isEmployee && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-blue-900 text-white font-bold text-xs uppercase hover:bg-blue-800 transition cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Apply for Leave
          </button>
        )}
      </div>

      {/* Leave Table */}
      <div className="bg-white border border-slate-300 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-300">
            <tr>
              <th className="p-3.5 border-r border-slate-200">Employee Name</th>
              <th className="p-3.5 border-r border-slate-200">Leave Type</th>
              <th className="p-3.5 border-r border-slate-200">Duration</th>
              <th className="p-3.5 border-r border-slate-200">Days</th>
              <th className="p-3.5 border-r border-slate-200">Reason</th>
              <th className="p-3.5 border-r border-slate-200">Auditor Stamp & Timestamp</th>
              <th className="p-3.5 text-center">Status / Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-medium">
            {displayedLeaves.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50 transition">
                <td className="p-3.5 border-r border-slate-200 font-bold text-slate-900">{l.empName}</td>
                <td className="p-3.5 border-r border-slate-200">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-950 font-bold text-[10px] border border-blue-200">
                    {l.leaveType}
                  </span>
                </td>
                <td className="p-3.5 border-r border-slate-200 text-slate-700 font-mono">{l.fromDate} to {l.toDate}</td>
                <td className="p-3.5 border-r border-slate-200 font-bold text-blue-900">{l.days} Days</td>
                <td className="p-3.5 border-r border-slate-200 text-slate-600 italic">&quot;{l.reason}&quot;</td>
                
                {/* Auditor Stamp Column */}
                <td className="p-3.5 border-r border-slate-200 text-[11px]">
                  {l.approvedBy ? (
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                        <span>{l.approvedBy}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{l.approvedAt}</div>
                      {l.approvalRemarks && (
                        <div className="text-[10px] text-slate-600 font-semibold italic">
                          Note: {l.approvalRemarks}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Awaiting Review</span>
                  )}
                </td>

                <td className="p-3.5 text-center">
                  {l.status === 'Approved' ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                      Approved
                    </span>
                  ) : l.status === 'Rejected' ? (
                    <span className="px-2.5 py-1 bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-300">
                      Rejected
                    </span>
                  ) : (
                    !isEmployee ? (
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => {
                            setApprovalModalId(l.id);
                            setApprovalActionType('Approve');
                          }}
                          className="px-2 py-1 bg-emerald-700 text-white font-bold text-[10px] hover:bg-emerald-800 cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setApprovalModalId(l.id);
                            setApprovalActionType('Reject');
                          }}
                          className="px-2 py-1 bg-rose-700 text-white font-bold text-[10px] hover:bg-rose-800 cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="px-2 py-1 bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300">
                        Pending HR Review
                      </span>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 border-2 border-blue-900 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
              Submit Leave Application
            </h3>

            <form onSubmit={handleCreateLeave} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Leave Type *</label>
                <select
                  value={leaveType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLeaveType(e.target.value as 'Casual' | 'Sick' | 'Earned')}
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-bold"
                >
                  <option value="Casual">Casual Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Earned">Earned Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">From Date *</label>
                  <input
                    type="date"
                    required
                    value={fromDate}
                    onChange={e => setFromDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">To Date *</label>
                  <input
                    type="date"
                    required
                    value={toDate}
                    onChange={e => setToDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Total Days *</label>
                <input
                  type="number"
                  required
                  value={days}
                  onChange={e => setDays(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Reason for Leave *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="State reason..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 p-3 text-slate-900 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white font-bold"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Approval Confirmation Modal */}
      {approvalModalId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 border-2 border-blue-900 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">
              Confirm Leave {approvalActionType}
            </h3>

            <form onSubmit={handleConfirmAction} className="space-y-3 text-xs">
              <p className="text-slate-700 font-medium">
                You are performing this action as <span className="font-bold text-blue-900">{currentUser.name} ({currentUser.role})</span>. Your identity and timestamp will be permanently stamped on this request.
              </p>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Auditor Approval Remarks / Note *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Approved. Shift backup allocated."
                  value={approvalRemarks}
                  onChange={e => setApprovalRemarks(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 text-slate-900 font-bold"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setApprovalModalId(null)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white font-bold ${
                    approvalActionType === 'Approve' ? 'bg-emerald-800' : 'bg-rose-800'
                  }`}
                >
                  Confirm {approvalActionType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
