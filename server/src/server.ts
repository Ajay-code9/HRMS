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
    pfCode: req.body.pfCode || 'CHD/12345',
    esiCode: req.body.esiCode || '1234567890',
    branchesCount: req.body.branchesCount || 1,
    employeeCount: req.body.employeeCount || 0,
    contactPerson: req.body.contactPerson || 'HR Admin',
    phone: req.body.phone || '9876543210',
    email: req.body.email || 'hr@company.com',
    city: req.body.city || 'Chandigarh',
    state: req.body.state || 'Chandigarh',
    industry: req.body.industry || 'Information Technology',
    industryType: req.body.industryType || 'REGULAR'
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
    dbCompanies.unshift(created as any);
    return res.json({ success: true, data: created });
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

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Node.js Express Prisma API Server running on Port ${PORT}`);
  console.log(`=================================================`);
});
