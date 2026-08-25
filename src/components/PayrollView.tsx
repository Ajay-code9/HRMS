'use client';

import React, { useState } from 'react';
import {
  Calculator, CheckCircle2, FileSpreadsheet, ShieldCheck,
  Upload, Download, DollarSign, Calendar, Users, IndianRupee,
  AlertCircle, X
} from 'lucide-react';
import { Employee, GlobalParameter, PayrollRecord, AttendanceRecord } from '@/types/hrms';
import * as XLSX from 'xlsx';

interface PayrollProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  globalParams: GlobalParameter;
}

export const PayrollView: React.FC<PayrollProps> = ({
  employees,
  attendance,
  globalParams
}) => {
  const [selectedMonth, setSelectedMonth] = useState('August 2026');
  const [cutoffMode, setCutoffMode] = useState<'Full' | 'Mid' | 'Custom'>('Full');
  const [customDays, setCustomDays] = useState<number>(15);
  const [calculatedPayroll, setCalculatedPayroll] = useState<PayrollRecord[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);
  const [arrearAmount, setArrearAmount] = useState<number>(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // ── 1. Dynamic Attendance-Based Pro-Rata Salary Calculation Engine ───────
  const runPayrollEngine = () => {
    const daysInPeriod = cutoffMode === 'Full' ? 30 : cutoffMode === 'Mid' ? 15 : (customDays || 15);

    const records: PayrollRecord[] = employees.map(emp => {
      // Find attendance record for employee
      const att = attendance.find(a => a.empId === emp.id);

      // Determine present days based on selected cutoff period (e.g. 15/30 or 30/30)
      const presentDays = att
        ? (att.status === 'Present' ? daysInPeriod : att.status === 'Half Day' ? daysInPeriod - 0.5 : Math.max(1, daysInPeriod - 2))
        : daysInPeriod;

      const otHours = att ? att.overtimeHours : 0;

      // Pro-rata factor relative to full 30-day monthly structure
      const factor = presentDays / 30;

      const basicEarned = Math.round(emp.basicSalary * factor);
      const hraEarned = Math.round(emp.hra * factor);
      const conveyanceEarned = Math.round(emp.conveyance * factor);
      const specialEarned = Math.round(emp.specialAllowance * factor);
      const overtimePay = Math.round(otHours * (emp.basicSalary / (30 * 8)) * 2);
      const arrears = emp.id === 'emp-101' ? arrearAmount : 0;

      const grossSalary = basicEarned + hraEarned + conveyanceEarned + specialEarned + overtimePay + arrears;

      // EPF Deduction (12% capped at pfCapLimit e.g. 15,000)
      const pfBase = Math.min(basicEarned, globalParams.pfCapLimit);
      const pfDeduction = Math.round(pfBase * (globalParams.pfEmployeeRate / 100));

      // ESIC Deduction (0.75% if Gross <= esiCapLimit e.g. 21,000)
      const esiDeduction = grossSalary <= globalParams.esiCapLimit 
        ? Math.round(grossSalary * (globalParams.esiEmployeeRate / 100))
        : 0;

      const tdsDeduction = grossSalary > 50000 ? 1500 : 0;
      const loanDeduction = emp.id === 'emp-101' ? 2500 : 0;

      const totalDeductions = pfDeduction + esiDeduction + tdsDeduction + loanDeduction;
      const netSalary = grossSalary - totalDeductions;

      return {
        id: `pay-${emp.id}-${Date.now()}`,
        empId: emp.id,
        empName: emp.name,
        companyName: emp.companyName,
        month: `${selectedMonth} (${daysInPeriod} Days Cutoff)`,
        workingDays: daysInPeriod,
        presentDays,
        basicEarned,
        hraEarned,
        conveyanceEarned,
        specialEarned,
        overtimePay,
        arrears,
        grossSalary,
        pfDeduction,
        esiDeduction,
        tdsDeduction,
        loanDeduction,
        totalDeductions,
        netSalary,
        status: 'Calculated'
      };
    });

    setCalculatedPayroll(records);
    setIsCalculated(true);
  };

  // ── 2. Excel Salary Sheet Template Parser ───────────────────────────────────
  const processSalaryFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const wb = XLSX.read(evt.target?.result, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);
        if (!data || data.length === 0) {
          alert('⚠️ Uploaded salary sheet is empty or invalid.');
          return;
        }

        const daysInPeriod = cutoffMode === 'Full' ? 30 : cutoffMode === 'Mid' ? 15 : (customDays || 15);

        const importedRecords: PayrollRecord[] = data.map((row, i) => {
          const name = String(row['Employee Name'] || row['Employee'] || row['Name'] || row['empName'] || `Employee ${i + 1}`);
          const workingDays = Number(row['Working Days'] || row['WorkingDays'] || daysInPeriod);
          const presentDays = Number(row['Present Days'] || row['PresentDays'] || row['Present'] || workingDays);
          const basic = Number(row['Basic Earned'] || row['Basic'] || row['basicEarned'] || 18000);
          const hra = Number(row['HRA'] || row['hraEarned'] || 7200);
          const conv = Number(row['Conveyance'] || row['conveyanceEarned'] || 1600);
          const special = Number(row['Special Allowance'] || row['Special'] || row['specialEarned'] || 2000);
          const otPay = Number(row['Overtime Pay'] || row['OT Pay'] || row['overtimePay'] || 0);
          const arrears = Number(row['Arrears'] || row['arrears'] || 0);
          const gross = Number(row['Gross Salary'] || row['Gross'] || row['grossSalary'] || (basic + hra + conv + special + otPay + arrears));
          const pf = Number(row['EPF Deduction (12%)'] || row['PF'] || row['pfDeduction'] || Math.round(Math.min(basic, globalParams.pfCapLimit) * (globalParams.pfEmployeeRate / 100)));
          const esi = Number(row['ESI Deduction (0.75%)'] || row['ESI'] || row['esiDeduction'] || (gross <= globalParams.esiCapLimit ? Math.round(gross * (globalParams.esiEmployeeRate / 100)) : 0));
          const loan = Number(row['Loan/Advance Deduction'] || row['Loan'] || row['loanDeduction'] || 0);
          const totalDeductions = Number(row['Total Deductions'] || row['totalDeductions'] || (pf + esi + loan));
          const net = Number(row['Net In-Hand Salary'] || row['Net Salary'] || row['netSalary'] || (gross - totalDeductions));

          return {
            id: `pay-import-${Date.now()}-${i}`,
            empId: `emp-imp-${i}`,
            empName: name,
            companyName: String(row['Company'] || row['companyName'] || employees[0]?.companyName || 'SS Consultancy Services'),
            month: selectedMonth,
            workingDays,
            presentDays,
            basicEarned: basic,
            hraEarned: hra,
            conveyanceEarned: conv,
            specialEarned: special,
            overtimePay: otPay,
            arrears,
            grossSalary: gross,
            pfDeduction: pf,
            esiDeduction: esi,
            tdsDeduction: 0,
            loanDeduction: loan,
            totalDeductions,
            netSalary: net,
            status: 'Calculated'
          };
        });

        setCalculatedPayroll(importedRecords);
        setIsCalculated(true);
        setShowUploadModal(false);
        alert(`✅ Uploaded sheet processed successfully! Loaded ${importedRecords.length} employee payroll records.`);
      } catch (err) {
        console.error('Failed to parse salary sheet', err);
        alert('❌ Error reading file. Please ensure it is a valid Excel (.xlsx, .xls) or CSV file.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSalaryFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processSalaryFile(file);
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
    if (file) processSalaryFile(file);
  };

  // ── 3. Export Salary Register to Excel ──────────────────────────────────────
  const exportSalaryRegisterExcel = () => {
    if (calculatedPayroll.length === 0) return;
    const excelData = calculatedPayroll.map(p => ({
      'Employee Name': p.empName,
      'Company': p.companyName,
      'Month': p.month,
      'Working Days': p.workingDays,
      'Present Days': p.presentDays,
      'Basic Earned': p.basicEarned,
      'HRA': p.hraEarned,
      'Conveyance': p.conveyanceEarned,
      'Special Allowance': p.specialEarned,
      'Overtime Pay': p.overtimePay,
      'Arrears': p.arrears,
      'Gross Salary': p.grossSalary,
      'EPF Deduction (12%)': p.pfDeduction,
      'ESI Deduction (0.75%)': p.esiDeduction,
      'Loan/Advance Deduction': p.loanDeduction,
      'Total Deductions': p.totalDeductions,
      'Net In-Hand Salary': p.netSalary
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Salary_Register');
    XLSX.writeFile(wb, `Salary_Register_${selectedMonth.replace(/\s+/g, '_')}.xlsx`);
  };

  // Totals for Summary Metrics
  const totalGross = calculatedPayroll.reduce((acc, p) => acc + p.grossSalary, 0);
  const totalDeductions = calculatedPayroll.reduce((acc, p) => acc + p.totalDeductions, 0);
  const totalNet = calculatedPayroll.reduce((acc, p) => acc + p.netSalary, 0);

  return (
    <div className="space-y-5">

      {/* ── 1. Top Control Banner ────────────────────────────────────────────── */}
      <div className="bg-white p-5 border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-900" /> Automated Salary, OT & Arrear Calculation Engine (Req 6)
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            Attendance-linked salary calculations, Template Salary Sheet Upload, PF/ESI deductions & Loan recoveries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3.5 py-2 bg-slate-100 text-blue-950 font-bold text-xs border border-blue-900 flex items-center gap-1.5 hover:bg-slate-200 cursor-pointer"
          >
            <Upload className="w-4 h-4" /> Upload Salary Template
          </button>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-slate-50 text-slate-900 text-xs px-3 py-2 border border-slate-300 font-bold focus:outline-none cursor-pointer"
          >
            <option value="August 2026">August 2026</option>
            <option value="July 2026">July 2026</option>
            <option value="June 2026">June 2026</option>
          </select>

          <button
            onClick={runPayrollEngine}
            className="px-4 py-2 bg-blue-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-800 transition cursor-pointer flex items-center gap-2"
          >
            <Calculator className="w-4 h-4" /> CALCULATE SALARY SHEET
          </button>
        </div>
      </div>

      {/* ── 2. Attendance Cutoff & Pro-Rata Controls Panel ──────────────────── */}
      <div className="bg-white p-4 border border-slate-300 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-900 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Attendance Pull & Pro-Rata Cutoff Selector</h4>
              <p className="text-[11px] text-slate-600">Select pay period duration (e.g. 15-day mid-month pull or 30-day full month) to automatically calculate pro-rata salary.</p>
            </div>
          </div>

          {/* Period selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCutoffMode('Full')}
              className={`px-3 py-1.5 text-xs font-bold border transition cursor-pointer ${cutoffMode === 'Full' ? 'bg-blue-900 text-white border-blue-900' : 'bg-slate-50 text-slate-700 border-slate-300'}`}
            >
              Full Month (30 Days)
            </button>
            <button
              onClick={() => setCutoffMode('Mid')}
              className={`px-3 py-1.5 text-xs font-bold border transition cursor-pointer ${cutoffMode === 'Mid' ? 'bg-blue-900 text-white border-blue-900' : 'bg-slate-50 text-slate-700 border-slate-300'}`}
            >
              15-Day Cutoff (1-15th)
            </button>
            <button
              onClick={() => setCutoffMode('Custom')}
              className={`px-3 py-1.5 text-xs font-bold border transition cursor-pointer ${cutoffMode === 'Custom' ? 'bg-blue-900 text-white border-blue-900' : 'bg-slate-50 text-slate-700 border-slate-300'}`}
            >
              Custom Days
            </button>

            {cutoffMode === 'Custom' && (
              <input
                type="number"
                min={1}
                max={31}
                value={customDays}
                onChange={e => setCustomDays(Number(e.target.value))}
                className="w-16 bg-slate-50 border border-slate-300 px-2 py-1 text-slate-900 text-xs font-mono font-bold"
                placeholder="Days"
              />
            )}
          </div>
        </div>

        {/* Arrear Amount Box */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Arrear Calculation Adjustment (Req 6.c)</h4>
              <p className="text-[11px] text-slate-600">Enter pending arrear adjustment amount to append to Gross Salary calculation.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Arrear Amount (₹):</span>
            <input
              type="number"
              value={arrearAmount}
              onChange={e => setArrearAmount(Number(e.target.value))}
              className="w-28 bg-slate-50 border border-slate-300 px-3 py-1 text-slate-900 font-mono font-bold text-xs"
            />
          </div>
        </div>
      </div>

      {/* ── 3. Summary KPI Bar (When Calculated / Uploaded) ──────────────────── */}
      {isCalculated && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 border border-slate-300 shadow-sm space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Staff</div>
            <div className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-900" /> {calculatedPayroll.length}
            </div>
          </div>
          <div className="bg-white p-4 border border-slate-300 shadow-sm space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Gross Salary</div>
            <div className="text-xl font-extrabold text-blue-950 flex items-center gap-1 font-mono">
              ₹{totalGross.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-white p-4 border border-slate-300 shadow-sm space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Statutory Deductions</div>
            <div className="text-xl font-extrabold text-rose-700 flex items-center gap-1 font-mono">
              ₹{totalDeductions.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-white p-4 border border-slate-300 shadow-sm space-y-1 bg-emerald-50/50">
            <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Net Payable Payout</div>
            <div className="text-xl font-extrabold text-emerald-900 flex items-center gap-1 font-mono">
              ₹{totalNet.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      )}

      {/* ── 4. Main Table or Empty Card State ───────────────────────────────── */}
      {isCalculated ? (
        <div className="bg-white border border-slate-300 shadow-sm space-y-4 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" /> Payroll Sheet for {selectedMonth}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Pro-rata calculations based on attendance present days & statutory cap rules.</p>
            </div>
            <button
              onClick={exportSalaryRegisterExcel}
              className="px-4 py-2 bg-blue-900 text-white font-bold text-xs hover:bg-blue-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" /> Download Salary Register Excel
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-300">
                <tr>
                  <th className="p-3 border-r border-slate-200">#</th>
                  <th className="p-3 border-r border-slate-200">Employee</th>
                  <th className="p-3 border-r border-slate-200 text-center">Present / Period Days</th>
                  <th className="p-3 border-r border-slate-200 text-right">Basic Earned</th>
                  <th className="p-3 border-r border-slate-200 text-right">HRA</th>
                  <th className="p-3 border-r border-slate-200 text-right">OT Pay</th>
                  <th className="p-3 border-r border-slate-200 text-right">Arrears</th>
                  <th className="p-3 border-r border-slate-200 text-right text-blue-950 font-black">Gross Salary</th>
                  <th className="p-3 border-r border-slate-200 text-right text-rose-700">EPF (12%)</th>
                  <th className="p-3 border-r border-slate-200 text-right text-rose-700">ESI (0.75%)</th>
                  <th className="p-3 border-r border-slate-200 text-right text-amber-900">Loan Deduction</th>
                  <th className="p-3 text-right text-emerald-800 font-bold">Net Payable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {calculatedPayroll.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 border-r border-slate-200 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                    <td className="p-3 border-r border-slate-200 font-bold text-slate-900">
                      <div>{p.empName}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{p.companyName}</div>
                    </td>
                    <td className="p-3 border-r border-slate-200 font-mono text-center font-bold text-blue-900">
                      {p.presentDays} / {p.workingDays} days
                    </td>
                    <td className="p-3 border-r border-slate-200 text-right font-mono text-slate-900">₹{p.basicEarned.toLocaleString('en-IN')}</td>
                    <td className="p-3 border-r border-slate-200 text-right font-mono text-slate-600">₹{p.hraEarned.toLocaleString('en-IN')}</td>
                    <td className="p-3 border-r border-slate-200 text-right font-mono text-blue-900 font-bold">₹{p.overtimePay.toLocaleString('en-IN')}</td>
                    <td className="p-3 border-r border-slate-200 text-right font-mono text-emerald-800 font-bold">₹{p.arrears}</td>
                    <td className="p-3 border-r border-slate-200 text-right font-mono text-blue-950 font-black">₹{p.grossSalary.toLocaleString('en-IN')}</td>
                    <td className="p-3 border-r border-slate-200 text-right font-mono text-rose-700 font-bold">₹{p.pfDeduction}</td>
                    <td className="p-3 border-r border-slate-200 text-right font-mono text-rose-700 font-bold">₹{p.esiDeduction}</td>
                    <td className="p-3 border-r border-slate-200 text-right font-mono text-amber-900 font-bold">₹{p.loanDeduction}</td>
                    <td className="p-3 text-right font-mono text-emerald-800 font-black text-sm">₹{p.netSalary.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ── Exact Empty State Card as Requested ────────────────────────────── */
        <div className="bg-white p-14 text-center border border-slate-300 shadow-sm space-y-3">
          <div className="w-14 h-14 bg-slate-100 border border-slate-300 flex items-center justify-center mx-auto">
            <Calculator className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Payroll Not Yet Calculated for {selectedMonth}</h3>
          <p className="text-xs text-slate-500">Click &quot;Calculate Salary Sheet&quot; above to run attendance & statutory rules.</p>
        </div>
      )}

      {/* ── 5. Salary Sheet Template Upload Modal (With Drag & Drop) ───────── */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg p-6 border-2 border-blue-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-900" /> Upload Salary Sheet Template (Req 6.b)
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-1">
              <strong>Supported sheet columns:</strong>
              <div className="font-mono text-[11px] text-blue-900">
                Employee Name, Company, Working Days, Present Days, Basic Earned, HRA, Conveyance, Special Allowance, Overtime Pay, Arrears, Gross Salary, EPF Deduction, ESI Deduction, Loan Deduction, Net Salary
              </div>
            </div>

            <label className="block cursor-pointer">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="p-8 text-center transition border-2 border-dashed"
                style={{
                  borderColor: isDragging ? 'var(--primary)' : '#CBD5E1',
                  background: isDragging ? 'var(--primary-light)' : '#F8FAFC'
                }}
              >
                <FileSpreadsheet className="w-10 h-10 text-blue-900 mx-auto mb-2" />
                <div className="text-sm font-bold text-slate-900">Click to upload or drag and drop</div>
                <div className="text-xs text-slate-500 mt-1">Excel (.xlsx, .xls) or CSV files supported</div>
              </div>
              <input type="file" accept=".xlsx,.xls,.csv" onChange={handleSalaryFileInput} className="hidden" />
            </label>

            <div className="flex justify-end">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

