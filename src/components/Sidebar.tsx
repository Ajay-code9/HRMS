'use client';

import React from 'react';
import { 
  Building2, Users, CalendarCheck, Calculator, FileText, 
  Settings, LogOut, Award, ShieldAlert, Package, 
  Sparkles, FileSpreadsheet, ShieldCheck, Clock, User
} from 'lucide-react';
import { UserAccount } from '@/data/authData';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserAccount;
  onLogout: () => void;
  demoDaysLeft: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab, setActiveTab, currentUser, onLogout, demoDaysLeft
}) => {
  const getRoleMenuItems = (role: string) => {
    switch (role) {
      case 'Super Admin': return [
        { id: 'dashboard',  label: 'Dashboard',               icon: Sparkles },
        { id: 'companies',  label: 'Companies & Onboarding',  icon: Building2 },
        { id: 'branches',   label: 'Company Branches',        icon: Building2 },
        { id: 'employees',  label: 'Employee Master',         icon: Users },
        { id: 'attendance', label: 'Attendance & Biometrics', icon: CalendarCheck },
        { id: 'payroll',    label: 'Payroll Engine',          icon: Calculator },
        { id: 'leaves',     label: 'Leave Management',        icon: Award },
        { id: 'assets',     label: 'Asset Management',        icon: Package },
        { id: 'documents',  label: 'Document Vault',          icon: FileText },
        { id: 'reports',    label: 'Statutory Reports',       icon: FileText },
        { id: 'import',     label: 'Data Import',             icon: FileSpreadsheet },
        { id: 'masters',    label: 'PF / ESI Parameters',     icon: Settings },
        { id: 'logs',       label: 'Audit Logs',              icon: ShieldAlert },
      ];

      case 'Admin': return [
        { id: 'dashboard',  label: 'Dashboard',               icon: Sparkles },
        { id: 'companies',  label: 'Client Companies',        icon: Building2 },
        { id: 'employees',  label: 'Employee Master',         icon: Users },
        { id: 'attendance', label: 'Attendance',              icon: CalendarCheck },
        { id: 'payroll',    label: 'Payroll & Arrears',       icon: Calculator },
        { id: 'leaves',     label: 'Leave Management',        icon: Award },
        { id: 'assets',     label: 'Assets',                  icon: Package },
        { id: 'reports',    label: 'PF ECR & ESI Returns',   icon: FileText },
        { id: 'masters',    label: 'Global Parameters',       icon: Settings },
      ];
      case 'Company Owner': return [
        { id: 'dashboard',      label: 'Owner Dashboard',       icon: Sparkles },
        { id: 'owner-control',  label: 'HR Permission Panel',   icon: ShieldCheck },
        { id: 'employees',      label: 'Workforce Master',       icon: Users },
        { id: 'attendance',     label: 'Attendance Log',         icon: CalendarCheck },
        { id: 'payroll',        label: 'Payroll Review',         icon: Calculator },
        { id: 'leaves',         label: 'Leave Approvals',        icon: Award },
        { id: 'reports',        label: 'Reports',                icon: FileText },
      ];
      case 'Company HR': return [
        { id: 'dashboard',  label: 'HR Dashboard',          icon: Sparkles },
        { id: 'employees',  label: 'Onboarding & Records',  icon: Users },
        { id: 'attendance', label: 'Daily Attendance',      icon: CalendarCheck },
        { id: 'leaves',     label: 'Leave Requests',        icon: Award },
        { id: 'payroll',    label: 'Salary Draft Engine',   icon: Calculator },
        { id: 'reports',    label: 'Payslips & Reports',    icon: FileText },
      ];
      case 'Consultant': return [
        { id: 'dashboard',  label: 'Compliance Dashboard', icon: Sparkles },
        { id: 'companies',  label: 'Client Register',       icon: Building2 },
        { id: 'employees',  label: 'Employee Directory',    icon: Users },
        { id: 'payroll',    label: 'Payroll Verification',  icon: Calculator },
        { id: 'reports',    label: 'EPFO & ESIC Returns',  icon: FileText },
      ];
      case 'Employee': return [
        { id: 'dashboard',    label: 'My Workspace',        icon: Sparkles },
        { id: 'my-attendance',label: 'My Attendance',       icon: Clock },
        { id: 'my-payslips',  label: 'My Payslips',         icon: FileText },
        { id: 'leaves',       label: 'Apply Leave',          icon: Award },
        { id: 'my-assets',    label: 'My Assets',            icon: Package },
        { id: 'my-profile',   label: 'My Profile',           icon: User },
      ];
      default: return [{ id: 'dashboard', label: 'Dashboard', icon: Sparkles }];
    }
  };

  const menuItems = getRoleMenuItems(currentUser.role);

  return (
    <aside style={{ background: 'var(--sidebar-bg)' }}
      className="w-64 flex flex-col h-screen sticky top-0 z-30 shadow-lg shrink-0">

      {/* Brand */}
      <div className="px-4 py-4 flex items-center gap-3"
        style={{ borderBottom: '1px solid var(--sidebar-border)', background: 'rgba(0,0,0,0.25)' }}>
        <div className="w-9 h-9 flex items-center justify-center font-black text-sm text-white shrink-0"
          style={{ background: 'var(--primary)' }}>
          SS
        </div>
        <div>
          <div className="font-bold text-white text-sm leading-none tracking-tight">S S Consultancy</div>
          <div className="text-xs mt-0.5 font-medium" style={{ color: 'var(--primary-mid)' }}>
            Labour Law · HRMS
          </div>
        </div>
      </div>

      {/* User Badge */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--sidebar-border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background: 'var(--primary)' }}>
            {currentUser.avatar}
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-semibold text-white truncate">{currentUser.name}</div>
            <span className="inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 mt-0.5"
              style={{ background: 'rgba(24,119,242,0.2)', color: 'var(--primary-mid)', border: '1px solid rgba(24,119,242,0.3)' }}>
              {currentUser.role}
            </span>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {menuItems.map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium transition-all cursor-pointer text-left"
              style={active
                ? { background: 'var(--primary)', color: '#fff', fontWeight: 600 }
                : { color: '#8BA3C7' }
              }
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--sidebar-hover)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8BA3C7'; } }}>
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 space-y-2" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
        <button onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold cursor-pointer transition"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.2)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}>
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
        <div className="text-center text-[10px]" style={{ color: '#8BA3C7' }}>
          Evaluation: <span className="font-bold font-mono" style={{ color: 'var(--primary-mid)' }}>{demoDaysLeft} days left</span>
        </div>
      </div>
    </aside>
  );
};
