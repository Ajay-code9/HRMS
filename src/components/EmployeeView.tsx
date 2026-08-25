'use client';

import React, { useState, useCallback } from 'react';
import {
  Users, UserPlus, Upload, Search, Key, Copy, Check,
  ChevronRight, ChevronLeft, User, MapPin, Heart,
  CreditCard, Building2, IndianRupee, CheckCircle2,
  FileSpreadsheet, X, Pencil, Clock, AlertCircle,
  PlusCircle, Star, History, ChevronDown, ChevronUp,
  Filter
} from 'lucide-react';
import { Employee, Company } from '@/types/hrms';
import * as XLSX from 'xlsx';
import { UserAccount } from '@/data/authData';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface BankAccount {
  id: string;
  bankName: string;
  accountNo: string;
  ifsc: string;
  accountType: 'Savings' | 'Current';
  bankBranch?: string;
  isPrimary: boolean;
  status: 'Active' | 'Historical';
  addedOn: string;
  closedOn?: string;
  closedReason?: string;
}

interface ChangeRequest {
  id: string;
  empId: string;
  empName: string;
  field: string;
  section: string;
  oldValue: string;
  newValue: string;
  requestedBy: string;
  requestedByRole: string;
  requestedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  remarks?: string;
}

interface EmployeeViewProps {
  employees: Employee[];
  companies: Company[];
  currentUser: UserAccount;
  onAddEmployee: (emp: Employee) => void;
  onUpdateEmployee: (emp: Employee) => void;
  onBulkUpload: (emps: Employee[]) => void;
  canViewSalary?: boolean;
}

// ─── Constants ─────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Personal',   icon: User,       desc: 'Basic & Personal Info' },
  { id: 2, label: 'Address',    icon: MapPin,      desc: 'Present & Permanent Address' },
  { id: 3, label: 'Family',     icon: Heart,       desc: 'Family & Nominee Details' },
  { id: 4, label: 'KYC',        icon: CreditCard,  desc: 'Aadhaar, PAN & Documents' },
  { id: 5, label: 'Bank',       icon: Building2,   desc: 'Bank Account & KYC' },
  { id: 6, label: 'Salary',     icon: IndianRupee, desc: 'Salary & Statutory' },
];

const BLANK = {
  companyId:'', empCode:'', name:'', email:'', phone:'',
  joiningDate: new Date().toISOString().slice(0,10),
  dateOfBirth:'', gender:'Male' as 'Male'|'Female'|'Other',
  bloodGroup:'', maritalStatus:'Single' as 'Single'|'Married'|'Divorced'|'Widowed',
  fatherName:'', motherName:'', religion:'', nationality:'Indian',
  department:'', designation:'',
  addressPresent:'', cityPresent:'', statePresent:'', pinPresent:'',
  sameAsPermanent: false,
  addressPermanent:'', cityPermanent:'', statePermanent:'', pinPermanent:'',
  nomineeName:'', nomineeRelation:'', nomineeDob:'', nomineeShare:'100',
  spouseName:'', spouseEmployed: false,
  aadhaarNumber:'', aadhaarName:'', panNumber:'', panName:'',
  passportNumber:'', passportExpiry:'', drivingLicense:'', voterIdNumber:'',
  bankName:'', accountNo:'', ifsc:'',
  accountType:'Savings' as 'Savings'|'Current', bankBranch:'', bankCity:'',
  pfNumber:'', uanNumber:'', esiNumber:'',
  basicSalary:0, hra:0, conveyance:0, specialAllowance:0,
  salaryStructureType:'Individual' as 'Individual'|'Composite',
};

// ─── Field & Input helpers ──────────────────────────────────────────────────────
const inputSt: React.CSSProperties = {
  width:'100%', background:'#fff', border:'1px solid var(--border)',
  color:'var(--foreground)', fontSize:13, padding:'8px 12px', outline:'none',
  transition:'border-color .15s, box-shadow .15s',
};
const monoSt: React.CSSProperties = { ...inputSt, fontFamily:'monospace', letterSpacing:'0.04em' };

const Inp = (p: React.InputHTMLAttributes<HTMLInputElement> & { mono?: boolean }) => {
  const { mono, ...rest } = p;
  return (
    <input {...rest} style={mono ? monoSt : inputSt}
      onFocus={e => { e.target.style.borderColor='var(--primary)'; e.target.style.boxShadow='0 0 0 3px rgba(24,119,242,0.12)'; }}
      onBlur={e => { e.target.style.borderColor='var(--border)'; e.target.style.boxShadow='none'; }} />
  );
};

const Sel = (p: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...p} style={inputSt}
    onFocus={e => { e.target.style.borderColor='var(--primary)'; }}
    onBlur={e => { e.target.style.borderColor='var(--border)'; }} />
);

const Label = ({ text, req }: { text: string; req?: boolean }) => (
  <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--muted)', letterSpacing:'0.04em', textTransform:'uppercase' }}>
    {text} {req && <span style={{ color:'#EF4444' }}>*</span>}
  </label>
);

const Fld = ({ label, req, children }: { label:string; req?:boolean; children:React.ReactNode }) => (
  <div><Label text={label} req={req} />{children}</div>
);

const SectionBox = ({ title, icon, children }: { title:string; icon:string; children:React.ReactNode }) => (
  <div style={{ border:'1px solid var(--border)', overflow:'hidden', marginBottom:12 }}>
    <div className="px-4 py-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
      style={{ background:'#F7F8FA', borderBottom:'1px solid var(--border)', color:'var(--muted)' }}>
      <span>{icon}</span>{title}
    </div>
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
  </div>
);

