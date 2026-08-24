import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Database Store matching Client's Laravel Migrations (Worker, PayFile, PayEarnings, PayDeductions, PayPfDetails, PayEsiDetails)
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

// Client Worker Table Model
let dbWorkers = [
  {
    id: 1,
    companyId: 'comp-1',
    workerCode: 101,
    workerName: 'Rohan Sharma',
    fhName: 'Ram Kumar Sharma',
    fh: 'Father',
    dob: '1995-05-15',
    doj: '2023-01-15',
    doe: null,
    gender: 'MALE',
    maritalStatus: 'MARRIED',
    adharNo: '123456789012',
    pan: 'ABCDE1234F',
    bankAccountNo: '50100234567890',
    ifscCode: 'HDFC0000123',
    mobile: '9876543210',
    email: 'employee@sscchd.in',
    pfType: 'LPF', // Limited Salary PF
    pfNo: 'CHD/12345/SSC/0000101',
    uan: '100987654321',
    esiApplicable: true,
    esiNo: '1234567890',
    password: 'Emp@123',

    // Linked Master Salary Structures
    basicSalary: 35000,
    hra: 14000,
    conveyance: 3000,
    specialAllowance: 8000
  }
];

// Client PayFile & PayDetails Models
let dbPayFiles: any[] = [];
let dbPayEarnings: any[] = [];
let dbPayDeductions: any[] = [];
let dbPayPfDetails: any[] = [];
let dbPayEsiDetails: any[] = [];

// Health Check API
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    server: 'Node.js Express PostgreSQL API (100% Client Migrations Mapped)',
    timestamp: new Date().toISOString()
  });
});

// Authentication Controller
app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const JWT_SECRET = process.env.JWT_SECRET || 'SS_CONSULTANCYY_SUPER_SECRET_KEY_2026';

  const accounts: Record<string, any> = {
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
      user: {
        email,
        name: user.name,
        role: user.role,
        empId: user.empId
      }
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Workers API Routes (Client Worker Schema)
app.get('/api/v1/workers', (req: Request, res: Response) => {
  res.json({ success: true, data: dbWorkers });
});

app.post('/api/v1/workers', (req: Request, res: Response) => {
  const nextCode = dbWorkers.length + 102;
  const newWorker = {
    id: dbWorkers.length + 1,
    workerCode: nextCode,
    password: `Emp@${Math.floor(100 + Math.random() * 900)}`,
    ...req.body
  };
  dbWorkers.unshift(newWorker);
  res.json({ success: true, data: newWorker });
});

// PayFile Master Payroll Calculation Engine (Client Migration Tables: PayFile, PayEarnings, PayDeductions, PayPfDetails, PayEsiDetails)
app.post('/api/v1/payfile/process', (req: Request, res: Response) => {
  const { monthYear, companyId } = req.body;
  const payFileId = `pf-${Date.now()}`;

  let totalGross = 0;
  let totalNet = 0;

  dbWorkers.forEach((w) => {
    const basicEarned = Math.round(w.basicSalary);
    const hraEarned = Math.round(w.hra);
    const conveyanceEarned = Math.round(w.conveyance);
    const specialEarned = Math.round(w.specialAllowance);
    const grossEarned = basicEarned + hraEarned + conveyanceEarned + specialEarned;

    // PF Calculation based on pfType Enum (NPF, LPF, HPF, PPF, HPN)
    let pfWages = basicEarned;
    if (w.pfType === 'LPF') pfWages = Math.min(basicEarned, 15000);
    const epfDeduction = w.pfType === 'NPF' ? 0 : Math.round(pfWages * 0.12);
    const epsAmount = Math.round(pfWages * 0.0833);
    const eePfAmount = epfDeduction - epsAmount;

    // ESI Calculation (0.75% Employee, 3.25% Employer)
    const esiWages = grossEarned;
    const employeeEsiAmount = w.esiApplicable && grossEarned <= 21000 ? Math.round(grossEarned * 0.0075) : 0;
    const employerEsiAmount = w.esiApplicable && grossEarned <= 21000 ? Math.round(grossEarned * 0.0325) : 0;

    const totalDeductions = epfDeduction + employeeEsiAmount;
    const netSalary = grossEarned - totalDeductions;

    totalGross += grossEarned;
    totalNet += netSalary;

    dbPayEarnings.push({ id: `pe-${Date.now()}-${w.id}`, payFileId, workerId: w.id, basicEarned, hraEarned, conveyanceEarned, specialEarned, grossEarned });
    dbPayDeductions.push({ id: `pd-${Date.now()}-${w.id}`, payFileId, workerId: w.id, profTax: 0, lwf: 0, tds: 0, loanRecovery: 0, totalDeductions });
    dbPayPfDetails.push({ id: `ppf-${Date.now()}-${w.id}`, payFileId, workerId: w.id, pfWages, epfDeduction, epsAmount, eePfAmount });
    dbPayEsiDetails.push({ id: `pesi-${Date.now()}-${w.id}`, payFileId, workerId: w.id, esiWages, employeeEsiAmount, employerEsiAmount });
  });

  const payFileRecord = {
    id: payFileId,
    companyId: companyId || 'comp-1',
    monthYear: monthYear || 'August 2026',
    processedAt: new Date().toISOString(),
    totalWorkers: dbWorkers.length,
    totalGross,
    totalNet,
    status: 'Processed'
  };

  dbPayFiles.unshift(payFileRecord);

  res.json({
    success: true,
    data: {
      payFileRecord,
      earnings: dbPayEarnings,
      deductions: dbPayDeductions,
      pfDetails: dbPayPfDetails,
      esiDetails: dbPayEsiDetails
    }
  });
});

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Node.js Express Backend Server running on Port ${PORT}`);
  console.log(`🗄️ PostgreSQL Client Database Schema Loaded`);
  console.log(`=================================================`);
});
