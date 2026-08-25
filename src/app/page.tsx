'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { LoginView } from '@/components/LoginView';
import { UniversalSearchModal } from '@/components/UniversalSearchModal';
import { DashboardView } from '@/components/DashboardView';
import { CompanySetupView } from '@/components/CompanySetupView';
import { EmployeeView } from '@/components/EmployeeView';
import { AttendanceView } from '@/components/AttendanceView';
import { PayrollView } from '@/components/PayrollView';
import { LeaveView } from '@/components/LeaveView';
import { ReportsView } from '@/components/ReportsView';
import { AssetView } from '@/components/AssetView';
import { SettingsLogsView } from '@/components/SettingsLogsView';
import { OwnerControlPanel } from '@/components/OwnerControlPanel';

import { PRESET_ACCOUNTS, UserAccount, HRPermissions } from '@/data/authData';
import {
  Company, Employee, AttendanceRecord, LeaveRequest,
  GlobalParameter, AuditLog, PayrollRecord, AssetRecord
} from '@/types/hrms';
import { api } from '@/lib/api';

// ─── Mock Seed Data ───────────────────────────────────────────────────────────
const MOCK_COMPANIES: Company[] = [
  {
    id: 'comp-1', name: 'SS Consultancy Services', code: 'SSC001',
    pfCode: 'CHD/12345/SSC', esiCode: '123456789012345',
    branchesCount: 3, employeeCount: 45,
    contactPerson: 'S. K. Sharma', phone: '9872989284',
    email: 'sscchd@gmail.com', city: 'Chandigarh', state: 'Chandigarh'
  },
  {
    id: 'comp-2', name: 'Apex Industrial Tech Ltd', code: 'APX002',
    pfCode: 'PBR/98765/APX', esiCode: '987654321098765',
    branchesCount: 5, employeeCount: 120,
    contactPerson: 'Vikramaditya Mehta', phone: '9812345678',
    email: 'owner@apextech.com', city: 'Ludhiana', state: 'Punjab'
  }
];

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'emp-101', empCode: 'SSC-101', name: 'Rohan Sharma',
    companyId: 'comp-1', companyName: 'SS Consultancy Services',
    department: 'Legal Compliance', designation: 'Senior Consultant',
    phone: '9876543210', email: 'employee@sscchd.in',
    joiningDate: '2023-01-15', bankName: 'HDFC Bank',
    accountNo: '50100234567890', ifsc: 'HDFC0000123',
    pfNumber: 'CHD/12345/SSC/0000101', uanNumber: '100987654321',
    esiNumber: '1234567890', panNumber: 'ABCDE1234F',
    basicSalary: 35000, hra: 14000, conveyance: 3000,
    specialAllowance: 8000, status: 'Active', loginPassword: 'Emp@123'
  },
  {
    id: 'emp-102', empCode: 'APX-102', name: 'Gurpreet Singh',
    companyId: 'comp-2', companyName: 'Apex Industrial Tech Ltd',
    department: 'Manufacturing', designation: 'Plant Engineer',
    phone: '9812345679', email: 'gurpreet@apextech.com',
    joiningDate: '2022-03-01', bankName: 'Punjab National Bank',
    accountNo: '1234567890123', ifsc: 'PUNB0001234',
    pfNumber: 'PBR/98765/APX/0000102', uanNumber: '100123456789',
    esiNumber: '9876543210', panNumber: 'PQRST5678G',
    basicSalary: 28000, hra: 11200, conveyance: 2000,
    specialAllowance: 5000, status: 'Active', loginPassword: 'Emp@456'
  }
];

const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att-1', empId: 'emp-101', empName: 'Rohan Sharma', date: '2026-08-24', inTime: '09:15 AM', outTime: '06:30 PM', status: 'Present', overtimeHours: 0.5, source: 'Biometric' },
  { id: 'att-2', empId: 'emp-102', empName: 'Gurpreet Singh', date: '2026-08-24', inTime: '08:45 AM', outTime: '05:45 PM', status: 'Present', overtimeHours: 0, source: 'Biometric' }
];

