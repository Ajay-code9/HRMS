'use client';

import React, { useState } from 'react';
import { Building2, Plus, MapPin, Phone, Mail, Layers, CreditCard, Landmark, BookOpen, ShieldCheck, FileText, CheckCircle2, User } from 'lucide-react';
import { Company, Employee } from '@/types/hrms';
import { INDIAN_STATES, INDIAN_CITIES } from '@/data/indianMastersData';

interface CompanySetupProps {
  companies: Company[];
  employees?: Employee[];
  onAddCompany: (company: Company) => void;
}

export const CompanySetupView: React.FC<CompanySetupProps> = ({ companies, employees = [], onAddCompany }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'depts' | 'deductions' | 'loans'>('basic');
  const [showModal, setShowModal] = useState(false);
  const [modalSection, setModalSection] = useState<'basic' | 'statutory' | 'address' | 'contact' | 'bank'>('basic');
  const [useCustomCity, setUseCustomCity] = useState(false);
  const [customCityName, setCustomCityName] = useState('');

  // Selected Company Details Modal State
  const [selectedCompanyDetail, setSelectedCompanyDetail] = useState<Company | null>(null);
  const [detailModalTab, setDetailModalTab] = useState<'overview' | 'employees' | 'branches'>('overview');


  // Sub-module State (Departments, Designations, Deductions, Loans/Advances)
  const [departments] = useState(['Operations', 'Legal Compliance', 'Payroll & HR', 'Manufacturing', 'Finance']);
  const [designations] = useState(['Senior Consultant', 'Payroll Manager', 'Plant Engineer', 'Machine Operator', 'Executive']);
  const [deductions] = useState([
    { name: 'Provident Fund (EPF)', type: 'Statutory 12%' },
    { name: 'Employees State Insurance (ESI)', type: 'Statutory 0.75%' },
    { name: 'Professional Tax (PT)', type: 'State Statutory' },
    { name: 'TDS Income Tax', type: 'Tax Deduction' }
  ]);
  const [loans] = useState([
    { empName: 'Rohan Sharma', loanType: 'Personal Advance', amount: 15000, monthlyDeduction: 2500, status: 'Active' },
    { empName: 'Gurpreet Singh', loanType: 'Festival Advance', amount: 5000, monthlyDeduction: 1000, status: 'Active' }
  ]);

  const [selectedStateId, setSelectedStateId] = useState<number>(30);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    companyType: 'Private Limited (Pvt Ltd)',
    industry: 'Information Technology',
    industryType: 'Regular',
    cinNumber: '',
    gstin: '',
    panNumber: '',
    tanNumber: '',
    pfCode: '',
    esiCode: '',
    lwfCode: '',
    ptCode: '',
    registeredAddress: '',
    pincode: '',
    branchesCount: 1,
    employeeCount: 0,
    contactPerson: '',
    contactDesignation: 'HR Head',
    phone: '',
    email: '',
    city: 'Chandigarh (Sector 1 to 63)',
    state: 'Chandigarh',
    bankName: 'HDFC Bank',
    bankAccountNo: '',
    ifscCode: '',
    bankBranch: ''
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
    if (!formData.name || !formData.code || !formData.pfCode || !formData.esiCode) {
      alert('Please fill mandatory fields: Company Name, Code, PF Code, and ESI Code.');
      return;
    }

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
    setModalSection('basic');
    setFormData({
      name: '', code: '', companyType: 'Private Limited (Pvt Ltd)', industry: 'Information Technology', industryType: 'Regular',
      cinNumber: '', gstin: '', panNumber: '', tanNumber: '', pfCode: '', esiCode: '', lwfCode: '', ptCode: '',
      registeredAddress: '', pincode: '', branchesCount: 1, employeeCount: 0, contactPerson: '', contactDesignation: 'HR Head',
      phone: '', email: '', city: 'Chandigarh (Sector 1 to 63)', state: 'Chandigarh', bankName: 'HDFC Bank', bankAccountNo: '', ifscCode: '', bankBranch: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-900" /> Companies Master & Complete Setup Suite
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            Manage Complete Corporate Client Profiles, Statutory PF/ESI Codes, Banking & Branch Details.
          </p>
        </div>

        {/* Sub-Module Navigation Tabs */}
        <div className="flex bg-slate-100 p-1 border border-slate-300">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-3 py-1.5 text-xs font-bold transition ${activeTab === 'basic' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'}`}
          >
            Basic & Statutory Info
          </button>
          <button
            onClick={() => setActiveTab('depts')}
            className={`px-3 py-1.5 text-xs font-bold transition ${activeTab === 'depts' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'}`}
          >
            Depts & Designations
          </button>
          <button
            onClick={() => setActiveTab('deductions')}
            className={`px-3 py-1.5 text-xs font-bold transition ${activeTab === 'deductions' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'}`}
          >
            Deductions Master
          </button>
          <button
            onClick={() => setActiveTab('loans')}
            className={`px-3 py-1.5 text-xs font-bold transition ${activeTab === 'loans' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'}`}
          >
            Loans & Advances
          </button>
        </div>
      </div>

      {/* Tab 1: Basic & Statutory Info */}
      {activeTab === 'basic' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 border border-slate-300 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-blue-50 text-blue-900 border border-blue-200">
                <Building2 className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Registered Client Companies</h3>
                <p className="text-xs text-slate-500">Total {companies.length} corporate profiles registered with full statutory parameters.</p>
              </div>
            </div>
            <button
              onClick={() => { setShowModal(true); setModalSection('basic'); }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-800 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Complete Company Client
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((c) => {
              const compEmployees = employees.filter(emp => emp.companyId === c.id || emp.companyName === c.name);
              const totalEmployeesCount = compEmployees.length > 0 ? compEmployees.length : c.employeeCount;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCompanyDetail(c)}
                  className="bg-white p-5 border border-slate-300 shadow-sm flex flex-col justify-between space-y-4 hover:border-blue-900 hover:shadow-md transition cursor-pointer group"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-950 text-[10px] font-mono font-bold uppercase border border-blue-200">
                          {c.code}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-2 leading-snug group-hover:text-blue-900 transition">{c.name}</h3>
                        {c.companyType && <p className="text-[11px] text-slate-500 font-medium mt-0.5">{c.companyType}</p>}
                      </div>
                      <div className="w-8 h-8 bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-xs">
                        {c.branchesCount} B
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-xs">
                      <div className="p-3 bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-slate-600">PF Estt Code:</span>
                          <span className="text-blue-950 font-bold">{c.pfCode}</span>
                        </div>
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-slate-600">ESI Code No:</span>
                          <span className="text-blue-900 font-bold">{c.esiCode}</span>
                        </div>
                        {c.gstin && (
                          <div className="flex justify-between font-mono text-[11px]">
                            <span className="text-slate-600">GSTIN:</span>
                            <span className="text-slate-900 font-bold">{c.gstin}</span>
                          </div>
                        )}
                        {c.panNumber && (
                          <div className="flex justify-between font-mono text-[11px]">
                            <span className="text-slate-600">Company PAN:</span>
                            <span className="text-slate-900 font-bold">{c.panNumber}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 text-slate-700 space-y-1">
                        <p className="flex items-center gap-2 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-blue-900 shrink-0" /> {c.registeredAddress ? `${c.registeredAddress}, ` : ''}{c.city}, {c.state} {c.pincode || ''}
                        </p>
                        <p className="flex items-center gap-2 text-[11px]">
                          <Phone className="w-3.5 h-3.5 text-blue-900 shrink-0" /> {c.phone} ({c.contactPerson} {c.contactDesignation ? `- ${c.contactDesignation}` : ''})
                        </p>
                        <p className="flex items-center gap-2 text-[11px]">
                          <Mail className="w-3.5 h-3.5 text-blue-900 shrink-0" /> {c.email}
                        </p>
                        {c.bankName && (
                          <p className="flex items-center gap-2 text-[11px] font-mono text-slate-800 pt-1">
                            <Landmark className="w-3.5 h-3.5 text-blue-900 shrink-0" /> {c.bankName} (A/C: {c.bankAccountNo || 'N/A'})
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-1.5 text-blue-900 group-hover:underline">
                      <span>View Full Profile & Workforce</span>
                      <span>→</span>
                    </div>
                    <span className="font-bold text-slate-900 bg-blue-50 text-blue-950 border border-blue-200 px-2.5 py-1 text-xs">
                      {totalEmployeesCount} Employees
                    </span>
                  </div>
                </div>
              );
            })}

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
            <Landmark className="w-5 h-5 text-blue-900" /> Employee Loans & Salary Advances Ledger
          </h3>
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 uppercase text-[10px] font-bold text-slate-700 border-b border-slate-300">
              <tr>
                <th className="p-3 border-r border-slate-200">Employee Name</th>
                <th className="p-3 border-r border-slate-200">Advance Type</th>
                <th className="p-3 border-r border-slate-200 text-right">Loan Amount</th>
                <th className="p-3 border-r border-slate-200 text-right">Monthly EMI</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loans.map((l, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
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

      {/* Comprehensive Multi-Section Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl p-6 border-2 border-blue-900 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-900" /> Comprehensive Corporate Client Registration
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-lg">✕</button>
            </div>

            {/* Modal Section Wizard Stepper */}
            <div className="flex bg-slate-100 p-1 border border-slate-300 text-xs overflow-x-auto">
              <button
                type="button"
                onClick={() => setModalSection('basic')}
                className={`flex-1 min-w-[120px] px-3 py-2 font-bold flex items-center justify-center gap-1.5 ${modalSection === 'basic' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'}`}
              >
                <Building2 className="w-3.5 h-3.5" /> 1. Entity Info
              </button>
              <button
                type="button"
                onClick={() => setModalSection('statutory')}
                className={`flex-1 min-w-[120px] px-3 py-2 font-bold flex items-center justify-center gap-1.5 ${modalSection === 'statutory' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'}`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> 2. Statutory Regs
              </button>
              <button
                type="button"
                onClick={() => setModalSection('address')}
                className={`flex-1 min-w-[120px] px-3 py-2 font-bold flex items-center justify-center gap-1.5 ${modalSection === 'address' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'}`}
              >
                <MapPin className="w-3.5 h-3.5" /> 3. Registered Address
              </button>
              <button
                type="button"
                onClick={() => setModalSection('contact')}
                className={`flex-1 min-w-[120px] px-3 py-2 font-bold flex items-center justify-center gap-1.5 ${modalSection === 'contact' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'}`}
              >
                <User className="w-3.5 h-3.5" /> 4. Contact & HR
              </button>
              <button
                type="button"
                onClick={() => setModalSection('bank')}
                className={`flex-1 min-w-[120px] px-3 py-2 font-bold flex items-center justify-center gap-1.5 ${modalSection === 'bank' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'}`}
              >
                <Landmark className="w-3.5 h-3.5" /> 5. Banking Details
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">

              {/* Section 1: Basic & Legal Entity Details */}
              {modalSection === 'basic' && (
                <div className="space-y-3">
                  <div className="p-2 bg-blue-50 border border-blue-200 text-[11px] text-blue-950 font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-900 shrink-0" /> Basic Information & Legal Entity Classification
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Company Full Legal Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apex Industrial Solutions Private Limited"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Company Short Code / Client ID *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. AIS004"
                        value={formData.code}
                        onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-bold font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Legal Entity Type *</label>
                      <select
                        value={formData.companyType}
                        onChange={e => setFormData({ ...formData, companyType: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-bold"
                      >
                        <option value="Private Limited (Pvt Ltd)">Private Limited (Pvt Ltd)</option>
                        <option value="Public Limited">Public Limited</option>
                        <option value="Partnership Firm">Partnership Firm</option>
                        <option value="Proprietorship">Sole Proprietorship</option>
                        <option value="Limited Liability Partnership (LLP)">LLP Firm</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Industry Sector *</label>
                      <select
                        value={formData.industry}
                        onChange={e => setFormData({ ...formData, industry: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-bold"
                      >
                        <option value="Information Technology">Information Technology & Software</option>
                        <option value="Manufacturing & Industrial">Manufacturing & Industrial Engineering</option>
                        <option value="Pharmaceuticals & Healthcare">Pharmaceuticals & Healthcare</option>
                        <option value="Construction & Real Estate">Construction & Infrastructure</option>
                        <option value="Services & Logistics">Logistics & Supply Chain Services</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">CIN / LLPIN Registration No.</label>
                      <input
                        type="text"
                        placeholder="e.g. U72200CH2024PTC123456"
                        value={formData.cinNumber}
                        onChange={e => setFormData({ ...formData, cinNumber: e.target.value.toUpperCase() })}
                        className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Initial Office Branches Count</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.branchesCount}
                        onChange={e => setFormData({ ...formData, branchesCount: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Section 2: Statutory & Tax Registration Numbers */}
              {modalSection === 'statutory' && (
                <div className="space-y-3">
                  <div className="p-2 bg-blue-50 border border-blue-200 text-[11px] text-blue-950 font-semibold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-900 shrink-0" /> Labor Law & Tax Statutory Registrations (PF, ESI, GST, PAN, TAN)
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">PF Establishment Code / ID *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. CHD/12345/SSC"
                        value={formData.pfCode}
                        onChange={e => setFormData({ ...formData, pfCode: e.target.value.toUpperCase() })}
                        className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-bold font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">ESIC Code Number (17 Digit) *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 123456789012345"
                        value={formData.esiCode}
                        onChange={e => setFormData({ ...formData, esiCode: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-bold font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Company PAN Number (10 Digit)</label>
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="e.g. ABCDE1234F"
                        value={formData.panNumber}
                        onChange={e => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                        className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-bold font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Company GSTIN Number (15 Digit)</label>
                      <input
                        type="text"
                        maxLength={15}
                        placeholder="e.g. 04ABCDE1234F1Z5"
                        value={formData.gstin}
                        onChange={e => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                        className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-bold font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">TAN Number (TDS Deduction)</label>
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="e.g. CHDA12345B"
                        value={formData.tanNumber}
                        onChange={e => setFormData({ ...formData, tanNumber: e.target.value.toUpperCase() })}
                        className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Professional Tax (PT) Reg No.</label>
                      <input
                        type="text"
                        placeholder="e.g. PT-CHD-90812"
                        value={formData.ptCode}
                        onChange={e => setFormData({ ...formData, ptCode: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Section 3: Address & Location */}
              {modalSection === 'address' && (
                <div className="space-y-3">
                  <div className="p-2 bg-blue-50 border border-blue-200 text-[11px] text-blue-950 font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-900 shrink-0" /> Registered Office Address & Regional State Jurisdiction
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Registered Street Address *</label>
                      <input
                        type="text"
                        placeholder="e.g. Plot No 45, Industrial Area Phase 1"
                        value={formData.registeredAddress}
                        onChange={e => setFormData({ ...formData, registeredAddress: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                        <label className="text-slate-700 font-bold block mb-1">Select City / District *</label>
                        <select
                          value={formData.city}
                          onChange={e => setFormData({ ...formData, city: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-bold"
                        >
                          {availableCities.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Pincode *</label>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="e.g. 160002"
                          value={formData.pincode}
                          onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 4: Contact & HR Person Details */}
              {modalSection === 'contact' && (
                <div className="space-y-3">
                  <div className="p-2 bg-blue-50 border border-blue-200 text-[11px] text-blue-950 font-semibold flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-900 shrink-0" /> Primary HR Contact & Authorised Signatory Info
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Contact Person Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. S. K. Sharma"
                        value={formData.contactPerson}
                        onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Contact Designation</label>
                      <input
                        type="text"
                        placeholder="e.g. HR Head / Managing Director"
                        value={formData.contactDesignation}
                        onChange={e => setFormData({ ...formData, contactDesignation: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Phone / Mobile Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 9872989284"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-bold font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Official Contact Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. hr@company.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Section 5: Banking & Salary Disbursal */}
              {modalSection === 'bank' && (
                <div className="space-y-3">
                  <div className="p-2 bg-blue-50 border border-blue-200 text-[11px] text-blue-950 font-semibold flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-blue-900 shrink-0" /> Salary Disbursal Corporate Bank Account
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Primary Salary Bank</label>
                      <select
                        value={formData.bankName}
                        onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-bold"
                      >
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                        <option value="Punjab National Bank (PNB)">Punjab National Bank (PNB)</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Corporate Account Number</label>
                      <input
                        type="text"
                        placeholder="e.g. 50100234567890"
                        value={formData.bankAccountNo}
                        onChange={e => setFormData({ ...formData, bankAccountNo: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Bank Branch IFSC Code</label>
                      <input
                        type="text"
                        maxLength={11}
                        placeholder="e.g. HDFC0000123"
                        value={formData.ifscCode}
                        onChange={e => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                        className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Bank Branch Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Sector 17 Main Branch"
                        value={formData.bankBranch}
                        onChange={e => setFormData({ ...formData, bankBranch: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Navigation Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="flex gap-2">
                  {modalSection !== 'basic' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (modalSection === 'statutory') setModalSection('basic');
                        else if (modalSection === 'address') setModalSection('statutory');
                        else if (modalSection === 'contact') setModalSection('address');
                        else if (modalSection === 'bank') setModalSection('contact');
                      }}
                      className="px-4 py-2 bg-slate-200 text-slate-800 font-bold hover:bg-slate-300"
                    >
                      ← Previous
                    </button>
                  )}
                  {modalSection !== 'bank' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (modalSection === 'basic') setModalSection('statutory');
                        else if (modalSection === 'statutory') setModalSection('address');
                        else if (modalSection === 'address') setModalSection('contact');
                        else if (modalSection === 'contact') setModalSection('bank');
                      }}
                      className="px-4 py-2 bg-blue-100 text-blue-900 font-bold hover:bg-blue-200"
                    >
                      Next Step →
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-slate-200 text-slate-800 font-bold hover:bg-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-900 text-white font-bold hover:bg-blue-800 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Save Complete Company
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal: Company Details & Enrolled Workforce Ledger */}
      {selectedCompanyDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white border border-slate-300 shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-blue-500 text-white text-xs font-mono font-extrabold uppercase">
                    {selectedCompanyDetail.code}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[11px] font-medium">
                    {selectedCompanyDetail.companyType || 'Corporate Client'}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-white mt-1.5 leading-snug">{selectedCompanyDetail.name}</h3>
                <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-3">
                  <span>📍 {selectedCompanyDetail.city}, {selectedCompanyDetail.state}</span>
                  <span>•</span>
                  <span>🏢 {selectedCompanyDetail.branchesCount} Office Branches</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedCompanyDetail(null)}
                className="w-8 h-8 bg-slate-800 hover:bg-red-600 text-white font-bold flex items-center justify-center transition cursor-pointer text-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="bg-slate-100 border-b border-slate-300 flex px-5 gap-2 text-xs font-bold pt-2">
              <button
                onClick={() => setDetailModalTab('overview')}
                className={`px-4 py-2.5 border-b-2 transition ${
                  detailModalTab === 'overview'
                    ? 'border-blue-900 text-blue-950 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                📋 Legal, Statutory & Bank Profile
              </button>
              <button
                onClick={() => setDetailModalTab('employees')}
                className={`px-4 py-2.5 border-b-2 transition flex items-center gap-1.5 ${
                  detailModalTab === 'employees'
                    ? 'border-blue-900 text-blue-950 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" /> Enrolled Workforce & Employees (
                {employees.filter(e => e.companyId === selectedCompanyDetail.id || e.companyName === selectedCompanyDetail.name).length || selectedCompanyDetail.employeeCount}
                )
              </button>
              <button
                onClick={() => setDetailModalTab('branches')}
                className={`px-4 py-2.5 border-b-2 transition ${
                  detailModalTab === 'branches'
                    ? 'border-blue-900 text-blue-950 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                🏢 Company Offices & Branches ({selectedCompanyDetail.branchesCount})
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {detailModalTab === 'overview' && (
                <div className="space-y-6">
                  {/* Grid 1: Statutory Numbers */}
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-2 mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-900" /> Labor Law Statutory & Tax Registrations
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">EPF Establishment Code</span>
                        <span className="font-mono font-bold text-slate-900 text-sm">{selectedCompanyDetail.pfCode || 'N/A'}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">ESIC 17-Digit Code</span>
                        <span className="font-mono font-bold text-slate-900 text-sm">{selectedCompanyDetail.esiCode || 'N/A'}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">15-Digit GSTIN</span>
                        <span className="font-mono font-bold text-slate-900 text-sm">{selectedCompanyDetail.gstin || 'N/A'}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">Company PAN Number</span>
                        <span className="font-mono font-bold text-slate-900 text-sm">{selectedCompanyDetail.panNumber || 'N/A'}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">TAN (TDS Deduction)</span>
                        <span className="font-mono font-bold text-slate-900 text-sm">{selectedCompanyDetail.tanNumber || 'N/A'}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">Corporate CIN / LLPIN</span>
                        <span className="font-mono font-bold text-slate-900 text-sm">{selectedCompanyDetail.cinNumber || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Grid 2: Address & HR Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-2 mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-900" /> Registered Street Address & Location
                      </h4>
                      <div className="p-4 bg-slate-50 border border-slate-200 space-y-2">
                        <p className="font-semibold text-slate-900">{selectedCompanyDetail.registeredAddress || 'Registered Office Address'}</p>
                        <p className="text-slate-600">{selectedCompanyDetail.city}, {selectedCompanyDetail.state} - {selectedCompanyDetail.pincode || 'Pincode N/A'}</p>
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-900 font-bold text-[10px]">
                          State Jurisdiction: {selectedCompanyDetail.state}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-2 mb-3 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-blue-900" /> Authorised HR Contact & Signatory
                      </h4>
                      <div className="p-4 bg-slate-50 border border-slate-200 space-y-2">
                        <p className="font-bold text-slate-900 text-sm">{selectedCompanyDetail.contactPerson}</p>
                        <p className="text-slate-600 font-medium">{selectedCompanyDetail.contactDesignation || 'HR Manager / Authorised Signatory'}</p>
                        <div className="pt-2 border-t border-slate-200 space-y-1 font-mono text-[11px]">
                          <p className="text-slate-800">📞 Phone: {selectedCompanyDetail.phone}</p>
                          <p className="text-slate-800">✉️ Email: {selectedCompanyDetail.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grid 3: Corporate Banking */}
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-2 mb-3 flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-blue-900" /> Corporate Salary Disbursal Banking
                    </h4>
                    <div className="p-4 bg-blue-50/50 border border-blue-200 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">Disbursal Bank</span>
                        <span className="font-bold text-slate-900">{selectedCompanyDetail.bankName || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">Corporate Account No</span>
                        <span className="font-mono font-bold text-slate-900">{selectedCompanyDetail.bankAccountNo || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">Bank IFSC Code</span>
                        <span className="font-mono font-bold text-slate-900">{selectedCompanyDetail.ifscCode || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">Branch Name</span>
                        <span className="font-medium text-slate-900">{selectedCompanyDetail.bankBranch || 'Main Branch'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {detailModalTab === 'employees' && (
                <div className="space-y-4">
                  {(() => {
                    const compEmployees = employees.filter(e => e.companyId === selectedCompanyDetail.id || e.companyName === selectedCompanyDetail.name);
                    
                    if (compEmployees.length === 0) {
                      return (
                        <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 space-y-2">
                          <User className="w-8 h-8 text-slate-400 mx-auto" />
                          <h4 className="font-bold text-slate-900">No Employees Enrolled Yet</h4>
                          <p className="text-xs text-slate-500 max-w-md mx-auto">
                            There are currently no active employee records assigned to {selectedCompanyDetail.name}. You can onboard new workers directly from the Employee Master tab.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center bg-slate-50 p-3 border border-slate-200">
                          <span className="font-bold text-slate-900">Enrolled Staff Workforce ({compEmployees.length} Members)</span>
                          <span className="font-mono text-xs font-bold text-blue-900">
                            Total CTC Payroll: ₹{compEmployees.reduce((acc, curr) => acc + (curr.basicSalary || 0) + (curr.hra || 0) + (curr.specialAllowance || 0), 0).toLocaleString('en-IN')}/mo
                          </span>
                        </div>

                        <div className="overflow-x-auto border border-slate-300">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-900 text-white font-bold text-[11px]">
                                <th className="p-3">Emp Code</th>
                                <th className="p-3">Employee Name</th>
                                <th className="p-3">Department</th>
                                <th className="p-3">Designation</th>
                                <th className="p-3">Joining Date</th>
                                <th className="p-3">Mobile Phone</th>
                                <th className="p-3">Basic Salary</th>
                                <th className="p-3">Gross CTC</th>
                                <th className="p-3">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                              {compEmployees.map(emp => {
                                const gross = (emp.basicSalary || 0) + (emp.hra || 0) + (emp.conveyance || 0) + (emp.specialAllowance || 0);
                                return (
                                  <tr key={emp.id} className="hover:bg-blue-50/50 transition">
                                    <td className="p-3 font-mono font-bold text-blue-950">{emp.empCode}</td>
                                    <td className="p-3 font-bold text-slate-900">{emp.name}</td>
                                    <td className="p-3 text-slate-700">{emp.department}</td>
                                    <td className="p-3 text-slate-700">{emp.designation}</td>
                                    <td className="p-3 font-mono text-slate-600">{emp.joiningDate}</td>
                                    <td className="p-3 font-mono text-slate-600">{emp.phone}</td>
                                    <td className="p-3 font-mono font-bold text-slate-900">₹{(emp.basicSalary || 0).toLocaleString('en-IN')}</td>
                                    <td className="p-3 font-mono font-bold text-blue-900">₹{gross.toLocaleString('en-IN')}</td>
                                    <td className="p-3">
                                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-bold text-[10px]">Active</span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {detailModalTab === 'branches' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-900">Configured Office Locations</h4>
                      <p className="text-slate-500 text-xs mt-0.5">Head office, manufacturing plants, and regional branches mapped to this corporate entity.</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-900 text-white font-bold text-xs">{selectedCompanyDetail.branchesCount} Total Branches</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-slate-300 space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-900 font-bold text-[10px] uppercase">HEAD OFFICE</span>
                        <span className="font-mono text-xs text-slate-500">Code: {selectedCompanyDetail.code}-HO</span>
                      </div>
                      <h5 className="font-bold text-slate-900">{selectedCompanyDetail.name} (Corporate HQ)</h5>
                      <p className="text-slate-600 text-xs">{selectedCompanyDetail.registeredAddress || 'Sector 17 Industrial Area'}, {selectedCompanyDetail.city}, {selectedCompanyDetail.state}</p>
                      <p className="text-slate-500 text-[11px] pt-1">Contact: {selectedCompanyDetail.contactPerson} ({selectedCompanyDetail.phone})</p>
                    </div>

                    {selectedCompanyDetail.branchesCount > 1 && (
                      <div className="p-4 bg-white border border-slate-300 space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-900 font-bold text-[10px] uppercase">PLANT / BRANCH OFFICE</span>
                          <span className="font-mono text-xs text-slate-500">Code: {selectedCompanyDetail.code}-BR2</span>
                        </div>
                        <h5 className="font-bold text-slate-900">{selectedCompanyDetail.name} (Regional Unit)</h5>
                        <p className="text-slate-600 text-xs">Focal Point Industrial Area, {selectedCompanyDetail.city}</p>
                        <p className="text-slate-500 text-[11px] pt-1">Contact: Branch Manager ({selectedCompanyDetail.phone})</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-100 p-4 border-t border-slate-300 flex justify-between items-center">
              <span className="text-slate-500 text-xs">Viewing Full Statutory Profile & Workforce Ledger</span>
              <button
                onClick={() => setSelectedCompanyDetail(null)}
                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs uppercase hover:bg-slate-800 transition"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

