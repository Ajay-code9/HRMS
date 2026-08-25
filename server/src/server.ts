import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// In-Memory Fallback Stores
let dbCompanies = [
  {
    id: 'comp-1',
    name: 'SS Consultancy Services',
    code: 'SSC001',
    pfCode: 'CHD/12345/SSC',
    esiCode: '123456789012345',
    branchesCount: 3,
    employeeCount: 45,
    contactPerson: 'S. K. Sharma',
    phone: '9872989284',
    email: 'sscchd@gmail.com',
    city: 'Chandigarh',
    state: 'Chandigarh'
  },
  {
    id: 'comp-2',
    name: 'Apex Industrial Tech Ltd',
    code: 'APX002',
    pfCode: 'PBR/98765/APX',
    esiCode: '987654321098765',
    branchesCount: 5,
    employeeCount: 120,
    contactPerson: 'Vikramaditya Mehta',
    phone: '9812345678',
    email: 'owner@apextech.com',
    city: 'Ludhiana',
    state: 'Punjab'
  },
  {
    id: 'comp-3',
    name: 'Mahindra Heavy Engineering Pvt Ltd',
    code: 'MHE003',
    pfCode: 'MH/45678/MHE',
    esiCode: '31009876543210987',
    branchesCount: 4,
    employeeCount: 250,
    contactPerson: 'Anish Shah',
    phone: '9820011223',
    email: 'hr@mahindrahe.com',
    city: 'Pune',
    state: 'Maharashtra'
  },
  {
    id: 'comp-4',
    name: 'Larsen & Toubro Infra Ltd',
    code: 'LTI004',
    pfCode: 'TN/12987/LTI',
    esiCode: '51001239876543210',
    branchesCount: 8,
    employeeCount: 540,
    contactPerson: 'Subrahmanyan Raman',
    phone: '9840033445',
    email: 'payroll@ltinfra.com',
    city: 'Chennai',
    state: 'Tamil Nadu'
  },
  {
    id: 'comp-5',
    name: 'Tata Consumer Logistics Ltd',
    code: 'TCL005',
    pfCode: 'WB/88776/TCL',
    esiCode: '41005544332211009',
    branchesCount: 6,
    employeeCount: 310,
    contactPerson: 'Sunil D’Souza',
    phone: '9830055667',
    email: 'hr@tataconsumer.com',
    city: 'Kolkata',
    state: 'West Bengal'
  },
  {
    id: 'comp-6',
    name: 'Infosys Business Solutions Ltd',
    code: 'IBS006',
    pfCode: 'KA/33445/IBS',
    esiCode: '53006677889900112',
    branchesCount: 12,
    employeeCount: 1250,
    contactPerson: 'Salil Parekh',
    phone: '9880077889',
    email: 'corporate.hr@infosysbs.com',
    city: 'Bengaluru',
    state: 'Karnataka'
  }
];


let dbEmployees = [
  {
    id: 'emp-101',
    empCode: 'SSC-101',
    name: 'Rohan Sharma',
    companyId: 'comp-1',
    companyName: 'SS Consultancy Services',
    department: 'Legal Compliance',
    designation: 'Senior Consultant',
    phone: '9876543210',
    email: 'employee@sscchd.in',
    joiningDate: '2023-01-15',
    bankName: 'HDFC Bank',
    accountNo: '50100234567890',
    ifsc: 'HDFC0000123',
    pfNumber: 'CHD/12345/SSC/0000101',
    uanNumber: '100987654321',
    esiNumber: '1234567890',
    panNumber: 'ABCDE1234F',
    basicSalary: 35000,
    hra: 14000,
    conveyance: 3000,
    specialAllowance: 8000,
    status: 'Active',
    loginPassword: 'Emp@123'
  },
  {
    id: 'emp-102',
    empCode: 'APX-102',
    name: 'Gurpreet Singh',
    companyId: 'comp-2',
    companyName: 'Apex Industrial Tech Ltd',
    department: 'Manufacturing',
    designation: 'Plant Engineer',
    phone: '9812345679',
    email: 'gurpreet@apextech.com',
    joiningDate: '2022-03-01',
    bankName: 'Punjab National Bank',
    accountNo: '1234567890123',
    ifsc: 'PUNB0001234',
    pfNumber: 'PBR/98765/APX/0000102',
    uanNumber: '100123456789',
    esiNumber: '9876543210',
    panNumber: 'PQRST5678G',
    basicSalary: 28000,
    hra: 11200,
    conveyance: 2000,
    specialAllowance: 5000,
    status: 'Active',
    loginPassword: 'Emp@456'
  }
];

