'use client';

import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, UserCheck, KeyRound, AlertTriangle } from 'lucide-react';
import { UserAccount, PRESET_ACCOUNTS, HRPermissions } from '@/data/authData';

interface OwnerControlProps {
  currentUser: UserAccount;
  hrUser: UserAccount;
  onUpdatePermissions: (perms: HRPermissions) => void;
}

export const OwnerControlPanel: React.FC<OwnerControlProps> = ({
  currentUser,
  hrUser,
  onUpdatePermissions
}) => {
  const [perms, setPerms] = React.useState<HRPermissions>(
    hrUser.hrPermissions || {
      canAddEmployees: true,
      canViewSalary: true,
      canApproveLeaves: true,
      canRunPayroll: false
    }
  );

  const handleToggle = (key: keyof HRPermissions) => {
    const updated = { ...perms, [key]: !perms[key] };
    setPerms(updated);
    onUpdatePermissions(updated);
  };

  return (
    <div className="bg-white p-6 border border-slate-300 shadow-sm space-y-6">
      <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-[10px] font-mono font-bold uppercase border border-blue-200">
            Company Executive Governance
          </span>
          <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-900" /> HR Manager Access Delegation Control Panel
          </h2>
          <p className="text-xs text-slate-600">
            Company Owner portal to toggle granular permissions for HR Managers.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 p-2 text-xs text-blue-950 font-bold">
          <UserCheck className="w-4 h-4 text-blue-900" /> Target HR: {hrUser.name}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900">Add New Employees & Issue Login Slips</h4>
            <p className="text-[11px] text-slate-600">Allow HR to register employees and view generated login passwords.</p>
          </div>
          <button
            onClick={() => handleToggle('canAddEmployees')}
            className={`px-3 py-1.5 font-bold text-xs cursor-pointer border ${
              perms.canAddEmployees ? 'bg-emerald-700 text-white border-emerald-800' : 'bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            {perms.canAddEmployees ? 'ALLOWED' : 'DISABLED'}
          </button>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900">View Employee Salaries & Bank Accounts</h4>
            <p className="text-[11px] text-slate-600">Uncheck to hide confidential basic salary and bank details from HR.</p>
          </div>
          <button
            onClick={() => handleToggle('canViewSalary')}
            className={`px-3 py-1.5 font-bold text-xs cursor-pointer border ${
              perms.canViewSalary ? 'bg-emerald-700 text-white border-emerald-800' : 'bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            {perms.canViewSalary ? 'ALLOWED' : 'DISABLED'}
          </button>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900">Approve Employee Leave Requests</h4>
            <p className="text-[11px] text-slate-600">Allow HR to approve/reject staff leave requests with identity stamps.</p>
          </div>
          <button
            onClick={() => handleToggle('canApproveLeaves')}
            className={`px-3 py-1.5 font-bold text-xs cursor-pointer border ${
              perms.canApproveLeaves ? 'bg-emerald-700 text-white border-emerald-800' : 'bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            {perms.canApproveLeaves ? 'ALLOWED' : 'DISABLED'}
          </button>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900">Execute Monthly Payroll Engine</h4>
            <p className="text-[11px] text-slate-600">Allow HR to process final monthly net salary payout sheets.</p>
          </div>
          <button
            onClick={() => handleToggle('canRunPayroll')}
            className={`px-3 py-1.5 font-bold text-xs cursor-pointer border ${
              perms.canRunPayroll ? 'bg-emerald-700 text-white border-emerald-800' : 'bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            {perms.canRunPayroll ? 'ALLOWED' : 'DISABLED'}
          </button>
        </div>
      </div>
    </div>
  );
};
