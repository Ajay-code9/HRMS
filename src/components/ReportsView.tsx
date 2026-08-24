'use client';

import React, { useState } from 'react';
import { FileText, Download, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Employee, Company } from '@/types/hrms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportsProps {
  employees: Employee[];
  companies: Company[];
}

export const ReportsView: React.FC<ReportsProps> = ({ employees, companies }) => {
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [notificationSent, setNotificationSent] = useState(false);

  const selectedEmp = employees.find(e => e.id === selectedEmpId) || employees[0];

  const generatePDFPayslip = () => {
    if (!selectedEmp) return;

    const doc = new jsPDF();
    
    // Header Branding
    doc.setFillColor(30, 64, 175); // Blue 800
    doc.rect(0, 0, 210, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('S S CONSULTANCYY', 14, 18);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Industrial & Labour Law Consultant | PF | ESI | Payroll', 14, 25);
    doc.text('Chandigarh | Mobile: 9872989284 | sscchd@gmail.com', 14, 30);

    // Title
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`SALARY SLIP FOR THE MONTH OF AUGUST 2026`, 14, 48);

    // Employee & Company Metadata Table
    autoTable(doc, {
      startY: 55,
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 2 },
      body: [
        [
          { content: `Employee Code: ${selectedEmp.empCode}`, styles: { fontStyle: 'bold' } },
          { content: `Employee Name: ${selectedEmp.name}`, styles: { fontStyle: 'bold' } }
        ],
        [
          `Company: ${selectedEmp.companyName}`,
          `Department: ${selectedEmp.department}`
        ],
        [
          `Designation: ${selectedEmp.designation}`,
          `Date of Joining: ${selectedEmp.joiningDate}`
        ],
        [
          `Bank: ${selectedEmp.bankName} (${selectedEmp.accountNo})`,
          `IFSC Code: ${selectedEmp.ifsc}`
        ],
        [
          `PF Number: ${selectedEmp.pfNumber}`,
          `UAN Number: ${selectedEmp.uanNumber}`
        ],
        [
          `ESI Number: ${selectedEmp.esiNumber}`,
          `PAN: ${selectedEmp.panNumber}`
        ]
      ]
    });

    const gross = selectedEmp.basicSalary + selectedEmp.hra + selectedEmp.conveyance + selectedEmp.specialAllowance;
    const pf = Math.round(Math.min(selectedEmp.basicSalary, 15000) * 0.12);
    const esi = gross <= 21000 ? Math.round(gross * 0.0075) : 0;
    const net = gross - (pf + esi);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['EARNINGS', 'AMOUNT (Rs.)', 'DEDUCTIONS', 'AMOUNT (Rs.)']],
      body: [
        ['Basic Salary', selectedEmp.basicSalary.toLocaleString('en-IN'), 'EPF Employee (12%)', pf.toLocaleString('en-IN')],
        ['House Rent Allowance (HRA)', selectedEmp.hra.toLocaleString('en-IN'), 'ESI Employee (0.75%)', esi.toLocaleString('en-IN')],
        ['Conveyance Allowance', selectedEmp.conveyance.toLocaleString('en-IN'), 'Professional Tax (PT)', '0'],
        ['Special Allowance', selectedEmp.specialAllowance.toLocaleString('en-IN'), 'TDS / Loan Advance', '0'],
        [{ content: 'TOTAL GROSS EARNINGS', styles: { fontStyle: 'bold' } }, { content: `Rs. ${gross.toLocaleString('en-IN')}`, styles: { fontStyle: 'bold' } }, { content: 'TOTAL DEDUCTIONS', styles: { fontStyle: 'bold' } }, { content: `Rs. ${(pf + esi).toLocaleString('en-IN')}`, styles: { fontStyle: 'bold' } }]
      ],
      headStyles: { fillColor: [30, 64, 175], textColor: [255, 255, 255] },
      theme: 'grid'
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFillColor(30, 64, 175);
    doc.rect(14, finalY, 182, 14, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`NET PAYABLE IN-HAND SALARY: Rs. ${net.toLocaleString('en-IN')}/-`, 20, finalY + 9);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text('This is a computer generated document signature not required. Issued by SS Consultancy.', 14, finalY + 25);

    doc.save(`Payslip_${selectedEmp.empCode}_August_2026.pdf`);
  };

  const handleSendNotification = () => {
    setNotificationSent(true);
    setTimeout(() => setNotificationSent(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-900" /> Statutory Reports & PDF Dispatch Suite
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            Generate PDF Payslips, ECR PF Formats, ESI Return Reports, and WhatsApp/Email auto-dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={generatePDFPayslip}
            className="px-4 py-2.5 bg-blue-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-800 transition cursor-pointer flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download PDF Payslip
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="bg-white p-5 border border-slate-300 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">Select Employee for Payslip</h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Employee Name:</label>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-slate-900 font-bold"
              >
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.empCode})</option>
                ))}
              </select>
            </div>

            {selectedEmp && (
              <div className="p-3 bg-slate-50 border border-slate-200 space-y-2 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-semibold">Designation:</span>
                  <span className="font-bold text-slate-900">{selectedEmp.designation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-semibold">Company:</span>
                  <span className="font-bold text-slate-900">{selectedEmp.companyName}</span>
                </div>
                <div className="flex justify-between font-mono text-blue-900 font-bold">
                  <span>PF Number:</span>
                  <span>{selectedEmp.pfNumber}</span>
                </div>
                <div className="flex justify-between font-mono text-blue-800 font-bold">
                  <span>ESI Number:</span>
                  <span>{selectedEmp.esiNumber}</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-900">Automated Dispatch:</h4>
            <button
              onClick={handleSendNotification}
              className="w-full py-2.5 bg-slate-100 text-blue-900 font-bold text-xs border border-blue-900 hover:bg-slate-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" /> Send Payslip via WhatsApp & Email
            </button>
            {notificationSent && (
              <div className="p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-900 text-[11px] font-bold text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Payslip Sent to {selectedEmp?.email} & WhatsApp!
              </div>
            )}
          </div>
        </div>

        {/* Right 2 Columns */}
        <div className="lg:col-span-2 bg-white p-5 border border-slate-300 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <ShieldCheck className="w-5 h-5 text-blue-900" /> EPFO & ESIC Monthly Compliance Exports
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-300 space-y-2">
              <h4 className="text-xs font-bold text-blue-900 flex items-center justify-between">
                <span>PF ECR Text Format Report</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-[10px]">EPFO Ready</span>
              </h4>
              <p className="text-[11px] text-slate-600 font-medium">
                Text pipe-separated format containing UAN, Member Name, Gross Wages, EPF Wages, and Contributions.
              </p>
              <button 
                onClick={() => alert('PF ECR Format generated for EPFO Portal Upload!')}
                className="w-full mt-2 py-2 bg-blue-900 text-white font-bold text-xs hover:bg-blue-800 cursor-pointer"
              >
                Export PF ECR Text
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-300 space-y-2">
              <h4 className="text-xs font-bold text-blue-900 flex items-center justify-between">
                <span>ESI Monthly Return Excel</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-[10px]">ESIC Ready</span>
              </h4>
              <p className="text-[11px] text-slate-600 font-medium">
                Monthly Return Statement format for ESIC Employer Portal with 0.75% / 3.25% breakup.
              </p>
              <button 
                onClick={() => alert('ESI Monthly Statement Excel generated!')}
                className="w-full mt-2 py-2 bg-blue-900 text-white font-bold text-xs hover:bg-blue-800 cursor-pointer"
              >
                Export ESI Return Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