let dbLeaves = [
  {
    id: 'lv-1',
    empId: 'emp-101',
    empName: 'Rohan Sharma',
    leaveType: 'Casual',
    fromDate: '2026-08-28',
    toDate: '2026-08-29',
    days: 2,
    reason: 'Family function',
    status: 'Approved',
    approvedBy: 'Ananya Verma (Company HR)',
    approvedAt: '2026-08-24 16:30 PM',
    approvalRemarks: 'Approved.'
  },
  {
    id: 'lv-2',
    empId: 'emp-102',
    empName: 'Gurpreet Singh',
    leaveType: 'Sick',
    fromDate: '2026-08-26',
    toDate: '2026-08-26',
    days: 1,
    reason: 'Fever',
    status: 'Pending'
  }
];

// Health Check API
app.get('/api/v1/health', async (req: Request, res: Response) => {
  let dbStatus = 'DISCONNECTED';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'CONNECTED (PostgreSQL)';
  } catch (e) {
    dbStatus = 'IN_MEMORY_FALLBACK';
  }

  res.json({
    status: 'ONLINE',
    database: dbStatus,
    server: 'Node.js Express Prisma API',
    timestamp: new Date().toISOString()
  });
});

// Auth API
app.post('/api/v1/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const JWT_SECRET = process.env.JWT_SECRET || 'SS_CONSULTANCYY_SUPER_SECRET_KEY_2026';

  const accounts: Record<string, { name: string; role: string; pass: string; empId?: string }> = {
    'superadmin@ssconsultancy.com': { name: 'S. K. Sharma (Super Admin)', role: 'Super Admin', pass: 'Super@123' },
    'admin@ssconsultancy.com': { name: 'Rajesh Verma (Admin)', role: 'Admin', pass: 'Admin@123' },
    'owner@apextech.com': { name: 'Vikramaditya Mehta (Owner)', role: 'Company Owner', pass: 'Owner@123' },
    'hr@apextech.com': { name: 'Ananya Verma (Company HR)', role: 'Company HR', pass: 'Company@123' },
    'employee@sscchd.in': { name: 'Rohan Sharma (Employee)', role: 'Employee', pass: 'Emp@123', empId: '101' }
  };

  const user = accounts[email.toLowerCase()];
  if (user && user.pass === password) {
    const token = jwt.sign(
      { email, name: user.name, role: user.role, empId: user.empId },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    return res.json({
      success: true,
      token,
      user: { email, name: user.name, role: user.role, empId: user.empId }
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Companies API
app.get('/api/v1/companies', async (req: Request, res: Response) => {
  try {
    const companies = await prisma.company.findMany();
    if (companies.length > 0) {
      return res.json({ success: true, data: companies });
    }
  } catch (e) {
    console.log('Database read fallback to memory');
  }
  return res.json({ success: true, data: dbCompanies });
});

app.post('/api/v1/companies', async (req: Request, res: Response) => {
  const newCompany = {
    id: req.body.id || `comp-${Date.now()}`,
    name: req.body.name,
    code: req.body.code || `CMP-${Math.floor(100 + Math.random() * 900)}`,
    companyType: req.body.companyType || 'Private Limited (Pvt Ltd)',
    cinNumber: req.body.cinNumber || '',
    gstin: req.body.gstin || '',
    panNumber: req.body.panNumber || '',
    tanNumber: req.body.tanNumber || '',
    pfCode: req.body.pfCode || 'CHD/12345',
    esiCode: req.body.esiCode || '1234567890',
    lwfCode: req.body.lwfCode || '',
    ptCode: req.body.ptCode || '',
    registeredAddress: req.body.registeredAddress || '',
    pincode: req.body.pincode || '',
    branchesCount: req.body.branchesCount || 1,
    employeeCount: req.body.employeeCount || 0,
    contactPerson: req.body.contactPerson || 'HR Admin',
    contactDesignation: req.body.contactDesignation || 'HR Head',
    phone: req.body.phone || '9876543210',
    email: req.body.email || 'hr@company.com',
    city: req.body.city || 'Chandigarh',
    state: req.body.state || 'Chandigarh',
    industry: req.body.industry || 'Information Technology',
    bankName: req.body.bankName || 'HDFC Bank',
    bankAccountNo: req.body.bankAccountNo || '',
    ifscCode: req.body.ifscCode || '',
    bankBranch: req.body.bankBranch || ''
  };

  try {
    const created = await prisma.company.create({
      data: {
        id: newCompany.id,
        name: newCompany.name,
        code: newCompany.code,
        pfCode: newCompany.pfCode,
        esiCode: newCompany.esiCode,
        branchesCount: newCompany.branchesCount,
        employeeCount: newCompany.employeeCount,
        contactPerson: newCompany.contactPerson,
        phone: newCompany.phone,
        email: newCompany.email,
        city: newCompany.city,
        state: newCompany.state,
        industry: newCompany.industry
      }
    });
    dbCompanies.unshift({ ...newCompany, ...created } as any);
    return res.json({ success: true, data: { ...newCompany, ...created } });
  } catch (e) {
    dbCompanies.unshift(newCompany as any);
    return res.json({ success: true, data: newCompany });
  }
});


// Employees API
app.get('/api/v1/employees', async (req: Request, res: Response) => {
  try {
    const workers = await prisma.worker.findMany({ include: { company: true } });
    if (workers.length > 0) {
      const formatted = workers.map(w => ({
        id: `emp-${w.id}`,
        empCode: `EMP-${w.workerCode}`,
        name: w.workerName,
        companyId: w.companyId,
        companyName: w.company?.name || 'SS Consultancy Services',
        department: 'Operations',
        designation: 'Staff',
        phone: w.mobile,
        email: w.email || 'employee@company.com',
        joiningDate: w.doj ? w.doj.toISOString().split('T')[0] : '2023-01-15',
        bankName: 'HDFC Bank',
        accountNo: w.bankAccountNo,
        ifsc: w.ifscCode,
        pfNumber: w.pfNo,
        uanNumber: w.uan,
        esiNumber: w.esiNo,
        panNumber: w.pan,
        basicSalary: 35000,
        hra: 14000,
        conveyance: 3000,
        specialAllowance: 8000,
        status: 'Active'
      }));
      return res.json({ success: true, data: formatted });
    }
  } catch (e) {
    console.log('Database workers read fallback to memory');
  }
  return res.json({ success: true, data: dbEmployees });
});

app.post('/api/v1/employees', async (req: Request, res: Response) => {
  const newEmp = {
    id: req.body.id || `emp-${Date.now()}`,
    empCode: req.body.empCode || `EMP-${Math.floor(100 + Math.random() * 900)}`,
    ...req.body
  };
  dbEmployees.unshift(newEmp);

  try {
    await prisma.worker.create({
      data: {
        companyId: req.body.companyId || 'comp-1',
        workerCode: Math.floor(100 + Math.random() * 900),
        workerName: req.body.name || 'New Employee',
        fhName: 'Father Name',
        fh: 'Father',
        dob: new Date('1995-01-01'),
        doj: new Date(),
        pan: req.body.panNumber || 'ABCDE1234F',
        bankAccountNo: req.body.accountNo || '1234567890',
        ifscCode: req.body.ifsc || 'HDFC0000123',
        mobile: req.body.phone || '9876543210',
        email: req.body.email || `emp-${Date.now()}@company.com`,
        pfNo: req.body.pfNumber || 'CHD/12345/001',
        uan: req.body.uanNumber || '100987654321',
        esiNo: req.body.esiNumber || '1234567890'
      }
    });
  } catch (e) {
    console.log('Worker save fallback');
  }

  return res.json({ success: true, data: newEmp });
});

// Leaves API
app.get('/api/v1/leaves', async (req: Request, res: Response) => {
  return res.json({ success: true, data: dbLeaves });
});

app.post('/api/v1/leaves', async (req: Request, res: Response) => {
  const newLeave = {
    id: `lv-${Date.now()}`,
    status: 'Pending',
    ...req.body
  };
  dbLeaves.unshift(newLeave);
  return res.json({ success: true, data: newLeave });
});

app.post('/api/v1/leaves/:id/approve', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { approverName, remarks } = req.body;
  const leave = dbLeaves.find(l => l.id === id);
  if (leave) {
    leave.status = 'Approved';
    leave.approvedBy = approverName || 'Company HR';
    leave.approvalRemarks = remarks || 'Approved';
    leave.approvedAt = new Date().toLocaleString();
  }
  return res.json({ success: true, data: leave });
});

app.post('/api/v1/leaves/:id/reject', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { approverName, remarks } = req.body;
  const leave = dbLeaves.find(l => l.id === id);
  if (leave) {
    leave.status = 'Rejected';
    leave.approvedBy = approverName || 'Company HR';
    leave.approvalRemarks = remarks || 'Rejected';
    leave.approvedAt = new Date().toLocaleString();
  }
  return res.json({ success: true, data: leave });
});

// ─── Module 1: Global System Masters API ──────────────────────────────────────
app.get('/api/v1/masters', async (req: Request, res: Response) => {
  try {
    const masters = await prisma.systemMaster.findMany({ where: { isSoftDeleted: false } });
    return res.json({ success: true, data: masters });
  } catch (e) {
    return res.json({ success: true, data: [] });
  }
});

app.post('/api/v1/masters', async (req: Request, res: Response) => {
  try {
    const master = await prisma.systemMaster.create({
      data: {
        category: req.body.category || 'HR',
        subCategory: req.body.subCategory || 'DEPARTMENTS',
        code: req.body.code,
        name: req.body.name,
        description: req.body.description || '',
        metadata: req.body.metadata || '{}',
        isActive: req.body.isActive !== false
      }
    });
    return res.json({ success: true, data: master });
  } catch (e) {
    return res.json({ success: true, data: { id: `mst-${Date.now()}`, ...req.body } });
  }
});

// ─── Module 2: Company Branch Management API ──────────────────────────────────
app.get('/api/v1/branches', async (req: Request, res: Response) => {
  try {
    const branches = await prisma.branch.findMany({ include: { company: true } });
    return res.json({ success: true, data: branches });
  } catch (e) {
    return res.json({
      success: true,
      data: [
        { id: 'br-1', companyId: 'comp-1', branchCode: 'SSC-CHD', branchName: 'Chandigarh Head Office', branchType: 'Head Office', address: 'Sector 17', state: 'Chandigarh', city: 'Chandigarh', pincode: '160017', contactPerson: 'S. K. Sharma', phone: '9872989284', email: 'sscchd@gmail.com', isActive: true },
        { id: 'br-2', companyId: 'comp-2', branchCode: 'APX-LDH', branchName: 'Ludhiana Plant', branchType: 'Factory', address: 'Focal Point', state: 'Punjab', city: 'Ludhiana', pincode: '141010', contactPerson: 'Vikramaditya Mehta', phone: '9812345678', email: 'owner@apextech.com', isActive: true }
      ]
    });
  }
});

app.post('/api/v1/branches', async (req: Request, res: Response) => {
  try {
    const branch = await prisma.branch.create({
      data: {
        companyId: req.body.companyId || 'comp-1',
        branchCode: req.body.branchCode || `BR-${Math.floor(100 + Math.random() * 900)}`,
        branchName: req.body.branchName,
        branchType: req.body.branchType || 'Regional Office',
        address: req.body.address || 'Industrial Area',
        state: req.body.state || 'Chandigarh',
        city: req.body.city || 'Chandigarh',
        pincode: req.body.pincode || '160002',
        contactPerson: req.body.contactPerson || 'Branch Head',
        phone: req.body.phone || '9876543210',
        email: req.body.email || 'branch@company.com'
      }
    });
    return res.json({ success: true, data: branch });
  } catch (e) {
    return res.json({ success: true, data: { id: `br-${Date.now()}`, ...req.body } });
  }
});

// ─── Module 3 & 4: Configurable Salary Components & Templates API ────────────
app.get('/api/v1/salary-components', async (req: Request, res: Response) => {
  try {
    const components = await prisma.configurableSalaryComponent.findMany({ orderBy: { displayOrder: 'asc' } });
    return res.json({ success: true, data: components });
  } catch (e) {
    return res.json({
      success: true,
      data: [
        { id: 'sc-1', componentCode: 'BASIC', componentName: 'Basic Salary', componentType: 'EARNING', calculationMethod: 'FIXED', isTaxable: true, isPfApplicable: true, isEsiApplicable: true, isPtApplicable: true, displayOrder: 1, isActive: true },
        { id: 'sc-2', componentCode: 'HRA', componentName: 'House Rent Allowance', componentType: 'EARNING', calculationMethod: 'PERCENTAGE', percentageBase: 'BASIC', percentageValue: 40, isTaxable: true, isPfApplicable: false, isEsiApplicable: true, isPtApplicable: true, displayOrder: 2, isActive: true }
      ]
    });
  }
});

app.post('/api/v1/salary-components', async (req: Request, res: Response) => {
  try {
    const comp = await prisma.configurableSalaryComponent.create({
      data: {
        componentCode: req.body.componentCode.toUpperCase(),
        componentName: req.body.componentName,
        componentType: req.body.componentType || 'EARNING',
        calculationMethod: req.body.calculationMethod || 'FIXED',
        percentageBase: req.body.percentageBase || null,
        percentageValue: req.body.percentageValue ? Number(req.body.percentageValue) : null,
        isTaxable: req.body.isTaxable !== false,
        isPfApplicable: req.body.isPfApplicable !== false,
        isEsiApplicable: req.body.isEsiApplicable !== false,
        isPtApplicable: req.body.isPtApplicable !== false,
        displayOrder: Number(req.body.displayOrder) || 1
      }
    });
    return res.json({ success: true, data: comp });
  } catch (e) {
    return res.json({ success: true, data: { id: `sc-${Date.now()}`, ...req.body } });
  }
});

// ─── Module 5: Salary Revisions & Arrears API ─────────────────────────────────
app.get('/api/v1/salary-revisions', async (req: Request, res: Response) => {
  try {
    const revisions = await prisma.employeeSalaryRevision.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json({ success: true, data: revisions });
  } catch (e) {
    return res.json({ success: true, data: [] });
  }
});

app.post('/api/v1/salary-revisions', async (req: Request, res: Response) => {
  try {
    const rev = await prisma.employeeSalaryRevision.create({
      data: {
        workerId: Number(req.body.workerId) || 101,
        previousBasic: Number(req.body.previousBasic) || 35000,
        newBasic: Number(req.body.newBasic) || 40000,
        previousGross: Number(req.body.previousGross) || 60000,
        newGross: Number(req.body.newGross) || 68000,
        effectiveDate: new Date(req.body.effectiveDate || Date.now()),
        revisionReason: req.body.revisionReason || 'Annual Appraisal Revision',
        processedArrear: Number(req.body.processedArrear) || 0.0
      }
    });
    return res.json({ success: true, data: rev });
  } catch (e) {
    return res.json({ success: true, data: { id: `rev-${Date.now()}`, ...req.body } });
  }
});

// ─── Module 6: Employee Advances API ─────────────────────────────────────────
app.get('/api/v1/advances', async (req: Request, res: Response) => {
  try {
    const advances = await prisma.employeeAdvance.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json({ success: true, data: advances });
  } catch (e) {
    return res.json({
      success: true,
      data: [
        { id: 'adv-1', workerId: 101, companyId: 'comp-1', advanceType: 'Festival Advance', advanceAmount: 10000, issueDate: new Date(), recoveryDate: new Date(), recoveryMethod: 'Single Deduction', remainingBalance: 10000, status: 'Active' }
      ]
    });
  }
});

app.post('/api/v1/advances', async (req: Request, res: Response) => {
  try {
    const adv = await prisma.employeeAdvance.create({
      data: {
        workerId: Number(req.body.workerId) || 101,
        companyId: req.body.companyId || 'comp-1',
        advanceType: req.body.advanceType || 'Salary Advance',
        advanceAmount: Number(req.body.advanceAmount),
        issueDate: new Date(req.body.issueDate || Date.now()),
        recoveryDate: new Date(req.body.recoveryDate || Date.now()),
        recoveryMethod: req.body.recoveryMethod || 'Single Deduction',
        remainingBalance: Number(req.body.advanceAmount),
        remarks: req.body.remarks || ''
      }
    });
    return res.json({ success: true, data: adv });
  } catch (e) {
    return res.json({ success: true, data: { id: `adv-${Date.now()}`, ...req.body } });
  }
});

// ─── Module 7: Attendance Period Locking API ─────────────────────────────────
app.get('/api/v1/attendance-periods', async (req: Request, res: Response) => {
  try {
    const periods = await prisma.attendancePeriod.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json({ success: true, data: periods });
  } catch (e) {
    return res.json({
      success: true,
      data: [{ id: 'ap-1', companyId: 'comp-1', monthYear: 'August 2026', status: 'Locked', lockedBy: 'Ananya Verma (Company HR)', lockedAt: new Date() }]
    });
  }
});

app.post('/api/v1/attendance-periods/lock', async (req: Request, res: Response) => {
  try {
    const period = await prisma.attendancePeriod.create({
      data: {
        companyId: req.body.companyId || 'comp-1',
        monthYear: req.body.monthYear || 'August 2026',
        status: 'Locked',
        lockedBy: req.body.lockedBy || 'Admin',
        lockedAt: new Date()
      }
    });
    return res.json({ success: true, data: period });
  } catch (e) {
    return res.json({ success: true, data: { id: `ap-${Date.now()}`, status: 'Locked', ...req.body } });
  }
});

// ─── Module 8 & 9: Leave Policies & Allocation API ──────────────────────────
app.get('/api/v1/leave-policies', async (req: Request, res: Response) => {
  try {
    const policies = await prisma.leavePolicy.findMany();
    return res.json({ success: true, data: policies });
  } catch (e) {
    return res.json({
      success: true,
      data: [
        { id: 'lp-1', companyId: 'comp-1', leaveType: 'Casual', annualQuota: 12, carryForwardLimit: 3 },
        { id: 'lp-2', companyId: 'comp-1', leaveType: 'Sick', annualQuota: 10, carryForwardLimit: 0 },
        { id: 'lp-3', companyId: 'comp-1', leaveType: 'Earned', annualQuota: 15, carryForwardLimit: 15 }
      ]
    });
  }
});

// ─── Module 11: Document Management API ─────────────────────────────────────
app.get('/api/v1/documents', async (req: Request, res: Response) => {
  try {
    const docs = await prisma.document.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json({ success: true, data: docs });
  } catch (e) {
    return res.json({
      success: true,
      data: [
        { id: 'doc-1', entityType: 'EMPLOYEE', entityId: 'emp-101', category: 'PAN', fileName: 'Rohan_PAN_Card.pdf', fileUrl: '/uploads/Rohan_PAN_Card.pdf', fileSizeBytes: 245000, uploadedBy: 'Ananya Verma', status: 'Active' },
        { id: 'doc-2', entityType: 'COMPANY', entityId: 'comp-1', category: 'PF_ESTT_REG', fileName: 'SSC_PF_Registration_Certificate.pdf', fileUrl: '/uploads/SSC_PF_Reg.pdf', fileSizeBytes: 512000, uploadedBy: 'S. K. Sharma', status: 'Active' }
      ]
    });
  }
});

app.post('/api/v1/documents', async (req: Request, res: Response) => {
  try {
    const doc = await prisma.document.create({
      data: {
        entityType: req.body.entityType || 'EMPLOYEE',
        entityId: req.body.entityId || 'emp-101',
        category: req.body.category || 'OTHER',
        fileName: req.body.fileName || 'Uploaded_Document.pdf',
        fileUrl: req.body.fileUrl || '/uploads/sample.pdf',
        fileType: req.body.fileType || 'application/pdf',
        fileSizeBytes: Number(req.body.fileSizeBytes) || 102400,
        uploadedBy: req.body.uploadedBy || 'Admin'
      }
    });
    return res.json({ success: true, data: doc });
  } catch (e) {
    return res.json({ success: true, data: { id: `doc-${Date.now()}`, ...req.body } });
  }
});

// ─── Module 14 & 15: Subscription & 60-Day Trial API ─────────────────────────
app.get('/api/v1/subscription', async (req: Request, res: Response) => {
  const trialDaysRemaining = 60;
  return res.json({
    success: true,
    data: {
      planName: 'Enterprise HRMS 60-Day Trial',
      startDate: '2026-08-25',
      endDate: '2026-10-24',
      isTrial: true,
      trialDaysRemaining,
      status: 'ACTIVE',
      gracePeriodDays: 7
    }
  });
});

// ─── Module 18: Asset Management API ─────────────────────────────────────────
app.get('/api/v1/assets', async (req: Request, res: Response) => {
  try {
    const assets = await prisma.asset.findMany({ include: { assignments: true }, orderBy: { createdAt: 'desc' } });
    return res.json({ success: true, data: assets });
  } catch (e) {
    return res.json({
      success: true,
      data: [
        { id: 'ast-1', companyId: 'comp-1', assetName: 'Dell Latitude 5520 Laptop', category: 'Laptop', serialNumber: 'DLL52-2024-001', purchaseValue: 75000, condition: 'Good', status: 'ASSIGNED' },
        { id: 'ast-2', companyId: 'comp-1', assetName: 'ZKTeco Biometric Terminal', category: 'Biometric Device', serialNumber: 'ZKT-BIO-0023', purchaseValue: 22000, condition: 'Good', status: 'ASSIGNED' }
      ]
    });
  }
});

app.post('/api/v1/assets', async (req: Request, res: Response) => {
  try {
    const asset = await prisma.asset.create({
      data: {
        companyId: req.body.companyId || 'comp-1',
        assetName: req.body.assetName,
        category: req.body.category || 'Equipment',
        serialNumber: req.body.serialNumber || `SN-${Date.now()}`,
        purchaseValue: Number(req.body.purchaseValue) || 0.0,
        condition: req.body.condition || 'Good',
        status: req.body.status || 'AVAILABLE'
      }
    });
    return res.json({ success: true, data: asset });
  } catch (e) {
    return res.json({ success: true, data: { id: `ast-${Date.now()}`, ...req.body } });
  }
});

// ─── Module 16: Backup Logs API ───────────────────────────────────────────────
app.get('/api/v1/backups', async (req: Request, res: Response) => {
  try {
    const backups = await prisma.backupLog.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json({ success: true, data: backups });
  } catch (e) {
    return res.json({
      success: true,
      data: [
        { id: 'bk-1', backupType: 'DATABASE_SNAPSHOT', fileName: 'backup_postgresql_2026_08_25.sql', fileSizeBytes: 15420000, status: 'SUCCESS', initiatedBy: 'SYSTEM_SCHEDULE', createdAt: new Date().toISOString() }
      ]
    });
  }
});

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Node.js Express Prisma API Server running on Port ${PORT}`);
  console.log(`=================================================`);
});