const MOCK_LEAVES: LeaveRequest[] = [
  { id: 'lv-1', empId: 'emp-101', empName: 'Rohan Sharma', leaveType: 'Casual', fromDate: '2026-08-28', toDate: '2026-08-29', days: 2, reason: 'Family function', status: 'Approved', approvedBy: 'Ananya Verma (Company HR)', approvedAt: '2026-08-24 16:30 PM', approvalRemarks: 'Approved.' },
  { id: 'lv-2', empId: 'emp-102', empName: 'Gurpreet Singh', leaveType: 'Sick', fromDate: '2026-08-26', toDate: '2026-08-26', days: 1, reason: 'Fever', status: 'Pending' }
];

const MOCK_ASSETS: AssetRecord[] = [
  { id: 'ast-1', assetName: 'Dell Latitude 5520 Laptop', category: 'Laptop', serialNumber: 'DLL52-2024-001', assignedTo: 'Rohan Sharma', allocatedDate: '2023-01-15', status: 'Allocated' },
  { id: 'ast-2', assetName: 'ZKTeco Biometric Terminal', category: 'Biometric Device', serialNumber: 'ZKT-BIO-0023', assignedTo: 'Reception Desk', allocatedDate: '2022-06-01', status: 'Allocated' },
  { id: 'ast-3', assetName: 'HP LaserJet Pro M404', category: 'Printer', serialNumber: 'HPL-M404-007', assignedTo: 'HR Department', allocatedDate: '2023-03-10', status: 'Allocated' }
];

const MOCK_LOGS: AuditLog[] = [
  { id: 'log-1', timestamp: '2026-08-24 18:30 PM', user: 'S. K. Sharma', role: 'Super Admin', action: 'SYSTEM_LOGIN', details: 'Logged into HRMS Portal', ipAddress: '192.168.1.1' },
  { id: 'log-2', timestamp: '2026-08-24 17:12 PM', user: 'Ananya Verma', role: 'Company HR', action: 'LEAVE_APPROVED', details: 'Approved leave for Rohan Sharma (2 days)', ipAddress: '192.168.1.5' },
  { id: 'log-3', timestamp: '2026-08-24 15:45 PM', user: 'Vikramaditya Mehta', role: 'Company Owner', action: 'PAYROLL_REVIEWED', details: 'Reviewed August 2026 Payroll Register', ipAddress: '192.168.1.8' }
];

const DEFAULT_GLOBAL_PARAMS: GlobalParameter = {
  pfEmployeeRate: 12.0, pfEmployerRate: 12.0, pfCapLimit: 15000,
  esiEmployeeRate: 0.75, esiEmployerRate: 3.25, esiCapLimit: 21000,
};

const MOCK_HR_USER: UserAccount = {
  id: 'user-hr', email: 'hr@apextech.com', password: 'Company@123',
  name: 'Ananya Verma (Company HR)', role: 'Company HR',
  companyName: 'Apex Industrial Tech Ltd', avatar: 'AV',
  hrPermissions: { canAddEmployees: true, canViewSalary: true, canApproveLeaves: true, canRunPayroll: false }
};

// ─── PlaceholderPage for tabs not fully built yet ────────────────────────────
const ComingSoonPage = ({ title, description }: { title: string; description: string }) => (
  <div className="bg-white p-10 border border-slate-300 shadow-sm text-center space-y-3">
    <div className="w-16 h-16 bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-3xl font-bold text-blue-900">
      📋
    </div>
    <h2 className="text-xl font-extrabold text-slate-900">{title}</h2>
    <p className="text-sm text-slate-500 max-w-md mx-auto">{description}</p>
    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
      Phase 2 — Coming Soon
    </span>
  </div>
);

