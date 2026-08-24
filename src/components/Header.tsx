'use client';

import React from 'react';
import { Search, LogOut, Clock, Bell } from 'lucide-react';
import { UserAccount } from '@/data/authData';

interface HeaderProps {
  currentUser: UserAccount;
  onLogout: () => void;
  onOpenUniversalSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, onOpenUniversalSearch }) => {
  return (
    <header className="h-14 bg-white px-5 flex items-center justify-between sticky top-0 z-30"
      style={{ borderBottom: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

      {/* Left — Brand + Search */}
      <div className="flex items-center gap-5">
        <div>
          <div className="font-bold text-sm leading-none" style={{ color: 'var(--foreground)' }}>
            S S Consultancy HRMS
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: 'var(--primary)' }}>
            Labour Law · Payroll · PF · ESI
          </div>
        </div>

        {/* Universal Search */}
        <button onClick={onOpenUniversalSearch}
          className="hidden md:flex items-center gap-3 px-3 py-2 text-sm cursor-pointer transition"
          style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--muted)', width: 320 }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}>
          <Search className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--primary)' }} />
          <span className="flex-1 text-left text-xs">Search employees, companies, UAN, PAN...</span>
          <kbd className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-white"
            style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}>Ctrl K</kbd>
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Demo pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold"
          style={{ background: '#FEF3C7', border: '1px solid #FCD34D', color: '#92400E' }}>
          <Clock className="w-3 h-3" />
          <span>60-Day Demo</span>
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 cursor-pointer transition"
          style={{ color: 'var(--muted)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--primary)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; }}>
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2"
            style={{ background: 'var(--primary)', border: '1.5px solid white' }} />
        </button>

        {/* User Avatar + Role */}
        <div className="flex items-center gap-2.5 pl-3" style={{ borderLeft: '1px solid var(--border)' }}>
          <div className="w-8 h-8 flex items-center justify-center text-xs font-bold text-white"
            style={{ background: 'var(--primary)' }}>
            {currentUser.avatar || currentUser.name.charAt(0)}
          </div>
          <div className="hidden lg:block">
            <div className="text-xs font-semibold leading-none" style={{ color: 'var(--foreground)' }}>
              {currentUser.name}
            </div>
            <div className="text-[10px] font-bold uppercase font-mono mt-0.5" style={{ color: 'var(--primary)' }}>
              {currentUser.role}
            </div>
          </div>
        </div>

        {/* Logout */}
        <button onClick={onLogout}
          className="p-2 cursor-pointer transition"
          style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#DC2626'; (e.currentTarget as HTMLElement).style.borderColor = '#FCA5A5'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}>
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
