'use client';

import React, { useState } from 'react';
import { Building2, Plus, MapPin, Phone, Mail, Edit3, Layers, CreditCard, Landmark, DollarSign, BookOpen } from 'lucide-react';
import { Company } from '@/types/hrms';
import { INDIAN_STATES, INDIAN_CITIES, INDUSTRY_MASTERS } from '@/data/indianMastersData';

interface CompanySetupProps {
  companies: Company[];
  onAddCompany: (company: Company) => void;
}

export const CompanySetupView: React.FC<CompanySetupProps> = ({ companies, onAddCompany }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'depts' | 'deductions' | 'loans'>('basic');
  const [showModal, setShowModal] = useState(false);
  const [useCustomCity, setUseCustomCity] = useState(false);
  const [customCityName, setCustomCityName] = useState('');

  // Sub-module State (Req 3: Departments, Designations, Deductions, Loans/Advances)
  const [departments, setDepartments] = useState(['Operations', 'Legal Compliance', 'Payroll & HR', 'Manufacturing', 'Finance']);
  const [designations, setDesignations] = useState(['Senior Consultant', 'Payroll Manager', 'Plant Engineer', 'Machine Operator', 'Executive']);
  const [deductions, setDeductions] = useState([
    { name: 'Provident Fund (EPF)', type: 'Statutory 12%' },
    { name: 'Employees State Insurance (ESI)', type: 'Statutory 0.75%' },
    { name: 'Professional Tax (PT)', type: 'State Statutory' },
    { name: 'TDS Income Tax', type: 'Tax Deduction' }
  ]);
  const [loans, setLoans] = useState([
    { empName: 'Rohan Sharma', loanType: 'Personal Advance', amount: 15000, monthlyDeduction: 2500, status: 'Active' },
    { empName: 'Gurpreet Singh', loanType: 'Festival Advance', amount: 5000, monthlyDeduction: 1000, status: 'Active' }
  ]);

  const [selectedStateId, setSelectedStateId] = useState<number>(30);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    pfCode: '',
    esiCode: '',
    branchesCount: 1,
    employeeCount: 0,
    contactPerson: '',
    phone: '',
    email: '',
    city: 'Chandigarh (Sector 1 to 63)',
    state: 'Chandigarh',
    industry: 'Information Technology',
    industryType: 'Regular'
  });

  const availableCities = INDIAN_CITIES.filter(c => c.stateId === Number(selectedStateId));

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sId = Number(e.target.value);
    const selectedStateObj = INDIAN_STATES.find(s => s.id === sId);
    setSelectedStateId(sId);

    const firstCity = INDIAN_CITIES.find(c => c.stateId === sId)?.name || '';
    setFormData({
      ...formData,
      state: selectedStateObj ? selectedStateObj.name : '',
      city: firstCity
    });
    setUseCustomCity(false);
    setCustomCityName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    const finalCity = useCustomCity && customCityName.trim() ? customCityName.trim() : formData.city;

    const newCompany: Company = {
      id: `comp-${Date.now()}`,
      ...formData,
      city: finalCity
    };
    onAddCompany(newCompany);
    setShowModal(false);
    setUseCustomCity(false);
    setCustomCityName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-900" /> Companies Master & Complete Setup Suite (Req 3)
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            Basic Info, Branches, Departments, Designations, Statutory Deductions, Loans & Advances.
          </p>
        </div>

        {/* Sub-Module Navigation Tabs */}
        <div className="flex bg-slate-100 p-1 border border-slate-300">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'basic' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Basic Info & Branches
          </button>
          <button
            onClick={() => setActiveTab('depts')}
            className={`px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'depts' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Departments & Designations
          </button>
          <button
            onClick={() => setActiveTab('deductions')}
            className={`px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'deductions' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Deductions Master
          </button>
          <button
            onClick={() => setActiveTab('loans')}
            className={`px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'loans' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Advances & Loans
          </button>
        </div>
      </div>

      {/* Tab 1: Basic Info & Companies Grid */}
      {activeTab === 'basic' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-800 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add New Company Client
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((c) => (
              <div key={c.id} className="bg-white p-5 border border-slate-300 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-950 text-[10px] font-mono font-bold uppercase border border-blue-200">
                        {c.code}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-2 leading-snug">{c.name}</h3>
                    </div>
                    <div className="w-8 h-8 bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-xs">
                      {c.branchesCount} B
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="p-3 bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex justify-between font-mono text-[11px]">
                        <span className="text-slate-600">PF Code:</span>
                        <span className="text-blue-950 font-bold">{c.pfCode}</span>
                      </div>
                      <div className="flex justify-between font-mono text-[11px]">
                        <span className="text-slate-600">ESI Code:</span>
                        <span className="text-blue-900 font-bold">{c.esiCode}</span>
                      </div>
                    </div>

                    <div className="pt-2 text-slate-700 space-y-1">
                      <p className="flex items-center gap-2 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-blue-900" /> {c.city}, {c.state}
                      </p>
                      <p className="flex items-center gap-2 text-[11px]">
                        <Phone className="w-3.5 h-3.5 text-blue-900" /> {c.phone} ({c.contactPerson})
                      </p>
                      <p className="flex items-center gap-2 text-[11px]">
                        <Mail className="w-3.5 h-3.5 text-blue-900" /> {c.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-600">Active Workforce:</span>
                  <span className="font-bold text-slate-900 bg-slate-100 border border-slate-300 px-2.5 py-1 text-xs">
                    {c.employeeCount} Employees
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Departments & Designations */}
      {activeTab === 'depts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 border border-slate-300 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-900" /> Department Master List
            </h3>
            <div className="space-y-2">
              {departments.map((d, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 flex justify-between items-center">
                  <span>{d}</span>
                  <span className="text-[10px] text-blue-900 font-mono">DEP-0{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 border border-slate-300 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-900" /> Designation Master List
            </h3>
            <div className="space-y-2">
              {designations.map((desg, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 flex justify-between items-center">
                  <span>{desg}</span>
                  <span className="text-[10px] text-blue-900 font-mono">DESG-0{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Deductions Master */}
      {activeTab === 'deductions' && (
        <div className="bg-white p-5 border border-slate-300 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-900" /> Statutory & Company Deductions Master
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {deductions.map((ded, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900">{ded.name}</h4>
                <p className="text-[11px] text-blue-900 font-bold">{ded.type}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Advances & Loans */}
      {activeTab === 'loans' && (
        <div className="bg-white p-5 border border-slate-300 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-900" /> Employee Advances & Loan Ledger (Req 3.k)
          </h3>
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-300">
              <tr>
                <th className="p-3 border-r border-slate-200">Employee Name</th>
                <th className="p-3 border-r border-slate-200">Advance Type</th>
                <th className="p-3 border-r border-slate-200 text-right">Total Amount</th>
                <th className="p-3 border-r border-slate-200 text-right">Monthly Deduction</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {loans.map((l, idx) => (
                <tr key={idx}>
                  <td className="p-3 border-r border-slate-200 font-bold text-slate-900">{l.empName}</td>
                  <td className="p-3 border-r border-slate-200 text-slate-700">{l.loanType}</td>
                  <td className="p-3 border-r border-slate-200 text-right font-mono text-blue-900 font-bold">₹{l.amount}</td>
                  <td className="p-3 border-r border-slate-200 text-right font-mono text-rose-700 font-bold">₹{l.monthlyDeduction}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Company Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl p-6 border-2 border-blue-900 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-900" /> Register Company Client
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Company Full Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Apex Industrial Solutions" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Company Code *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. AIS004" 
                    value={formData.code}
                    onChange={e => setFormData({...formData, code: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Select State / UT *</label>
                  <select
                    value={selectedStateId}
                    onChange={handleStateChange}
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-bold"
                  >
                    {INDIAN_STATES.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Select City *</label>
                  <select
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-bold"
                  >
                    {availableCities.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 text-white font-bold"
                >
                  Save Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
