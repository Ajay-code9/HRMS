'use client';

import React from 'react';
import { 
  Building2, Users, CalendarCheck, Calculator, FileText, 
  Settings, LogOut, Award, ShieldAlert, Package, 
  Sparkles, FileSpreadsheet, ShieldCheck, Clock, User, ChevronRight
} from 'lucide-react';
import { UserAccount } from '@/data/authData';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserAccount;
  onLogout: () => void;
  demoDaysLeft: number;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  section?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab, setActiveTab, currentUser, onLogout, demoDaysLeft
}) => {
  const getRoleMenuItems = (role: string): MenuItem[] => {
    switch (role) {
      case 'Super Admin': return [
        { id: 'dashboard',  label: 'Dashboard',               icon: Sparkles,        section: 'MAIN' },
        { id: 'companies',  label: 'Companies & Onboarding',  icon: Building2,       section: 'CORE MANAGEMENT' },
        { id: 'branches',   label: 'Company Branches',        icon: Building2,       section: 'CORE MANAGEMENT' },
        { id: 'employees',  label: 'Employee Master',         icon: Users,           section: 'CORE MANAGEMENT' },
        { id: 'attendance', label: 'Attendance & Biometrics', icon: CalendarCheck,   section: 'WORKFORCE & PAYROLL' },
        { id: 'payroll',    label: 'Payroll Engine',          icon: Calculator,      section: 'WORKFORCE & PAYROLL' },
        { id: 'leaves',     label: 'Leave Management',        icon: Award,           section: 'WORKFORCE & PAYROLL' },
        { id: 'assets',     label: 'Asset Management',        icon: Package,         section: 'WORKFORCE & PAYROLL' },
        { id: 'documents',  label: 'Document Vault',          icon: FileText,        section: 'REPORTS & VAULT' },
        { id: 'reports',    label: 'Statutory Reports',       icon: FileText,        section: 'REPORTS & VAULT' },
        { id: 'import',     label: 'Data Import',             icon: FileSpreadsheet, section: 'REPORTS & VAULT' },
        { id: 'masters',    label: 'PF / ESI Parameters',     icon: Settings,        section: 'ADMINISTRATION' },
        { id: 'logs',       label: 'Audit Logs',              icon: ShieldAlert,     section: 'ADMINISTRATION' },
      ];

      case 'Admin': return [
        { id: 'dashboard',  label: 'Dashboard',               icon: Sparkles,        section: 'MAIN' },
        { id: 'companies',  label: 'Client Companies',        icon: Building2,       section: 'CORE MANAGEMENT' },
        { id: 'employees',  label: 'Employee Master',         icon: Users,           section: 'CORE MANAGEMENT' },
        { id: 'attendance', label: 'Attendance',              icon: CalendarCheck,   section: 'WORKFORCE & PAYROLL' },
        { id: 'payroll',    label: 'Payroll & Arrears',       icon: Calculator,      section: 'WORKFORCE & PAYROLL' },
        { id: 'leaves',     label: 'Leave Management',        icon: Award,           section: 'WORKFORCE & PAYROLL' },
        { id: 'assets',     label: 'Assets',                  icon: Package,         section: 'WORKFORCE & PAYROLL' },
        { id: 'reports',    label: 'PF ECR & ESI Returns',   icon: FileText,        section: 'REPORTS & VAULT' },
        { id: 'masters',    label: 'Global Parameters',       icon: Settings,        section: 'ADMINISTRATION' },
      ];
      case 'Company Owner': return [
        { id: 'dashboard',      label: 'Owner Dashboard',       icon: Sparkles,        section: 'MAIN' },
        { id: 'owner-control',  label: 'HR Permission Panel',   icon: ShieldCheck,     section: 'ADMINISTRATION' },
        { id: 'employees',      label: 'Workforce Master',       icon: Users,           section: 'CORE MANAGEMENT' },
        { id: 'attendance',     label: 'Attendance Log',         icon: CalendarCheck,   section: 'WORKFORCE & PAYROLL' },
        { id: 'payroll',        label: 'Payroll Review',         icon: Calculator,      section: 'WORKFORCE & PAYROLL' },
        { id: 'leaves',         label: 'Leave Approvals',        icon: Award,           section: 'WORKFORCE & PAYROLL' },
        { id: 'reports',        label: 'Reports',                icon: FileText,        section: 'REPORTS & VAULT' },
      ];
      case 'Company HR': return [
        { id: 'dashboard',  label: 'HR Dashboard',          icon: Sparkles,        section: 'MAIN' },
        { id: 'employees',  label: 'Onboarding & Records',  icon: Users,           section: 'CORE MANAGEMENT' },
        { id: 'attendance', label: 'Daily Attendance',      icon: CalendarCheck,   section: 'WORKFORCE & PAYROLL' },
        { id: 'leaves',     label: 'Leave Requests',        icon: Award,           section: 'WORKFORCE & PAYROLL' },
        { id: 'payroll',    label: 'Salary Draft Engine',   icon: Calculator,      section: 'WORKFORCE & PAYROLL' },
        { id: 'reports',    label: 'Payslips & Reports',    icon: FileText,        section: 'REPORTS & VAULT' },
      ];
      case 'Consultant': return [
        { id: 'dashboard',  label: 'Compliance Dashboard', icon: Sparkles,        section: 'MAIN' },
        { id: 'companies',  label: 'Client Register',       icon: Building2,       section: 'CORE MANAGEMENT' },
        { id: 'employees',  label: 'Employee Directory',    icon: Users,           section: 'CORE MANAGEMENT' },
        { id: 'payroll',    label: 'Payroll Verification',  icon: Calculator,      section: 'WORKFORCE & PAYROLL' },
        { id: 'reports',    label: 'EPFO & ESIC Returns',  icon: FileText,        section: 'REPORTS & VAULT' },
      ];
      case 'Employee': return [
        { id: 'dashboard',    label: 'My Workspace',        icon: Sparkles,        section: 'MAIN' },
        { id: 'my-attendance',label: 'My Attendance',       icon: Clock,           section: 'MY SELF-SERVICE' },
        { id: 'my-payslips',  label: 'My Payslips',         icon: FileText,        section: 'MY SELF-SERVICE' },
        { id: 'leaves',       label: 'Apply Leave',          icon: Award,           section: 'MY SELF-SERVICE' },
        { id: 'my-assets',    label: 'My Assets',            icon: Package,         section: 'MY SELF-SERVICE' },
        { id: 'my-profile',   label: 'My Profile',           icon: User,            section: 'MY SELF-SERVICE' },
      ];
      default: return [{ id: 'dashboard', label: 'Dashboard', icon: Sparkles, section: 'MAIN' }];
    }
  };

  const menuItems = getRoleMenuItems(currentUser.role);
  let currentSection = '';

  return (
    <aside
      className="w-64 flex flex-col h-screen sticky top-0 z-30 shadow-2xl shrink-0 select-none"
      style={{
        background: 'linear-gradient(180deg, #090F1E 0%, #050811 100%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.07)'
      }}
    >
      {/* ── Brand Header ──────────────────────────────────────────────────────── */}
      <div className="p-4 flex items-center gap-3 border-b border-white/[0.07] bg-white/[0.02]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center font-black text-sm text-white shrink-0 shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
          SS
        </div>
        <div className="overflow-hidden">
          <div className="font-extrabold text-white text-sm leading-tight tracking-tight flex items-center gap-1.5">
            S S Consultancy
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" title="System Active" />
          </div>
          <div className="text-[11px] font-medium text-slate-400 tracking-wide mt-0.5 truncate">
            Labour Law · HRMS
          </div>
        </div>
      </div>

      {/* ── User Profile Card ─────────────────────────────────────────────────── */}
      <div className="p-3 mx-2 my-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-all">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0 ring-2 ring-blue-400/30 shadow-md">
            {currentUser.avatar}
          </div>
          <div className="overflow-hidden min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate leading-snug">{currentUser.name}</div>
            <div className="mt-0.5 flex items-center gap-1">
              <span className="inline-block text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 border border-blue-400/25 tracking-wide">
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Nav Items ─────────────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          const showSection = item.section && item.section !== currentSection;
          if (showSection) {
            currentSection = item.section!;
          }

          return (
            <React.Fragment key={item.id}>
              {showSection && (
                <div className={`text-[10px] font-extrabold text-slate-500 tracking-wider uppercase px-3 ${idx === 0 ? 'pt-1 pb-1.5' : 'pt-3 pb-1.5'}`}>
                  {item.section}
                </div>
              )}
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer group text-left ${
                  active
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {active && (
                    <div className="w-1 h-4 bg-cyan-300 rounded-full shadow-[0_0_8px_#67e8f9] shrink-0" />
                  )}
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {active && <ChevronRight className="w-3.5 h-3.5 text-cyan-200 shrink-0" />}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* ── Footer & Sign Out ──────────────────────────────────────────────────── */}
      <div className="p-3 space-y-2.5 border-t border-white/[0.07] bg-white/[0.01]">
        {/* Trial Progress Pill */}
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-950/50 to-indigo-950/50 border border-blue-500/20 text-center space-y-1.5 shadow-inner">
          <div className="text-[10px] font-bold text-slate-300 flex items-center justify-between">
            <span>Evaluation Plan</span>
            <span className="font-mono text-cyan-300 font-extrabold">{demoDaysLeft} days left</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (demoDaysLeft / 60) * 100)}%` }}
            />
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-rose-300 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 transition duration-200 cursor-pointer shadow-sm"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
};

