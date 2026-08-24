'use client';

import React, { useState, useEffect } from 'react';
import { Search, Building2, Users, FileText, MapPin, Key, X, ArrowRight, ShieldAlert, DollarSign } from 'lucide-react';
import { Employee, Company, LeaveRequest } from '@/types/hrms';

interface UniversalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  companies: Company[];
  leaves: LeaveRequest[];
  onSelectEntity: (tab: string) => void;
}

export const UniversalSearchModal: React.FC<UniversalSearchProps> = ({
  isOpen,
  onClose,
  employees,
  companies,
  leaves,
  onSelectEntity
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Multi-Entity Search Matching Engine
  const matchedEmployees = q ? employees.filter(e => 
    e.name.toLowerCase().includes(q) ||
    e.empCode.toLowerCase().includes(q) ||
    e.pfNumber.toLowerCase().includes(q) ||
    e.uanNumber.toLowerCase().includes(q) ||
    e.esiNumber.toLowerCase().includes(q) ||
    e.department.toLowerCase().includes(q) ||
    e.email.toLowerCase().includes(q)
  ) : [];

  const matchedCompanies = q ? companies.filter(c => 
    c.name.toLowerCase().includes(q) ||
    c.code.toLowerCase().includes(q) ||
    c.pfCode.toLowerCase().includes(q) ||
    c.esiCode.toLowerCase().includes(q) ||
    c.city.toLowerCase().includes(q) ||
    c.state.toLowerCase().includes(q)
  ) : [];

  const matchedLeaves = q ? leaves.filter(l => 
    l.empName.toLowerCase().includes(q) ||
    l.leaveType.toLowerCase().includes(q) ||
    l.reason.toLowerCase().includes(q) ||
    l.status.toLowerCase().includes(q)
  ) : [];

  const totalResults = matchedEmployees.length + matchedCompanies.length + matchedLeaves.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-start justify-center pt-16 px-4">
      <div className="bg-white w-full max-w-3xl border-2 border-blue-900 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Universal Search Input Header */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-blue-900 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search across 100,000+ Records by Employee Name, PF/ESI No, UAN, Aadhaar, PAN, Company Code, City..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none placeholder:font-normal placeholder:text-slate-400"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-mono font-bold border border-slate-300 shrink-0">
            ESC to close
          </span>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto space-y-4 divide-y divide-slate-200">
          {!q && (
            <div className="text-center py-8 space-y-2">
              <div className="w-12 h-12 bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-900 font-bold">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Universal Big-Data Spotlight Engine</h4>
              <p className="text-xs text-slate-500">Type any Employee Name, PF Number, UAN, Company Code, or Department to search instant results.</p>
            </div>
          )}

          {q && totalResults === 0 && (
            <div className="text-center py-8 space-y-2">
              <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800">No matching records found for &quot;{query}&quot;</h4>
              <p className="text-xs text-slate-500">Try searching with a different Employee Code, PF Number, or Company Name.</p>
            </div>
          )}

          {/* Matched Employees */}
          {matchedEmployees.length > 0 && (
            <div className="pt-3 space-y-2">
              <h5 className="text-[11px] font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Employee Records ({matchedEmployees.length})
              </h5>
              <div className="space-y-1.5">
                {matchedEmployees.slice(0, 5).map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => {
                      onSelectEntity('employees');
                      onClose();
                    }}
                    className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{emp.name}</span>
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-900 font-mono font-bold text-[10px]">{emp.empCode}</span>
                        <span className="text-[11px] text-slate-500">• {emp.companyName}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono mt-0.5">
                        PF: <span className="font-bold text-blue-900">{emp.pfNumber}</span> | UAN: <span className="font-bold text-blue-900">{emp.uanNumber}</span> | ESI: <span className="font-bold text-blue-900">{emp.esiNumber}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-900 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Companies */}
          {matchedCompanies.length > 0 && (
            <div className="pt-3 space-y-2">
              <h5 className="text-[11px] font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Company Clients ({matchedCompanies.length})
              </h5>
              <div className="space-y-1.5">
                {matchedCompanies.map((comp) => (
                  <div
                    key={comp.id}
                    onClick={() => {
                      onSelectEntity('company');
                      onClose();
                    }}
                    className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{comp.name}</span>
                        <span className="px-1.5 py-0.5 bg-slate-200 text-slate-900 font-mono font-bold text-[10px]">{comp.code}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-blue-900" /> {comp.city}, {comp.state} | PF Code: {comp.pfCode}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-900 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Leave Applications */}
          {matchedLeaves.length > 0 && (
            <div className="pt-3 space-y-2">
              <h5 className="text-[11px] font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Leave Requests ({matchedLeaves.length})
              </h5>
              <div className="space-y-1.5">
                {matchedLeaves.map((lv) => (
                  <div
                    key={lv.id}
                    onClick={() => {
                      onSelectEntity('leaves');
                      onClose();
                    }}
                    className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{lv.empName}</span>
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 font-bold text-[10px]">{lv.leaveType}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5">{lv.status}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        {lv.fromDate} to {lv.toDate} ({lv.days} Days) - &quot;{lv.reason}&quot;
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-900 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