const StepHead = ({ icon, title }: { icon:string; title:string }) => (
  <div className="flex items-center gap-2.5 mb-4 pb-3" style={{ borderBottom:'1px solid var(--border)' }}>
    <span className="text-xl">{icon}</span>
    <h3 className="text-sm font-bold" style={{ color:'var(--foreground)' }}>{title}</h3>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
export const EmployeeView: React.FC<EmployeeViewProps> = ({
  employees, companies, currentUser,
  onAddEmployee, onUpdateEmployee, onBulkUpload,
  canViewSalary = true
}) => {
  // List state
  const [q, setQ] = useState('');
  const [coFilter, setCoFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedCols, setExpandedCols] = useState(false);

  // Add modal
  const [showAdd, setShowAdd] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ...BLANK, companyId: companies[0]?.id||'' });

  // Edit drawer
  const [editEmp, setEditEmp] = useState<Employee|null>(null);
  const [editTab, setEditTab] = useState<'personal'|'address'|'family'|'kyc'|'bank'|'salary'>('personal');
  const [editDraft, setEditDraft] = useState<Partial<Employee>>({});

  // Bank history per employee: empId → BankAccount[]
  const [bankHistories, setBankHistories] = useState<Record<string, BankAccount[]>>({});
  const [showAddBank, setShowAddBank] = useState(false);
  const [newBankForm, setNewBankForm] = useState({ bankName:'', accountNo:'', ifsc:'', accountType:'Savings' as 'Savings'|'Current', bankBranch:'' });

  // Change requests
  const [changeRequests, setCR] = useState<ChangeRequest[]>([]);
  const [showCR, setShowCR] = useState(false);

  // Credential slip
  const [credSlip, setCredSlip] = useState<{empCode:string;name:string;email:string;pass:string}|null>(null);
  const [copied, setCopied] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  // ── Derived ─────────────────────────────────────────────────────────────────
  const isAdmin = ['Super Admin','Admin'].includes(currentUser.role);
  const isOwner = currentUser.role === 'Company Owner';

  const filtered = employees.filter(e => {
    const lq = q.toLowerCase();
    const m = !lq || [e.name,e.empCode,e.department,e.designation,e.panNumber||'',
                       e.aadhaarNumber||'',e.uanNumber||'',e.email].some(v=>v.toLowerCase().includes(lq));
    const mc = coFilter==='ALL' || e.companyId===coFilter;
    const ms = statusFilter==='ALL' || e.status===statusFilter;
    return m && mc && ms;
  });

  const pendingCR = changeRequests.filter(r=>r.status==='Pending');

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const set = useCallback((f:string, v:unknown) => setForm(prev=>({...prev,[f]:v})), []);
  const setDraft = (f:string, v:unknown) => setEditDraft(prev=>({...prev,[f]:v}));

  const getBankHistory = (empId:string): BankAccount[] => bankHistories[empId] || [];

  const getPrimaryBank = (empId:string, emp:Employee): BankAccount => {
    const hist = getBankHistory(empId);
    const primary = hist.find(b=>b.isPrimary && b.status==='Active');
    if (primary) return primary;
    return {
      id:'initial', bankName:emp.bankName, accountNo:emp.accountNo,
      ifsc:emp.ifsc, accountType:(emp.accountType||'Savings') as 'Savings'|'Current',
      bankBranch:emp.bankBranch||'', isPrimary:true, status:'Active',
      addedOn:emp.joiningDate
    };
  };

  // ── Add new bank account (with change request if not admin) ─────────────────
  const handleAddBank = () => {
    if (!editEmp) return;
    const account: BankAccount = {
      id: `bank-${Date.now()}`, ...newBankForm,
      isPrimary: false, status: 'Active', addedOn: new Date().toISOString().slice(0,10)
    };
    if (!isAdmin && !isOwner) {
      // Raise change request
      const cr: ChangeRequest = {
        id:`cr-${Date.now()}`, empId:editEmp.id, empName:editEmp.name,
        field:'Bank Account', section:'Bank',
        oldValue: `${editEmp.bankName} / ${editEmp.accountNo}`,
        newValue: `${newBankForm.bankName} / ${newBankForm.accountNo} (${newBankForm.accountType})`,
        requestedBy: currentUser.name, requestedByRole: currentUser.role,
        requestedAt: new Date().toLocaleString(), status:'Pending',
        remarks: 'New bank account addition request'
      };
      setCR(prev=>[cr,...prev]);
      alert('✅ Change request submitted for admin approval.');
    } else {
      setBankHistories(prev=>({
        ...prev,
        [editEmp.id]: [...(prev[editEmp.id]||[{
          id:'initial', bankName:editEmp.bankName, accountNo:editEmp.accountNo,
          ifsc:editEmp.ifsc, accountType:(editEmp.accountType||'Savings') as 'Savings'|'Current',
          isPrimary:true, status:'Active', addedOn:editEmp.joiningDate
        }]), account]
      }));
    }
    setNewBankForm({bankName:'',accountNo:'',ifsc:'',accountType:'Savings',bankBranch:''});
    setShowAddBank(false);
  };

  const handleSetPrimary = (empId:string, accountId:string) => {
    setBankHistories(prev=>({
      ...prev,
      [empId]: (prev[empId]||[]).map(b=>({...b, isPrimary:b.id===accountId}))
    }));
  };

  // ── Save edit (with change request flow) ────────────────────────────────────
  const handleSaveEdit = () => {
    if (!editEmp) return;
    const changes = Object.entries(editDraft);
    if (changes.length === 0) { setEditEmp(null); return; }

    if (!isAdmin && !isOwner) {
      // Non-admin: raise change requests for each changed field
      const newCRs: ChangeRequest[] = changes.map(([field, newVal]) => ({
        id:`cr-${Date.now()}-${field}`, empId:editEmp.id, empName:editEmp.name,
        field: field.replace(/([A-Z])/g,' $1').trim(),
        section: getSectionForField(field),
        oldValue: String((editEmp as unknown as Record<string,unknown>)[field]||''),
        newValue: String(newVal||''),
        requestedBy: currentUser.name, requestedByRole: currentUser.role,
        requestedAt: new Date().toLocaleString(), status:'Pending'
      }));
      setCR(prev=>[...newCRs,...prev]);
      setEditEmp(null); setEditDraft({});
      alert(`✅ ${newCRs.length} change request(s) submitted. Awaiting admin approval.`);
    } else {
      // Admin: apply immediately
      onUpdateEmployee({ ...editEmp, ...editDraft });
      setEditEmp(null); setEditDraft({});
    }
  };

  const getSectionForField = (f:string): string => {
    if (['name','dateOfBirth','gender','fatherName','motherName'].includes(f)) return 'Personal';
    if (['addressPresent','cityPresent','statePresent'].includes(f)) return 'Address';
    if (['nomineeName','nomineeRelation'].includes(f)) return 'Family';
    if (['aadhaarNumber','panNumber','passportNumber'].includes(f)) return 'KYC';
    if (['bankName','accountNo','ifsc'].includes(f)) return 'Bank';
    if (['basicSalary','hra','pfNumber'].includes(f)) return 'Salary';
    return 'General';
  };

  // ── Approve / Reject change request ─────────────────────────────────────────
  const reviewCR = (id:string, action:'Approved'|'Rejected', remarks?:string) => {
    setCR(prev=>prev.map(r=>r.id!==id ? r : {
      ...r, status:action, reviewedBy:currentUser.name,
      reviewedAt:new Date().toLocaleString(), remarks:remarks||''
    }));
    if (action==='Approved') {
      const cr = changeRequests.find(r=>r.id===id);
      if (cr) {
        const emp = employees.find(e=>e.id===cr.empId);
        if (emp) {
          const camelField = cr.field.replace(/ ([A-Z])/g,(_, c)=>c.toLowerCase()).replace(/ /g,'');
          onUpdateEmployee({ ...emp, [camelField]:cr.newValue });
        }
      }
    }
  };

  // ── Add employee submit ──────────────────────────────────────────────────────
  const handleAddSubmit = () => {
    const compObj = companies.find(c=>c.id===form.companyId);
    const pass = `Emp@${Math.floor(100+Math.random()*900)}`;
    const emp: Employee = {
      id:`emp-${Date.now()}`, empCode:form.empCode, name:form.name,
      email:form.email, phone:form.phone, companyId:form.companyId,
      companyName:compObj?.name||'', department:form.department,
      designation:form.designation, joiningDate:form.joiningDate,
      dateOfBirth:form.dateOfBirth, gender:form.gender,
      bloodGroup:form.bloodGroup, maritalStatus:form.maritalStatus,
      fatherName:form.fatherName, motherName:form.motherName,
      religion:form.religion, nationality:form.nationality,
      addressPresent:form.addressPresent, cityPresent:form.cityPresent,
      statePresent:form.statePresent, pinPresent:form.pinPresent,
      addressPermanent:form.sameAsPermanent?form.addressPresent:form.addressPermanent,
      cityPermanent:form.sameAsPermanent?form.cityPresent:form.cityPermanent,
      statePermanent:form.sameAsPermanent?form.statePresent:form.statePermanent,
      pinPermanent:form.sameAsPermanent?form.pinPresent:form.pinPermanent,
      nomineeName:form.nomineeName, nomineeRelation:form.nomineeRelation,
      nomineeDob:form.nomineeDob, nomineeShare:form.nomineeShare,
      spouseName:form.spouseName, spouseEmployed:form.spouseEmployed,
      aadhaarNumber:form.aadhaarNumber, aadhaarName:form.aadhaarName,
      panNumber:form.panNumber, panName:form.panName,
      passportNumber:form.passportNumber, passportExpiry:form.passportExpiry,
      drivingLicense:form.drivingLicense, voterIdNumber:form.voterIdNumber,
      bankName:form.bankName, accountNo:form.accountNo, ifsc:form.ifsc,
      accountType:form.accountType, bankBranch:form.bankBranch, bankCity:form.bankCity,
      pfNumber:form.pfNumber, uanNumber:form.uanNumber, esiNumber:form.esiNumber,
      basicSalary:form.basicSalary, hra:form.hra,
      conveyance:form.conveyance, specialAllowance:form.specialAllowance,
      salaryStructureType:form.salaryStructureType,
      status:'Active', loginPassword:pass,
    };
    onAddEmployee(emp);
    setShowAdd(false); setStep(1);
    setForm({...BLANK, companyId:companies[0]?.id||''});
    setCredSlip({empCode:emp.empCode, name:emp.name, email:emp.email, pass});
  };

  // ── Bulk import ──────────────────────────────────────────────────────────────
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const wb = XLSX.read(evt.target?.result, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);
        if (!data || data.length === 0) {
          alert('⚠️ The uploaded sheet is empty or invalid.');
          return;
        }
        const emps: Employee[] = data.map((row, i) => ({
          id: `emp-excel-${Date.now()}-${i}`,
          empCode: String(row['EmpCode'] || row['empCode'] || row['Code'] || `IMP-${i + 100}`),
          name: String(row['Name'] || row['name'] || row['Employee Name'] || 'Employee'),
          companyId: companies[0]?.id || '',
          companyName: String(row['Company'] || row['company'] || companies[0]?.name || ''),
          department: String(row['Department'] || row['dept'] || 'General'),
          designation: String(row['Designation'] || row['desig'] || 'Executive'),
          phone: String(row['Phone'] || row['Mobile'] || row['phone'] || ''),
          email: String(row['Email'] || row['email'] || ''),
          joiningDate: String(row['JoiningDate'] || row['DOJ'] || '2026-01-01'),
          bankName: String(row['BankName'] || row['Bank'] || 'SBI'),
          accountNo: String(row['AccountNo'] || row['Account Number'] || ''),
          ifsc: String(row['IFSC'] || ''),
          pfNumber: String(row['PFNumber'] || row['PF'] || ''),
          uanNumber: String(row['UAN'] || ''),
          esiNumber: String(row['ESI'] || ''),
          panNumber: String(row['PAN'] || ''),
          basicSalary: Number(row['Basic'] || row['BasicSalary'] || 18000),
          hra: Number(row['HRA'] || 7200),
          conveyance: Number(row['Conveyance'] || 1600),
          specialAllowance: Number(row['Special'] || row['SpecialAllowance'] || 2000),
          status: 'Active',
          loginPassword: `Pass@${i + 100}`,
        }));
        onBulkUpload(emps);
        setShowUpload(false);
        alert(`✅ Imported ${emps.length} records successfully!`);
      } catch (err) {
        console.error('Failed to parse excel file', err);
        alert('❌ Error reading file. Please ensure it is a valid Excel (.xlsx, .xls) or CSV file.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const copySlip = () => {
    if (!credSlip) return;
    navigator.clipboard.writeText(
      `S S Consultancy HRMS Credentials\nEmployee: ${credSlip.name} (${credSlip.empCode})\nEmail: ${credSlip.email}\nPassword: ${credSlip.pass}\nPortal: http://localhost:3000`
    );
    setCopied(true); setTimeout(()=>setCopied(false),3000);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* ── Page Header ───────────────────────────────────────────────────────── */}
      <div className="bg-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ border:'1px solid var(--border)', boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
        <div>
          <h2 className="text-base font-bold flex items-center gap-2" style={{ color:'var(--foreground)' }}>
            <Users className="w-5 h-5" style={{ color:'var(--primary)' }} /> Employee Master
            <span className="text-sm font-normal ml-1" style={{ color:'var(--muted)' }}>— {employees.length} total</span>
          </h2>
          <p className="text-xs mt-1" style={{ color:'var(--muted)' }}>
            Full onboarding with KYC, family, bank history, salary structure & change approvals.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {pendingCR.length > 0 && (
            <button onClick={()=>setShowCR(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold cursor-pointer"
              style={{ background:'#FEF3C7', color:'#92400E', border:'1px solid #FCD34D' }}>
              <AlertCircle className="w-3.5 h-3.5" /> {pendingCR.length} Pending Approvals
            </button>
          )}
          <button onClick={()=>setShowUpload(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold cursor-pointer transition"
            style={{ background:'#fff', border:'1px solid var(--border)', color:'var(--foreground)' }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--primary)';(e.currentTarget as HTMLElement).style.color='var(--primary)';}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--border)';(e.currentTarget as HTMLElement).style.color='var(--foreground)';}}>
            <FileSpreadsheet className="w-4 h-4" /> Bulk Import
          </button>
          <button onClick={()=>setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white cursor-pointer transition"
            style={{ background:'var(--primary)' }}
            onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='var(--primary-dark)'}
            onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='var(--primary)'}>
            <UserPlus className="w-4 h-4" /> Add Employee
          </button>
        </div>
      </div>

      {/* ── Filters ───────────────────────────────────────────────────────────── */}
      <div className="bg-white p-3 flex flex-wrap items-center gap-3"
        style={{ border:'1px solid var(--border)' }}>
        <div className="relative flex-1 min-w-48">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5" style={{ color:'var(--muted)' }} />
          <input placeholder="Search name, code, Aadhaar, PAN, UAN, email…"
            value={q} onChange={e=>setQ(e.target.value)}
            className="pl-8 pr-3 py-2 text-sm w-full focus:outline-none"
            style={{ border:'1px solid var(--border)', background:'var(--background)', color:'var(--foreground)' }}
            onFocus={e=>{e.target.style.borderColor='var(--primary)';e.target.style.boxShadow='0 0 0 2px rgba(24,119,242,0.1)';}}
            onBlur={e=>{e.target.style.borderColor='var(--border)';e.target.style.boxShadow='none';}} />
        </div>
        <Sel value={coFilter} onChange={e=>setCoFilter(e.target.value)} style={{...inputSt,width:'auto',minWidth:160}}>
          <option value="ALL">All Companies ({companies.length})</option>
          {companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </Sel>
        <Sel value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{...inputSt,width:'auto',minWidth:120}}>
          <option value="ALL">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </Sel>
        <span className="text-xs font-semibold" style={{ color:'var(--muted)' }}>
          {filtered.length} records
        </span>
      </div>

      {/* ── Employee Table ─────────────────────────────────────────────────────── */}
      <div className="bg-white" style={{ border:'1px solid var(--border)', boxShadow:'0 1px 3px rgba(0,0,0,0.05)', overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ minWidth: expandedCols ? 1800 : 1200 }}>
            <thead>
              <tr>
                <th style={{ width:40 }}>#</th>
                <th style={{ minWidth:200 }}>Employee</th>
                <th style={{ minWidth:160 }}>Company / Dept</th>
                <th style={{ minWidth:140 }}>Contact</th>
                {expandedCols && <th style={{ minWidth:130 }}>DOB / Gender</th>}
                <th style={{ minWidth:160 }}>Aadhaar · PAN</th>
                <th style={{ minWidth:180 }}>Primary Bank</th>
                <th style={{ minWidth:160 }}>PF · UAN · ESI</th>
                {canViewSalary && <th style={{ minWidth:110, textAlign:'right' }}>Gross / Mo.</th>}
                <th style={{ width:80, textAlign:'center' }}>Status</th>
                <th style={{ width:56, textAlign:'center', position:'sticky', right:0, background:'#F7F8FA' }}>
                  <button onClick={()=>setExpandedCols(e=>!e)} title="Toggle extra columns"
                    className="cursor-pointer" style={{ color:'var(--muted)' }}>
                    <Filter className="w-3.5 h-3.5 mx-auto" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={canViewSalary ? 11 : 10}
                  className="text-center py-16 text-sm" style={{ color:'var(--muted)' }}>
                  No employees found. Click <strong>Add Employee</strong> to onboard.
                </td></tr>
              )}
              {filtered.map((emp, i) => {
                const gross = emp.basicSalary + emp.hra + emp.conveyance + emp.specialAllowance;
                const initials = emp.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
                const bank = getPrimaryBank(emp.id, emp);
                const hasPending = changeRequests.some(r=>r.empId===emp.id&&r.status==='Pending');
                return (
                  <tr key={emp.id} style={{ cursor:'default' }}>
                    {/* # */}
                    <td className="text-center text-xs" style={{ color:'var(--muted)' }}>{i+1}</td>

                    {/* Employee */}
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background:'var(--primary)' }}>{initials}</div>
                        <div>
                          <div className="font-semibold text-sm" style={{ color:'var(--foreground)' }}>
                            {emp.name}
                            {hasPending && <span className="ml-1.5 text-[10px] font-bold px-1 py-0.5" style={{ background:'#FEF3C7',color:'#92400E',border:'1px solid #FCD34D' }}>PENDING</span>}
                          </div>
                          <div className="font-mono text-[11px] font-bold" style={{ color:'var(--primary)' }}>{emp.empCode}</div>
                          <div className="text-[11px]" style={{ color:'var(--muted)' }}>{emp.designation}</div>
                        </div>
                      </div>
                    </td>

                    {/* Company / Dept */}
                    <td>
                      <div className="text-xs font-semibold" style={{ color:'var(--foreground)' }}>{emp.companyName}</div>
                      <div className="text-[11px]" style={{ color:'var(--muted)' }}>{emp.department}</div>
                    </td>

                    {/* Contact */}
                    <td>
                      <div className="text-xs font-mono" style={{ color:'var(--foreground)' }}>{emp.phone}</div>
                      <div className="text-[11px]" style={{ color:'var(--muted)' }}>{emp.email}</div>
                    </td>

                    {/* DOB / Gender (expanded) */}
                    {expandedCols && (
                      <td>
                        <div className="text-xs font-mono">{emp.dateOfBirth||'—'}</div>
                        <div className="text-[11px]" style={{ color:'var(--muted)' }}>{emp.gender||'—'} · {emp.bloodGroup||'—'}</div>
                      </td>
                    )}

                    {/* Aadhaar · PAN */}
                    <td>
                      {emp.aadhaarNumber ? (
                        <div className="font-mono text-xs font-bold" style={{ color:'var(--foreground)' }}>
                          {emp.aadhaarNumber.replace(/(\d{4})(\d{4})(\d{4})/,'$1 $2 $3')}
                        </div>
                      ) : <span className="text-xs" style={{ color:'var(--muted)' }}>Aadhaar: —</span>}
                      <div className="font-mono text-[11px] mt-0.5" style={{ color:'var(--primary)' }}>
                        {emp.panNumber||'PAN: —'}
                      </div>
                    </td>

                    {/* Bank */}
                    <td>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 shrink-0" />
                        <span className="text-xs font-semibold" style={{ color:'var(--foreground)' }}>{bank.bankName}</span>
                      </div>
                      <div className="font-mono text-[11px]" style={{ color:'var(--muted)' }}>
                        ••••{bank.accountNo.slice(-4)} · {bank.ifsc}
                      </div>
                      {getBankHistory(emp.id).length > 1 && (
                        <div className="text-[10px] flex items-center gap-1 mt-0.5" style={{ color:'var(--primary)' }}>
                          <History className="w-3 h-3" />{getBankHistory(emp.id).length} accounts
                        </div>
                      )}
                    </td>

                    {/* PF · UAN · ESI */}
                    <td>
                      <div className="font-mono text-[11px] space-y-0.5">
                        <div style={{ color:'var(--foreground)' }}>PF: {emp.pfNumber||'—'}</div>
                        <div style={{ color:'var(--primary)' }}>UAN: {emp.uanNumber||'—'}</div>
                        <div style={{ color:'var(--muted)' }}>ESI: {emp.esiNumber||'—'}</div>
                      </div>
                    </td>

                    {/* Gross */}
                    {canViewSalary && (
                      <td style={{ textAlign:'right' }}>
                        <div className="font-bold text-sm" style={{ color:'var(--foreground)' }}>
                          ₹{gross.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px]" style={{ color:'var(--muted)' }}>
                          {emp.salaryStructureType||'Individual'}
                        </div>
                      </td>
                    )}

                    {/* Status */}
                    <td style={{ textAlign:'center' }}>
                      <span className={`text-[11px] font-bold px-2 py-0.5 ${emp.status==='Active'?'badge-green':'badge-slate'}`}>
                        {emp.status}
                      </span>
                    </td>

                    {/* Edit */}
                    <td style={{ textAlign:'center', position:'sticky', right:0, background:'#fff' }}>
                      <button
                        onClick={()=>{ setEditEmp(emp); setEditDraft({}); setEditTab('personal'); setShowAddBank(false); }}
                        title="Edit employee details"
                        className="p-2 cursor-pointer transition"
                        style={{ color:'var(--muted)', border:'1px solid var(--border)' }}
                        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='var(--primary-light)';(e.currentTarget as HTMLElement).style.color='var(--primary)';(e.currentTarget as HTMLElement).style.borderColor='var(--primary)';}}
                        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='transparent';(e.currentTarget as HTMLElement).style.color='var(--muted)';(e.currentTarget as HTMLElement).style.borderColor='var(--border)';}}>
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Change Requests Panel ──────────────────────────────────────────────── */}
      {showCR && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ background:'rgba(0,0,0,0.4)' }}>
          <div className="bg-white w-full max-w-2xl h-full flex flex-col overflow-hidden shadow-2xl">
            <div className="px-5 py-4 flex items-center justify-between shrink-0"
              style={{ background:'var(--primary)', color:'#fff' }}>
              <div>
                <div className="font-bold text-base">Change Request Approvals</div>
                <div className="text-blue-100 text-xs mt-0.5">{pendingCR.length} pending · {changeRequests.filter(r=>r.status==='Approved').length} approved</div>
              </div>
              <button onClick={()=>setShowCR(false)} className="p-1.5 cursor-pointer" style={{ opacity:0.8 }}><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {changeRequests.length===0 && (
                <div className="text-center py-12 text-sm" style={{ color:'var(--muted)' }}>No change requests yet.</div>
              )}
              {changeRequests.map(cr=>(
                <div key={cr.id} style={{ border:'1px solid var(--border)', overflow:'hidden' }}>
                  <div className="px-4 py-3 flex items-center justify-between"
                    style={{ background:'#F7F8FA', borderBottom:'1px solid var(--border)' }}>
                    <div>
                      <span className="font-bold text-sm" style={{ color:'var(--foreground)' }}>{cr.empName}</span>
                      <span className="mx-2 text-xs" style={{ color:'var(--muted)' }}>·</span>
                      <span className="text-xs font-semibold" style={{ color:'var(--primary)' }}>{cr.section}: {cr.field}</span>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 ${cr.status==='Pending'?'badge-amber':cr.status==='Approved'?'badge-green':'badge-red'}`}>
                      {cr.status}
                    </span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-2.5" style={{ background:'#FDE8E8', border:'1px solid #FECACA' }}>
                        <div className="font-bold text-xs mb-1" style={{ color:'#991B1B' }}>Previous Value</div>
                        <div className="font-mono" style={{ color:'#7F1D1D' }}>{cr.oldValue||'(empty)'}</div>
                      </div>
                      <div className="p-2.5" style={{ background:'#E6F4EA', border:'1px solid #BBF7D0' }}>
                        <div className="font-bold text-xs mb-1" style={{ color:'#14532D' }}>Requested Value</div>
                        <div className="font-mono" style={{ color:'#166534' }}>{cr.newValue}</div>
                      </div>
                    </div>
                    <div className="text-xs flex items-center gap-3" style={{ color:'var(--muted)' }}>
                      <span>By: <strong style={{ color:'var(--foreground)' }}>{cr.requestedBy}</strong> ({cr.requestedByRole})</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{cr.requestedAt}</span>
                    </div>
                    {cr.status==='Pending' && isAdmin && (
                      <div className="flex gap-2 pt-1">
                        <button onClick={()=>reviewCR(cr.id,'Approved')}
                          className="px-4 py-1.5 text-xs font-bold text-white cursor-pointer"
                          style={{ background:'#16A34A' }}>✓ Approve</button>
                        <button onClick={()=>reviewCR(cr.id,'Rejected','Rejected by admin')}
                          className="px-4 py-1.5 text-xs font-bold cursor-pointer"
                          style={{ background:'#FDE8E8', color:'#B91C1C', border:'1px solid #FECACA' }}>✕ Reject</button>
                      </div>
                    )}
                    {cr.reviewedBy && (
                      <div className="text-xs" style={{ color:'var(--muted)' }}>
                        Reviewed by <strong>{cr.reviewedBy}</strong> · {cr.reviewedAt}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Drawer ────────────────────────────────────────────────────────── */}
      {editEmp && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ background:'rgba(0,0,0,0.4)' }} onClick={()=>setEditEmp(null)}>
          <div className="bg-white w-full max-w-xl h-full flex flex-col shadow-2xl"
            style={{ borderLeft:'1px solid var(--border)' }} onClick={e=>e.stopPropagation()}>

            {/* Drawer Header */}
            <div className="px-5 py-4 flex items-center justify-between shrink-0"
              style={{ background:'var(--primary)', color:'#fff' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center font-bold"
                  style={{ background:'rgba(255,255,255,0.2)' }}>
                  {editEmp.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold">{editEmp.name}</div>
                  <div className="text-blue-100 text-xs font-mono">{editEmp.empCode} · {editEmp.designation}</div>
                </div>
              </div>
              <button onClick={()=>setEditEmp(null)} className="p-1.5 cursor-pointer" style={{ opacity:.8 }}><X className="w-5 h-5" /></button>
            </div>

            {/* Role warning for non-admin */}
            {!isAdmin && !isOwner && (
              <div className="px-4 py-2.5 text-xs flex items-center gap-2 shrink-0"
                style={{ background:'#FEF3C7', borderBottom:'1px solid #FCD34D', color:'#92400E' }}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                Your edits will be sent as <strong>Change Requests</strong> for admin approval before taking effect.
              </div>
            )}

            {/* Tab Nav */}
            <div className="flex overflow-x-auto shrink-0" style={{ borderBottom:'1px solid var(--border)', background:'#F7F8FA' }}>
              {(['personal','address','family','kyc','bank','salary'] as const).map(t=>(
                <button key={t} onClick={()=>setEditTab(t)}
                  className="px-4 py-3 text-xs font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap transition"
                  style={editTab===t
                    ? { color:'var(--primary)', borderBottom:'2px solid var(--primary)', background:'#fff' }
                    : { color:'var(--muted)' }}>
                  {t}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-5" style={{ minHeight: 0 }}>
              {/* Personal */}
              {editTab==='personal' && (
                <div className="grid grid-cols-2 gap-4">
                  {([
                    ['name','Full Name',false],['dateOfBirth','Date of Birth',false],
                    ['gender','Gender',false],['bloodGroup','Blood Group',false],
                    ['maritalStatus','Marital Status',false],['phone','Phone',false],
                    ['email','Email',false],['department','Department',false],
                    ['designation','Designation',false],['joiningDate','Joining Date',false],
                    ['fatherName',"Father's Name",false],['motherName',"Mother's Name",false],
                    ['nationality','Nationality',false],['religion','Religion',false],
                  ] as [keyof Employee, string, boolean][]).map(([field,label])=>(
                    <Fld key={field} label={label}>
                      <Inp
                        value={String(editDraft[field]??editEmp[field]??'')}
                        onChange={e=>setDraft(field,e.target.value)}
                        placeholder={label}
                      />
                    </Fld>
                  ))}
                </div>
              )}

              {/* Address */}
              {editTab==='address' && (
                <div className="space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider pb-2" style={{ color:'var(--muted)', borderBottom:'1px solid var(--border)' }}>Present Address</div>
                  <div className="grid grid-cols-2 gap-4">
                    {(['addressPresent','cityPresent','statePresent','pinPresent'] as (keyof Employee)[]).map(f=>(
                      <Fld key={f} label={f.replace(/([A-Z])/g,' $1').trim()}>
                        <Inp value={String(editDraft[f]??editEmp[f]??'')} onChange={e=>setDraft(f,e.target.value)} />
                      </Fld>
                    ))}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider pb-2 mt-4" style={{ color:'var(--muted)', borderBottom:'1px solid var(--border)' }}>Permanent Address</div>
                  <div className="grid grid-cols-2 gap-4">
                    {(['addressPermanent','cityPermanent','statePermanent','pinPermanent'] as (keyof Employee)[]).map(f=>(
                      <Fld key={f} label={f.replace(/([A-Z])/g,' $1').trim()}>
                        <Inp value={String(editDraft[f]??editEmp[f]??'')} onChange={e=>setDraft(f,e.target.value)} />
                      </Fld>
                    ))}
                  </div>
                </div>
              )}

              {/* Family */}
              {editTab==='family' && (
                <div className="grid grid-cols-2 gap-4">
                  {(['nomineeName','nomineeRelation','nomineeDob','nomineeShare','spouseName'] as (keyof Employee)[]).map(f=>(
                    <Fld key={f} label={f.replace(/([A-Z])/g,' $1').trim()}>
                      <Inp value={String(editDraft[f]??editEmp[f]??'')} onChange={e=>setDraft(f,e.target.value)} />
                    </Fld>
                  ))}
                </div>
              )}

              {/* KYC */}
              {editTab==='kyc' && (
                <div className="grid grid-cols-2 gap-4">
                  {(['aadhaarNumber','aadhaarName','panNumber','panName','passportNumber','passportExpiry','drivingLicense','voterIdNumber'] as (keyof Employee)[]).map(f=>(
                    <Fld key={f} label={f.replace(/([A-Z])/g,' $1').trim()}>
                      <Inp mono value={String(editDraft[f]??editEmp[f]??'')} onChange={e=>setDraft(f,e.target.value)} />
                    </Fld>
                  ))}
                </div>
              )}

              {/* Bank — with history */}
              {editTab==='bank' && (
                <div className="space-y-4">
                  {/* Active + Historical accounts */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs font-bold uppercase tracking-wider" style={{ color:'var(--muted)' }}>
                      Bank Accounts
                    </div>
                    <button onClick={()=>setShowAddBank(a=>!a)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold cursor-pointer"
                      style={{ background:'var(--primary-light)', color:'var(--primary)', border:'1px solid #B0CFF9' }}>
                      <PlusCircle className="w-3.5 h-3.5" /> Add Account
                    </button>
                  </div>

                  {/* Primary (current) */}
                  {(() => {
                    const bank = getPrimaryBank(editEmp.id, editEmp);
                    return (
                      <div style={{ border:'2px solid var(--primary)', overflow:'hidden' }}>
                        <div className="px-3 py-2 flex items-center gap-2 text-xs font-bold"
                          style={{ background:'var(--primary-light)', color:'var(--primary)', borderBottom:'1px solid #B0CFF9' }}>
                          <Star className="w-3.5 h-3.5 fill-current" /> Primary Account (Active)
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-3 text-xs">
                          <div><span style={{ color:'var(--muted)' }}>Bank:</span> <span className="font-semibold">{bank.bankName}</span></div>
                          <div><span style={{ color:'var(--muted)' }}>Type:</span> <span className="font-semibold">{bank.accountType}</span></div>
                          <div><span style={{ color:'var(--muted)' }}>Account:</span> <span className="font-mono font-bold">{bank.accountNo}</span></div>
                          <div><span style={{ color:'var(--muted)' }}>IFSC:</span> <span className="font-mono font-bold">{bank.ifsc}</span></div>
                          {bank.bankBranch && <div className="col-span-2"><span style={{ color:'var(--muted)' }}>Branch:</span> <span>{bank.bankBranch}</span></div>}
                          <div><span style={{ color:'var(--muted)' }}>Since:</span> <span>{bank.addedOn}</span></div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Historical accounts */}
                  {getBankHistory(editEmp.id).filter(b=>!b.isPrimary||b.status==='Historical').map(b=>(
                    <div key={b.id} style={{ border:'1px solid var(--border)', overflow:'hidden', opacity:b.status==='Historical'?0.7:1 }}>
                      <div className="px-3 py-2 flex items-center justify-between text-xs"
                        style={{ background:'#F7F8FA', borderBottom:'1px solid var(--border)' }}>
                        <span className="font-semibold" style={{ color:'var(--foreground)' }}>
                          {b.bankName} · {b.accountType}
                        </span>
                        <div className="flex items-center gap-2">
                          {b.status==='Historical' && (
                            <span className="badge-slate px-2 py-0.5 text-[10px] font-bold">Historical</span>
                          )}
                          {b.status==='Active' && (
                            <button onClick={()=>handleSetPrimary(editEmp.id,b.id)}
                              className="text-[11px] font-bold px-2 py-0.5 cursor-pointer"
                              style={{ background:'var(--primary-light)', color:'var(--primary)', border:'1px solid #B0CFF9' }}>
                              Set Primary
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="p-3 grid grid-cols-2 gap-2 text-xs">
                        <div><span style={{ color:'var(--muted)' }}>Account:</span> <span className="font-mono font-bold">{b.accountNo}</span></div>
                        <div><span style={{ color:'var(--muted)' }}>IFSC:</span> <span className="font-mono">{b.ifsc}</span></div>
                        <div><span style={{ color:'var(--muted)' }}>Added:</span> <span>{b.addedOn}</span></div>
                        {b.closedOn && <div><span style={{ color:'var(--muted)' }}>Closed:</span> <span>{b.closedOn}</span></div>}
                      </div>
                    </div>
                  ))}

                  {/* Add bank form */}
                  {showAddBank && (
                    <div style={{ border:'1px solid var(--primary)', overflow:'hidden' }}>
                      <div className="px-4 py-2.5 text-xs font-bold" style={{ background:'var(--primary-light)', color:'var(--primary)', borderBottom:'1px solid #B0CFF9' }}>
                        Add New Bank Account
                      </div>
                      <div className="p-4 grid grid-cols-2 gap-4">
                        <Fld label="Bank Name" req>
                          <Sel value={newBankForm.bankName} onChange={e=>setNewBankForm(p=>({...p,bankName:e.target.value}))}>
                            <option value="">Select Bank…</option>
                            {['HDFC Bank','State Bank of India','Punjab National Bank','ICICI Bank','Axis Bank','Bank of Baroda','Canara Bank','Other'].map(b=><option key={b}>{b}</option>)}
                          </Sel>
                        </Fld>
                        <Fld label="Account Type" req>
                          <Sel value={newBankForm.accountType} onChange={e=>setNewBankForm(p=>({...p,accountType:e.target.value as 'Savings'|'Current'}))}>
                            <option value="Savings">Savings</option>
                            <option value="Current">Current</option>
                          </Sel>
                        </Fld>
                        <Fld label="Account Number" req>
                          <Inp mono value={newBankForm.accountNo} onChange={e=>setNewBankForm(p=>({...p,accountNo:e.target.value}))} />
                        </Fld>
                        <Fld label="IFSC Code" req>
                          <Inp mono value={newBankForm.ifsc} onChange={e=>setNewBankForm(p=>({...p,ifsc:e.target.value.toUpperCase()}))} placeholder="HDFC0000123" />
                        </Fld>
                        <Fld label="Branch Name">
                          <Inp value={newBankForm.bankBranch} onChange={e=>setNewBankForm(p=>({...p,bankBranch:e.target.value}))} />
                        </Fld>
                      </div>
                      <div className="px-4 pb-4 flex gap-2">
                        <button onClick={handleAddBank}
                          className="px-4 py-2 text-sm font-semibold text-white cursor-pointer"
                          style={{ background:'var(--primary)' }}>
                          {isAdmin||isOwner ? 'Add Account' : 'Submit for Approval'}
                        </button>
                        <button onClick={()=>setShowAddBank(false)}
                          className="px-4 py-2 text-sm font-semibold cursor-pointer"
                          style={{ border:'1px solid var(--border)', color:'var(--foreground)' }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Salary */}
              {editTab==='salary' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {([['basicSalary','Basic Salary (₹)'],['hra','HRA (₹)'],['conveyance','Conveyance (₹)'],['specialAllowance','Special Allow. (₹)']] as [keyof Employee,string][]).map(([f,l])=>(
                      <Fld key={f} label={l}>
                        <Inp type="number" value={String(editDraft[f]??editEmp[f]??0)} onChange={e=>setDraft(f,Number(e.target.value))} />
                      </Fld>
                    ))}
                  </div>
                  {/* Live CTC */}
                  {(() => {
                    const basic = Number(editDraft['basicSalary']??editEmp.basicSalary);
                    const hra = Number(editDraft['hra']??editEmp.hra);
                    const conv = Number(editDraft['conveyance']??editEmp.conveyance);
                    const sp = Number(editDraft['specialAllowance']??editEmp.specialAllowance);
                    const gross = basic+hra+conv+sp;
                    const pf = Math.round(Math.min(basic,15000)*0.12);
                    const esi = gross<=21000?Math.round(gross*0.0075):0;
                    return (
                      <div className="p-4 grid grid-cols-3 gap-4 text-center"
                        style={{ background:'var(--primary-light)', border:'1px solid #B0CFF9' }}>
                        <div>
                          <div className="text-xs" style={{ color:'var(--muted)' }}>Gross / Month</div>
                          <div className="text-lg font-black" style={{ color:'var(--foreground)' }}>₹{gross.toLocaleString('en-IN')}</div>
                        </div>
                        <div>
                          <div className="text-xs" style={{ color:'var(--muted)' }}>PF+ESI Deduction</div>
                          <div className="text-lg font-black text-red-600">₹{(pf+esi).toLocaleString('en-IN')}</div>
                        </div>
                        <div>
                          <div className="text-xs" style={{ color:'var(--muted)' }}>Net In-Hand</div>
                          <div className="text-lg font-black text-green-700">₹{(gross-pf-esi).toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    );
                  })()}
                  <div className="grid grid-cols-2 gap-4">
                    {([['pfNumber','PF Number'],['uanNumber','UAN Number'],['esiNumber','ESI Number']] as [keyof Employee,string][]).map(([f,l])=>(
                      <Fld key={f} label={l}>
                        <Inp mono value={String(editDraft[f]??editEmp[f]??'')} onChange={e=>setDraft(f,e.target.value)} />
                      </Fld>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="px-5 py-4 flex items-center justify-between shrink-0"
              style={{ borderTop:'1px solid var(--border)', background:'#F7F8FA' }}>
              <div className="text-xs" style={{ color:'var(--muted)' }}>
                {Object.keys(editDraft).length > 0
                  ? <span style={{ color:'var(--primary)' }}>{Object.keys(editDraft).length} field(s) modified</span>
                  : 'No changes yet'}
              </div>
              <div className="flex gap-2">
                <button onClick={()=>{setEditEmp(null);setEditDraft({});}}
                  className="px-4 py-2 text-sm font-semibold cursor-pointer"
                  style={{ border:'1px solid var(--border)', color:'var(--foreground)' }}>
                  Cancel
                </button>
                <button onClick={handleSaveEdit}
                  disabled={Object.keys(editDraft).length===0&&!showAddBank}
                  className="px-4 py-2 text-sm font-semibold text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background:'var(--primary)' }}
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='var(--primary-dark)'}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='var(--primary)'}>
                  {isAdmin||isOwner ? '💾 Save Changes' : '📤 Submit for Approval'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Credential Slip ────────────────────────────────────────────────────── */}
      {credSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:'rgba(0,0,0,0.5)' }}>
          <div className="bg-white w-full max-w-md shadow-2xl overflow-hidden" style={{ border:'1px solid var(--border)' }}>
            <div className="p-5 text-white" style={{ background:'#16A34A' }}>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6" />
                <div>
                  <div className="font-bold text-base">Employee Onboarded!</div>
                  <div className="text-green-100 text-xs">Credentials generated — share securely</div>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="p-4 space-y-2.5 text-sm" style={{ background:'var(--background)', border:'1px solid var(--border)' }}>
                {[['Employee',`${credSlip.name} (${credSlip.empCode})`],['Email',credSlip.email]].map(([l,v])=>(
                  <div key={l} className="flex justify-between gap-4 pb-2.5" style={{ borderBottom:'1px solid var(--border)' }}>
                    <span style={{ color:'var(--muted)' }}>{l}:</span>
                    <span className="font-semibold text-right" style={{ color:'var(--foreground)' }}>{v}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center">
                  <span style={{ color:'var(--muted)' }}>Password:</span>
                  <span className="font-mono font-black text-white px-3 py-1 tracking-widest"
                    style={{ background:'var(--primary)', fontSize:14 }}>{credSlip.pass}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={copySlip}
                  className="flex-1 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
                  style={{ border:'1px solid var(--border)', color:'var(--foreground)' }}>
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Slip'}
                </button>
                <button onClick={()=>setCredSlip(null)}
                  className="flex-1 py-2.5 text-sm font-semibold text-white cursor-pointer"
                  style={{ background:'var(--primary)' }}>
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Bulk Upload Modal ──────────────────────────────────────────────────── */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:'rgba(0,0,0,0.5)' }}>
          <div className="bg-white w-full max-w-md shadow-2xl" style={{ border:'1px solid var(--border)' }}>
            <div className="p-5 flex items-center justify-between" style={{ borderBottom:'1px solid var(--border)' }}>
              <div className="font-bold flex items-center gap-2" style={{ color:'var(--foreground)' }}>
                <Upload className="w-4 h-4" style={{ color:'var(--primary)' }} /> Bulk Employee Import
              </div>
              <button onClick={()=>setShowUpload(false)} className="cursor-pointer" style={{ color:'var(--muted)' }}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-3 text-xs" style={{ background:'var(--primary-light)', border:'1px solid #B0CFF9', color:'var(--primary-dark)' }}>
                <strong>Required columns:</strong><br/>
                <span className="font-mono">EmpCode, Name, Department, Designation, Phone, Email, JoiningDate, BankName, AccountNo, IFSC, PFNumber, UAN, ESI, PAN, Basic, HRA, Conveyance, Special</span>
              </div>
              <label className="block cursor-pointer">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className="p-8 text-center transition"
                  style={{
                    border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border)'}`,
                    background: isDragging ? 'var(--primary-light)' : 'transparent'
                  }}
                  onMouseEnter={e=>{
                    if(!isDragging){
                      (e.currentTarget as HTMLElement).style.borderColor='var(--primary)';
                      (e.currentTarget as HTMLElement).style.background='var(--primary-light)';
                    }
                  }}
                  onMouseLeave={e=>{
                    if(!isDragging){
                      (e.currentTarget as HTMLElement).style.borderColor='var(--border)';
                      (e.currentTarget as HTMLElement).style.background='transparent';
                    }
                  }}>
                  <FileSpreadsheet className="w-8 h-8 mx-auto mb-2" style={{ color:'var(--primary)' }} />
                  <div className="text-sm font-semibold" style={{ color:'var(--foreground)' }}>Click to upload or drag and drop</div>
                  <div className="text-xs mt-1" style={{ color:'var(--muted)' }}>Excel (.xlsx, .xls) or CSV supported</div>
                </div>
                <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleExcel} />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Employee Multi-Step Modal ──────────────────────────────────────── */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:'rgba(0,0,0,0.5)' }}>
          <div className="bg-white w-full max-w-3xl shadow-2xl flex flex-col" style={{ maxHeight:'92vh', border:'1px solid var(--border)' }}>

            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between shrink-0" style={{ background:'var(--primary)', color:'#fff' }}>
              <div>
                <div className="font-bold text-base">New Employee Onboarding</div>
                <div className="text-blue-100 text-xs mt-0.5">Step {step} of {STEPS.length} — {STEPS[step-1].desc}</div>
              </div>
              <button onClick={()=>{setShowAdd(false);setStep(1);}} className="p-1.5 cursor-pointer" style={{ opacity:.8 }}><X className="w-5 h-5" /></button>
            </div>

            {/* Step nav */}
            <div className="flex shrink-0" style={{ background:'#F7F8FA', borderBottom:'1px solid var(--border)' }}>
              {STEPS.map(s=>{
                const Icon=s.icon; const done=s.id<step; const active=s.id===step;
                return (
                  <button key={s.id} onClick={()=>s.id<=step&&setStep(s.id)}
                    className="flex-1 py-3 flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                    style={active ? {color:'var(--primary)',borderBottom:'2px solid var(--primary)',background:'#fff'} : done ? {color:'#16A34A'} : {color:'var(--muted)'}}>
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:block">{s.label}</span>
                    {done && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6" style={{ minHeight: 0 }}>
              {step===1 && (
                <div>
                  <StepHead icon="👤" title="Personal & Employment Details" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Fld label="Company" req><Sel value={form.companyId} onChange={e=>set('companyId',e.target.value)}>{companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</Sel></Fld>
                    <Fld label="Employee Code" req><Inp mono placeholder="e.g. SSC-101" value={form.empCode} onChange={e=>set('empCode',e.target.value)} /></Fld>
                    <Fld label="Full Name" req><Inp placeholder="As per Aadhaar" value={form.name} onChange={e=>set('name',e.target.value)} /></Fld>
                    <Fld label="Date of Birth"><Inp type="date" value={form.dateOfBirth} onChange={e=>set('dateOfBirth',e.target.value)} /></Fld>
                    <Fld label="Gender"><Sel value={form.gender} onChange={e=>set('gender',e.target.value)}><option>Male</option><option>Female</option><option>Other</option></Sel></Fld>
                    <Fld label="Blood Group"><Sel value={form.bloodGroup} onChange={e=>set('bloodGroup',e.target.value)}>{['','A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b=><option key={b} value={b}>{b||'Select…'}</option>)}</Sel></Fld>
                    <Fld label="Marital Status"><Sel value={form.maritalStatus} onChange={e=>set('maritalStatus',e.target.value)}><option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option></Sel></Fld>
                    <Fld label="Nationality"><Inp value={form.nationality} onChange={e=>set('nationality',e.target.value)} /></Fld>
                    <Fld label="Father's Name"><Inp value={form.fatherName} onChange={e=>set('fatherName',e.target.value)} /></Fld>
                    <Fld label="Mother's Name"><Inp value={form.motherName} onChange={e=>set('motherName',e.target.value)} /></Fld>
                    <Fld label="Religion"><Inp value={form.religion} onChange={e=>set('religion',e.target.value)} /></Fld>
                    <Fld label="Phone" req><Inp mono placeholder="10-digit mobile" value={form.phone} onChange={e=>set('phone',e.target.value)} /></Fld>
                    <Fld label="Email (Login)" req><Inp type="email" value={form.email} onChange={e=>set('email',e.target.value)} /></Fld>
                    <Fld label="Joining Date" req><Inp type="date" value={form.joiningDate} onChange={e=>set('joiningDate',e.target.value)} /></Fld>
                    <Fld label="Department" req><Inp value={form.department} onChange={e=>set('department',e.target.value)} /></Fld>
                    <Fld label="Designation" req><Inp value={form.designation} onChange={e=>set('designation',e.target.value)} /></Fld>
                  </div>
                </div>
              )}
              {step===2 && (
                <div>
                  <StepHead icon="📍" title="Address Details" />
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <Fld label="Present Street / Locality"><Inp value={form.addressPresent} onChange={e=>set('addressPresent',e.target.value)} /></Fld>
                    <Fld label="City"><Inp value={form.cityPresent} onChange={e=>set('cityPresent',e.target.value)} /></Fld>
                    <Fld label="State"><Inp value={form.statePresent} onChange={e=>set('statePresent',e.target.value)} /></Fld>
                    <Fld label="PIN Code"><Inp mono maxLength={6} value={form.pinPresent} onChange={e=>set('pinPresent',e.target.value)} /></Fld>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer mb-5">
                    <input type="checkbox" checked={form.sameAsPermanent} onChange={e=>set('sameAsPermanent',e.target.checked)} className="w-4 h-4 accent-blue-600" />
                    <span className="text-sm font-semibold" style={{ color:'var(--foreground)' }}>Permanent address same as present</span>
                  </label>
                  {!form.sameAsPermanent && (
                    <div className="grid grid-cols-2 gap-4">
                      <Fld label="Permanent Street"><Inp value={form.addressPermanent} onChange={e=>set('addressPermanent',e.target.value)} /></Fld>
                      <Fld label="City"><Inp value={form.cityPermanent} onChange={e=>set('cityPermanent',e.target.value)} /></Fld>
                      <Fld label="State"><Inp value={form.statePermanent} onChange={e=>set('statePermanent',e.target.value)} /></Fld>
                      <Fld label="PIN Code"><Inp mono maxLength={6} value={form.pinPermanent} onChange={e=>set('pinPermanent',e.target.value)} /></Fld>
                    </div>
                  )}
                </div>
              )}
              {step===3 && (
                <div>
                  <StepHead icon="❤️" title="Family & Nominee" />
                  <div className="p-3 mb-4 text-xs" style={{ background:'#FEF3C7', border:'1px solid #FCD34D', color:'#92400E' }}>
                    Nominee details required for PF Form 2 & ESI beneficiary registration.
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Fld label="Nominee Name"><Inp value={form.nomineeName} onChange={e=>set('nomineeName',e.target.value)} /></Fld>
                    <Fld label="Relation"><Sel value={form.nomineeRelation} onChange={e=>set('nomineeRelation',e.target.value)}><option value="">Select…</option>{['Spouse','Father','Mother','Son','Daughter','Brother','Sister','Other'].map(r=><option key={r}>{r}</option>)}</Sel></Fld>
                    <Fld label="Nominee DOB"><Inp type="date" value={form.nomineeDob} onChange={e=>set('nomineeDob',e.target.value)} /></Fld>
                    <Fld label="Share (%)"><Inp mono value={form.nomineeShare} onChange={e=>set('nomineeShare',e.target.value)} /></Fld>
                    <Fld label="Spouse Name"><Inp value={form.spouseName} onChange={e=>set('spouseName',e.target.value)} /></Fld>
                    <Fld label="Spouse Employment"><Sel value={String(form.spouseEmployed)} onChange={e=>set('spouseEmployed',e.target.value==='true')}><option value="false">Not Employed</option><option value="true">Employed</option></Sel></Fld>
                  </div>
                </div>
              )}
              {step===4 && (
                <div>
                  <StepHead icon="🪪" title="KYC — Identity Documents" />
                  <SectionBox title="Aadhaar Card" icon="🪪">
                    <Fld label="Aadhaar Number" req><Inp mono placeholder="1234 5678 9012" value={form.aadhaarNumber} onChange={e=>set('aadhaarNumber',e.target.value.replace(/\D/g,'').slice(0,12))} /></Fld>
                    <Fld label="Name on Aadhaar" req><Inp placeholder="As on Aadhaar" value={form.aadhaarName} onChange={e=>set('aadhaarName',e.target.value)} /></Fld>
                  </SectionBox>
                  <SectionBox title="PAN Card" icon="🟡">
                    <Fld label="PAN Number" req><Inp mono placeholder="ABCDE1234F" value={form.panNumber} onChange={e=>set('panNumber',e.target.value.toUpperCase().slice(0,10))} /></Fld>
                    <Fld label="Name on PAN" req><Inp value={form.panName} onChange={e=>set('panName',e.target.value)} /></Fld>
                  </SectionBox>
                  <SectionBox title="Other Documents (Optional)" icon="📄">
                    <Fld label="Passport No."><Inp mono value={form.passportNumber} onChange={e=>set('passportNumber',e.target.value.toUpperCase())} /></Fld>
                    <Fld label="Passport Expiry"><Inp type="date" value={form.passportExpiry} onChange={e=>set('passportExpiry',e.target.value)} /></Fld>
                    <Fld label="Driving License"><Inp mono value={form.drivingLicense} onChange={e=>set('drivingLicense',e.target.value.toUpperCase())} /></Fld>
                    <Fld label="Voter ID (EPIC)"><Inp mono value={form.voterIdNumber} onChange={e=>set('voterIdNumber',e.target.value.toUpperCase())} /></Fld>
                  </SectionBox>
                </div>
              )}
              {step===5 && (
                <div>
                  <StepHead icon="🏦" title="Bank Account" />
                  <div className="grid grid-cols-2 gap-4">
                    <Fld label="Bank Name" req><Sel value={form.bankName} onChange={e=>set('bankName',e.target.value)}><option value="">Select…</option>{['HDFC Bank','State Bank of India','Punjab National Bank','ICICI Bank','Axis Bank','Bank of Baroda','Canara Bank','Kotak Mahindra Bank','Other'].map(b=><option key={b}>{b}</option>)}</Sel></Fld>
                    <Fld label="Account Type"><Sel value={form.accountType} onChange={e=>set('accountType',e.target.value)}><option value="Savings">Savings</option><option value="Current">Current</option></Sel></Fld>
                    <Fld label="Account Number" req><Inp mono value={form.accountNo} onChange={e=>set('accountNo',e.target.value)} /></Fld>
                    <Fld label="Confirm Account No." req><Inp mono placeholder="Re-enter account number" /></Fld>
                    <Fld label="IFSC Code" req><Inp mono placeholder="HDFC0000123" value={form.ifsc} onChange={e=>set('ifsc',e.target.value.toUpperCase())} /></Fld>
                    <Fld label="Branch Name"><Inp value={form.bankBranch} onChange={e=>set('bankBranch',e.target.value)} /></Fld>
                  </div>
                </div>
              )}
              {step===6 && (
                <div>
                  <StepHead icon="💰" title="Salary & Statutory Numbers" />
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs font-bold uppercase tracking-wider" style={{ color:'var(--muted)' }}>Salary Structure</div>
                    <Sel value={form.salaryStructureType} onChange={e=>set('salaryStructureType',e.target.value)} style={{...inputSt,width:'auto',fontWeight:700,color:'var(--primary)'}}>
                      <option value="Individual">Individual</option>
                      <option value="Composite">Composite / Grade-Based</option>
                    </Sel>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Fld label="Basic Salary (₹)" req><Inp type="number" value={form.basicSalary||''} onChange={e=>set('basicSalary',Number(e.target.value))} /></Fld>
                    <Fld label="HRA (₹)"><Inp type="number" value={form.hra||''} onChange={e=>set('hra',Number(e.target.value))} /></Fld>
                    <Fld label="Conveyance (₹)"><Inp type="number" value={form.conveyance||''} onChange={e=>set('conveyance',Number(e.target.value))} /></Fld>
                    <Fld label="Special Allowance (₹)"><Inp type="number" value={form.specialAllowance||''} onChange={e=>set('specialAllowance',Number(e.target.value))} /></Fld>
                  </div>
                  {form.basicSalary>0 && (()=>{
                    const gross=form.basicSalary+form.hra+form.conveyance+form.specialAllowance;
                    const pf=Math.round(Math.min(form.basicSalary,15000)*0.12);
                    const esi=gross<=21000?Math.round(gross*0.0075):0;
                    return (
                      <div className="p-4 grid grid-cols-3 gap-4 text-center mb-4"
                        style={{ background:'var(--primary-light)', border:'1px solid #B0CFF9' }}>
                        <div><div className="text-xs mb-1" style={{ color:'var(--muted)' }}>Gross</div><div className="font-black text-lg">₹{gross.toLocaleString('en-IN')}</div></div>
                        <div><div className="text-xs mb-1" style={{ color:'var(--muted)' }}>PF+ESI</div><div className="font-black text-lg text-red-600">₹{(pf+esi).toLocaleString('en-IN')}</div></div>
                        <div><div className="text-xs mb-1" style={{ color:'var(--muted)' }}>Net</div><div className="font-black text-lg text-green-700">₹{(gross-pf-esi).toLocaleString('en-IN')}</div></div>
                      </div>
                    );
                  })()}
                  <div className="grid grid-cols-2 gap-4">
                    <Fld label="PF Number"><Inp mono placeholder="CHD/12345/001" value={form.pfNumber} onChange={e=>set('pfNumber',e.target.value)} /></Fld>
                    <Fld label="UAN Number"><Inp mono placeholder="12-digit UAN" value={form.uanNumber} onChange={e=>set('uanNumber',e.target.value)} /></Fld>
                    <Fld label="ESI Number"><Inp mono placeholder="10-digit ESI" value={form.esiNumber} onChange={e=>set('esiNumber',e.target.value)} /></Fld>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 flex items-center justify-between shrink-0"
              style={{ borderTop:'1px solid var(--border)', background:'#F7F8FA' }}>
              <button onClick={()=>step>1&&setStep(s=>s-1)} disabled={step===1}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ border:'1px solid var(--border)', color:'var(--foreground)', background:'#fff' }}>
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <div className="flex gap-1.5 items-center">
                {STEPS.map(s=>(
                  <div key={s.id} className="h-2 transition-all"
                    style={{ width:s.id===step?24:8, background:s.id===step?'var(--primary)':s.id<step?'#16A34A':'#D1D5DB' }} />
                ))}
              </div>
              {step<STEPS.length ? (
                <button onClick={()=>setStep(s=>s+1)}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white cursor-pointer"
                  style={{ background:'var(--primary)' }}
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='var(--primary-dark)'}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='var(--primary)'}>
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleAddSubmit}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white cursor-pointer"
                  style={{ background:'#16A34A' }}>
                  <CheckCircle2 className="w-4 h-4" /> Register Employee
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
