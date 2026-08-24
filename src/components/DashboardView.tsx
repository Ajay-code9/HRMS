'use client';

import React from 'react';
import { 
  Building2, Users, CalendarCheck, Calculator, FileText, 
  ArrowUpRight, CheckCircle2, ShieldCheck, DollarSign, Award, Clock, Download, Package, UserCheck
} from 'lucide-react';
import { Company, Employee, AttendanceRecord, PayrollRecord, LeaveRequest } from '@/types/hrms';
import { UserAccount } from '@/data/authData';

interface DashboardProps {
  companies: Company[];
  employees: Employee[];
  attendance: AttendanceRecord[];
  payroll: PayrollRecord[];
  onNavigate: (tab: string) => void;
  currentUser: UserAccount;
}

export const DashboardView: React.FC<DashboardProps> = ({
  companies,
  employees,
  attendance,
  payroll,
  onNavigate,
  currentUser
}) => {
  const totalEmps = employees.length;
  const presentToday = attendance.filter(a => a.status === 'Present').length;
  const totalPayout = employees.reduce((acc, curr) => acc + (curr.basicSalary + curr.hra + curr.conveyance + curr.specialAllowance), 0);

  // 1. Employee Specific Specialized Dashboard View
  if (currentUser.role === 'Employee') {
    const currentEmp = employees.find(e => e.id === currentUser.empId || e.email === currentUser.email) || employees[0];
    const gross = currentEmp.basicSalary + currentEmp.hra + currentEmp.conveyance + currentEmp.specialAllowance;
    const pf = Math.round(Math.min(currentEmp.basicSalary, 15000) * 0.12);
    const esi = gross <= 21000 ? Math.round(gross * 0.0075) : 0;
    const netSalary = gross - (pf + esi);

    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-white border border-slate-300 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold mb-2">
                <UserCheck className="w-3.5 h-3.5" /> Employee Portal • {currentEmp.companyName}
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Welcome back, {currentEmp.name}
              </h2>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                {currentEmp.designation} • Department: {currentEmp.department} • Emp Code: <span className="font-mono font-bold text-blue-900">{currentEmp.empCode}</span>
              </p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => onNavigate('leaves')}
                className="px-4 py-2.5 bg-blue-900 text-white font-bold text-xs hover:bg-blue-800 transition cursor-pointer flex items-center gap-2"
              >
                <Award className="w-4 h-4" /> Apply for Leave
              </button>
              <button 
                onClick={() => onNavigate('reports')}
                className="px-4 py-2.5 bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 hover:bg-slate-200 transition cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Salary Slip
              </button>
            </div>
          </div>
        </div>

        {/* Employee Summary Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 border border-slate-300 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-500">Today&apos;s Status</span>
            <div className="mt-2 flex items-center justify-between">
              <h3 className="text-xl font-black text-emerald-700">Present (Clock In)</h3>
              <Clock className="w-5 h-5 text-emerald-700" />
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-1">In: 09:15 AM | Out: 06:30 PM</p>
          </div>

          <div className="bg-white p-4 border border-slate-300 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-500">Monthly Net Salary</span>
            <div className="mt-2 flex items-center justify-between">
              <h3 className="text-xl font-black text-blue-900">₹{netSalary.toLocaleString('en-IN')}</h3>
              <DollarSign className="w-5 h-5 text-blue-900" />
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Direct Bank Credit: {currentEmp.bankName}</p>
          </div>

          <div className="bg-white p-4 border border-slate-300 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-500">EPF UAN Number</span>
            <div className="mt-2">
              <h3 className="text-sm font-mono font-black text-slate-900">{currentEmp.uanNumber}</h3>
            </div>
            <p className="text-[11px] text-blue-900 font-mono mt-1">PF: {currentEmp.pfNumber}</p>
          </div>

          <div className="bg-white p-4 border border-slate-300 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-500">ESIC Insurance Code</span>
            <div className="mt-2">
              <h3 className="text-sm font-mono font-black text-slate-900">{currentEmp.esiNumber}</h3>
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1">0.75% Deducted</p>
          </div>
        </div>

        {/* Employee Details Card */}
        <div className="bg-white p-5 border border-slate-300 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">My Profile & Statutory Registration Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Bank Account</span>
              <p className="font-mono font-bold text-slate-900">{currentEmp.accountNo}</p>
              <p className="text-slate-600 font-mono">IFSC: {currentEmp.ifsc}</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-bold uppercase text-[10px]">PAN & Joining Date</span>
              <p className="font-mono font-bold text-slate-900">PAN: {currentEmp.panNumber}</p>
              <p className="text-slate-600">Joined: {currentEmp.joiningDate}</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Salary Breakup</span>
              <p className="text-slate-800">Basic: ₹{currentEmp.basicSalary} | HRA: ₹{currentEmp.hra}</p>
              <p className="text-blue-900 font-bold">Gross: ₹{gross.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Company Owner Specialized View
  if (currentUser.role === 'Company Owner') {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-slate-300 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Company Executive Dashboard • {currentUser.companyName}
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Welcome back, {currentUser.name}
              </h2>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Executive Overview — Financial Liabilities, Workforce Spend & HR Delegation Governance.
              </p>
            </div>

            <button
              onClick={() => onNavigate('owner-control')}
              className="px-4 py-2.5 bg-blue-900 text-white font-bold text-xs uppercase hover:bg-blue-800 transition cursor-pointer flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Manage HR Delegation Matrix
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 border border-slate-300 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-500">Total Workforce Overhead</span>
            <h3 className="text-2xl font-black text-slate-900 mt-2">₹{totalPayout.toLocaleString('en-IN')}</h3>
            <p className="text-[11px] text-blue-900 font-bold mt-1">Across all Company Branches</p>
          </div>

          <div className="bg-white p-4 border border-slate-300 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-500">Statutory PF & ESI Liability</span>
            <h3 className="text-2xl font-black text-blue-900 mt-2">₹{Math.round(totalPayout * 0.12).toLocaleString('en-IN')}</h3>
            <p className="text-[11px] text-emerald-700 font-bold mt-1">EPFO & ESIC Compliant</p>
          </div>

          <div className="bg-white p-4 border border-slate-300 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-500">Active Company Staff</span>
            <h3 className="text-2xl font-black text-slate-900 mt-2">{totalEmps} Employees</h3>
            <p className="text-[11px] text-slate-600 mt-1">Attendance Today: {presentToday} Present</p>
          </div>
        </div>
      </div>
    );
  }

  // 3. Super Admin & Admin View
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-300 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Authenticated Workspace • Role: {currentUser.role}
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Welcome back, {currentUser.name}
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl font-medium">
              S S CONSULTANCYY Industrial & Labour Law HRMS Portal — Multi-company Payroll, PF, ESI & Statutory Compliance Engine.
            </p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => onNavigate('payroll')}
              className="px-4 py-2.5 bg-blue-900 text-white font-bold text-xs hover:bg-blue-800 transition cursor-pointer"
            >
              Run Payroll Engine
            </button>
            <button 
              onClick={() => onNavigate('reports')}
              className="px-4 py-2.5 bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 hover:bg-slate-200 transition cursor-pointer"
            >
              Export PF & ESI Reports
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Client Companies</span>
            <div className="p-2 bg-blue-50 text-blue-900 border border-blue-200">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900">{companies.length}</h3>
            <p className="text-[11px] text-blue-900 font-bold flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" /> Statutory Registered
            </p>
          </div>
        </div>

        <div className="bg-white p-4 border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Total Workforce</span>
            <div className="p-2 bg-slate-100 text-slate-800 border border-slate-300">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900">{totalEmps} Active</h3>
            <p className="text-[11px] text-slate-600 font-medium mt-1">
              Across all registered units
            </p>
          </div>
        </div>

        <div className="bg-white p-4 border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Today&apos;s Attendance</span>
            <div className="p-2 bg-emerald-50 text-emerald-900 border border-emerald-200">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900">{presentToday} / {totalEmps}</h3>
            <p className="text-[11px] text-emerald-700 font-bold mt-1">
              {((presentToday / totalEmps) * 100).toFixed(0)}% Daily Present
            </p>
          </div>
        </div>

        <div className="bg-white p-4 border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Monthly Gross Payroll</span>
            <div className="p-2 bg-blue-50 text-blue-900 border border-blue-200">
              <Calculator className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900">₹{totalPayout.toLocaleString('en-IN')}</h3>
            <p className="text-[11px] text-blue-900 font-bold mt-1">
              Includes PF & ESI Calculations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