// ─── My Attendance (Employee Self-Service) ────────────────────────────────────
const MyAttendancePage = ({ currentUser, attendance }: { currentUser: UserAccount; attendance: AttendanceRecord[] }) => {
  const myRecords = attendance.filter(a => a.empName.includes(currentUser.name.split(' ')[0]));
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 border border-slate-300 shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-900">My Daily Attendance & Punch Record</h2>
        <p className="text-xs text-slate-500 mt-1">View your attendance logs, in/out times, and overtime hours.</p>
      </div>
      <div className="bg-white border border-slate-300 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-300">
            <tr>
              <th className="p-3 border-r border-slate-200">Date</th>
              <th className="p-3 border-r border-slate-200">In Time</th>
              <th className="p-3 border-r border-slate-200">Out Time</th>
              <th className="p-3 border-r border-slate-200">Status</th>
              <th className="p-3">OT Hours</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {myRecords.length > 0 ? myRecords.map(r => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="p-3 border-r border-slate-200 font-mono font-bold">{r.date}</td>
                <td className="p-3 border-r border-slate-200 font-mono">{r.inTime}</td>
                <td className="p-3 border-r border-slate-200 font-mono">{r.outTime}</td>
                <td className="p-3 border-r border-slate-200">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px]">{r.status}</span>
                </td>
                <td className="p-3 font-mono font-bold text-blue-900">{r.overtimeHours}h</td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="p-6 text-center text-slate-400 text-xs">No attendance records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── My Profile (Employee Self-Service) ──────────────────────────────────────
const MyProfilePage = ({ currentUser, employees }: { currentUser: UserAccount; employees: Employee[] }) => {
  const me = employees.find(e => e.email === currentUser.email) || employees[0];
  if (!me) return <ComingSoonPage title="My Profile" description="Your profile is being set up." />;
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 border border-slate-300 shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-900">My Statutory Profile & Bank Details</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 border border-slate-300 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2">Personal Details</h3>
          {[['Employee Code', me.empCode], ['Full Name', me.name], ['Department', me.department], ['Designation', me.designation], ['Joining Date', me.joiningDate], ['PAN Number', me.panNumber]].map(([label, value]) => (
            <div key={label} className="flex justify-between text-xs">
              <span className="text-slate-500 font-semibold">{label}:</span>
              <span className="font-bold text-slate-900">{value}</span>
            </div>
          ))}
        </div>
        <div className="bg-white p-5 border border-slate-300 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2">Statutory & Bank Info</h3>
          {[['Bank Name', me.bankName], ['Account No', me.accountNo], ['IFSC Code', me.ifsc], ['PF Number', me.pfNumber], ['UAN Number', me.uanNumber], ['ESI Number', me.esiNumber]].map(([label, value]) => (
            <div key={label} className="flex justify-between text-xs">
              <span className="text-slate-500 font-semibold">{label}:</span>
              <span className="font-mono font-bold text-blue-900">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── My Payslips (Employee Self-Service) ─────────────────────────────────────
const MyPayslipsPage = ({ currentUser, employees }: { currentUser: UserAccount; employees: Employee[] }) => {
  const me = employees.find(e => e.email === currentUser.email) || employees[0];
  const gross = me ? me.basicSalary + me.hra + me.conveyance + me.specialAllowance : 0;
  const pf = me ? Math.round(Math.min(me.basicSalary, 15000) * 0.12) : 0;
  const esi = me && gross <= 21000 ? Math.round(gross * 0.0075) : 0;
  const net = gross - pf - esi;
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 border border-slate-300 shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-900">My Salary Slips & PDF Download</h2>
        <p className="text-xs text-slate-500 mt-1">Access and download your monthly salary slips in PDF format.</p>
      </div>
      {me && (
        <div className="bg-white p-6 border border-slate-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900">August 2026 — Salary Slip</h3>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300">Paid</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 p-3 bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-blue-900 uppercase text-[10px]">Earnings</h4>
              {[['Basic Salary', me.basicSalary], ['HRA', me.hra], ['Conveyance', me.conveyance], ['Special Allow.', me.specialAllowance]].map(([l, v]) => (
                <div key={String(l)} className="flex justify-between"><span className="text-slate-600">{l}:</span><span className="font-bold">₹{Number(v).toLocaleString('en-IN')}</span></div>
              ))}
              <div className="flex justify-between border-t border-slate-300 pt-1 font-black text-blue-950"><span>Gross Total:</span><span>₹{gross.toLocaleString('en-IN')}</span></div>
            </div>
            <div className="space-y-2 p-3 bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-rose-900 uppercase text-[10px]">Deductions</h4>
              {[['EPF (12%)', pf], ['ESIC (0.75%)', esi]].map(([l, v]) => (
                <div key={String(l)} className="flex justify-between"><span className="text-slate-600">{l}:</span><span className="font-bold text-rose-700">₹{Number(v).toLocaleString('en-IN')}</span></div>
              ))}
              <div className="flex justify-between border-t border-slate-300 pt-1 font-black text-emerald-800"><span>Net In-Hand:</span><span>₹{net.toLocaleString('en-IN')}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Import Previous Data ─────────────────────────────────────────────────────
const ImportDataPage = () => (
  <div className="space-y-6">
    <div className="bg-white p-5 border border-slate-300 shadow-sm">
      <h2 className="text-xl font-extrabold text-slate-900">Import Previous Years Data</h2>
      <p className="text-xs text-slate-500 mt-1">Upload historical payroll, attendance, and employee data from Excel or SQL dumps.</p>
    </div>
    <div className="bg-white p-8 border-2 border-dashed border-slate-300 text-center space-y-4">
      <div className="text-4xl">📂</div>
      <h3 className="font-bold text-slate-800">Drag & Drop Excel / SQL Dump Files</h3>
      <p className="text-xs text-slate-500">Supports: .xlsx, .xls, .csv, .sql format for historical payroll data</p>
      <label className="inline-block px-6 py-2.5 bg-blue-900 text-white font-bold text-xs cursor-pointer hover:bg-blue-800">
        Choose Import File
        <input type="file" accept=".xlsx,.xls,.csv,.sql" className="hidden" onChange={() => alert('File selected for import!')} />
      </label>
    </div>
  </div>
);

// ─── Global Masters ───────────────────────────────────────────────────────────
const GlobalMastersPage = ({ globalParams, logs, onSaveParams }: { globalParams: GlobalParameter; logs: AuditLog[]; onSaveParams: (p: GlobalParameter) => void }) => (
  <SettingsLogsView globalParams={globalParams} logs={logs} onSaveParams={onSaveParams} />
);


// ─── Main App Container ───────────────────────────────────────────────────────
export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(MOCK_LEAVES);
  const [assets] = useState<AssetRecord[]>(MOCK_ASSETS);
  const [payroll] = useState<PayrollRecord[]>([]);
  const [globalParams, setGlobalParams] = useState<GlobalParameter>(DEFAULT_GLOBAL_PARAMS);
  const [hrUser, setHrUser] = useState<UserAccount>(MOCK_HR_USER);

  // Load initial data from Backend API (with fallback to mock)
  useEffect(() => {
    api.getCompanies().then(res => {
      if (res && res.length > 0) setCompanies(res);
    });
    api.getEmployees().then(res => {
      if (res && res.length > 0) setEmployees(res);
    });
    api.getLeaves().then(res => {
      if (res && res.length > 0) setLeaves(res);
    });
  }, []);

  // Global Ctrl+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleLogin = (user: UserAccount) => { setCurrentUser(user); setActiveTab('dashboard'); };
  const handleLogout = () => { setCurrentUser(null); };

  const handleAddCompany = async (c: Company) => {
    setCompanies(prev => [c, ...prev]);
    await api.addCompany(c);
  };

  const handleAddEmployee = async (e: Employee) => {
    setEmployees(prev => [e, ...prev]);
    await api.addEmployee(e);
  };

  const handleUpdateEmployee = (updated: Employee) => setEmployees(employees.map(e => e.id === updated.id ? updated : e));
  const handleBulkUpload = (emps: Employee[]) => setEmployees([...emps, ...employees]);
  const handleUpdateAttendance = (recs: AttendanceRecord[]) => setAttendance(recs);

  const handleApplyLeave = async (lv: LeaveRequest) => {
    setLeaves(prev => [lv, ...prev]);
    await api.addLeaveRequest(lv);
  };

  const handleApproveLeave = async (id: string, by: string, rem: string) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'Approved', approvedBy: by, approvedAt: new Date().toLocaleString(), approvalRemarks: rem } : l));
    await api.approveLeave(id, by, rem);
  };

  const handleRejectLeave = async (id: string, by: string, rem: string) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'Rejected', approvedBy: by, approvedAt: new Date().toLocaleString(), approvalRemarks: rem } : l));
    await api.rejectLeave(id, by, rem);
  };

  const handleUpdatePermissions = (perms: HRPermissions) =>
    setHrUser(prev => ({ ...prev, hrPermissions: perms }));


  if (!currentUser) return <LoginView onLoginSuccess={handleLogin} />;

  const canViewSalary = currentUser.role === 'Company HR'
    ? (currentUser.hrPermissions?.canViewSalary ?? true)
    : true;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView companies={companies} employees={employees} attendance={attendance} payroll={payroll} onNavigate={setActiveTab} currentUser={currentUser} />;
      case 'companies':
      case 'company':
        return <CompanySetupView companies={companies} onAddCompany={handleAddCompany} />;
      case 'employees':
        return (
          <EmployeeView
            employees={employees}
            companies={companies}
            currentUser={currentUser}
            onAddEmployee={handleAddEmployee}
            onUpdateEmployee={handleUpdateEmployee}
            onBulkUpload={handleBulkUpload}
            canViewSalary={canViewSalary}
          />
        );
      case 'attendance':
        return <AttendanceView attendance={attendance} employees={employees} onUpdateAttendance={handleUpdateAttendance} />;
      case 'payroll':
        return <PayrollView employees={employees} attendance={attendance} globalParams={globalParams} />;
      case 'leaves':
        return <LeaveView leaves={leaves} currentUser={currentUser} onApproveLeave={handleApproveLeave} onRejectLeave={handleRejectLeave} onAddLeaveRequest={handleApplyLeave} />;
      case 'reports':
        return <ReportsView employees={employees} companies={companies} />;
      case 'assets':
      case 'my-assets':
        return <AssetView assets={assets} />;
      case 'owner-control':
      case 'owner-controls':
        return currentUser.role === 'Company Owner'
          ? <OwnerControlPanel currentUser={currentUser} hrUser={hrUser} onUpdatePermissions={handleUpdatePermissions} />
          : <ComingSoonPage title="Access Restricted" description="This section is only accessible to Company Owner." />;
      case 'masters':
      case 'settings':
      case 'logs':
        return <SettingsLogsView globalParams={globalParams} logs={MOCK_LOGS} onSaveParams={setGlobalParams} />;
      case 'import':
        return <ImportDataPage />;
      case 'my-attendance':
        return <MyAttendancePage currentUser={currentUser} attendance={attendance} />;
      case 'my-payslips':
        return <MyPayslipsPage currentUser={currentUser} employees={employees} />;
      case 'my-profile':
        return <MyProfilePage currentUser={currentUser} employees={employees} />;
      default:
        return <DashboardView companies={companies} employees={employees} attendance={attendance} payroll={payroll} onNavigate={setActiveTab} currentUser={currentUser} />;
    }
  };

  return (
    <div className="h-screen overflow-hidden flex antialiased font-sans" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <UniversalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        employees={employees}
        companies={companies}
        leaves={leaves}
        onSelectEntity={(tab) => { setActiveTab(tab); setIsSearchOpen(false); }}
      />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} currentUser={currentUser} onLogout={handleLogout} demoDaysLeft={60} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header currentUser={currentUser} onLogout={handleLogout} onOpenUniversalSearch={() => setIsSearchOpen(true)} />
        <main className="flex-1 p-6 overflow-y-auto" style={{ minHeight: 0 }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
