import { Company, Employee, AttendanceRecord, LeaveRequest, AssetRecord, AuditLog, GlobalParameter } from '@/types/hrms';

export const initialCompanies: Company[] = [
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
    state: 'Chandigarh (UT)'
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
    name: 'Vanguard Logistics Solutions',
    code: 'VLS003',
    pfCode: 'HR/45678/VLS',
    esiCode: '456789123456789',
    branchesCount: 2,
    employeeCount: 68,
    contactPerson: 'Priya Sundaram',
    phone: '9765432109',
    email: 'ops@vanguardlogistics.in',
    city: 'Gurugram',
    state: 'Haryana'
  }
];

export const initialEmployees: Employee[] = [
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
    empCode: 'SSC-102',
    name: 'Ananya Verma',
    companyId: 'comp-1',
    companyName: 'SS Consultancy Services',
    department: 'Payroll & HR',
    designation: 'Payroll Manager',
    phone: '9811223344',
    email: 'ananya.v@sscchd.in',
    joiningDate: '2023-04-01',
    bankName: 'ICICI Bank',
    accountNo: '001105001234',
    ifsc: 'ICIC0000011',
    pfNumber: 'CHD/12345/SSC/0000102',
    uanNumber: '100987654322',
    esiNumber: '1234567891',
    panNumber: 'BGHYT9876K',
    basicSalary: 28000,
    hra: 11200,
    conveyance: 2500,
    specialAllowance: 5000,
    status: 'Active',
    loginPassword: 'Emp@102'
  },
  {
    id: 'emp-103',
    empCode: 'APX-201',
    name: 'Gurpreet Singh',
    companyId: 'comp-2',
    companyName: 'Apex Industrial Tech Ltd',
    department: 'Manufacturing',
    designation: 'Plant Engineer',
    phone: '9877112233',
    email: 'gurpreet@apextech.com',
    joiningDate: '2022-08-10',
    bankName: 'State Bank of India',
    accountNo: '30987654321',
    ifsc: 'SBIN0000456',
    pfNumber: 'PBR/98765/APX/0000201',
    uanNumber: '100987654323',
    esiNumber: '9876543210',
    panNumber: 'CPKSG1122M',
    basicSalary: 18000,
    hra: 7200,
    conveyance: 1600,
    specialAllowance: 3200,
    status: 'Active',
    loginPassword: 'Emp@103'
  }
];

export const initialAttendance: AttendanceRecord[] = [
  {
    id: 'att-1',
    empId: 'emp-101',
    empName: 'Rohan Sharma',
    date: '2026-08-24',
    inTime: '09:15 AM',
    outTime: '06:30 PM',
    status: 'Present',
    overtimeHours: 0.5,
    source: 'Biometric'
  },
  {
    id: 'att-2',
    empId: 'emp-102',
    empName: 'Ananya Verma',
    date: '2026-08-24',
    inTime: '09:30 AM',
    outTime: '06:00 PM',
    status: 'Present',
    overtimeHours: 0,
    source: 'Manual'
  }
];

export const initialGlobalParams: GlobalParameter = {
  pfEmployeeRate: 12,
  pfEmployerRate: 12,
  pfCapLimit: 15000,
  esiEmployeeRate: 0.75,
  esiEmployerRate: 3.25,
  esiCapLimit: 21000
};

export const initialLeaves: LeaveRequest[] = [
  {
    id: 'lv-1',
    empId: 'emp-101',
    empName: 'Rohan Sharma',
    leaveType: 'Casual',
    fromDate: '2026-08-28',
    toDate: '2026-08-29',
    days: 2,
    reason: 'Family event in Chandigarh',
    status: 'Approved',
    approvedBy: 'Ananya Verma (HR Manager)',
    approvedAt: '2026-08-24 16:30 PM',
    approvalRemarks: 'Approved. Work handed over to legal team.'
  },
  {
    id: 'lv-2',
    empId: 'emp-103',
    empName: 'Gurpreet Singh',
    leaveType: 'Sick',
    fromDate: '2026-08-25',
    toDate: '2026-08-25',
    days: 1,
    reason: 'Medical Checkup',
    status: 'Pending'
  }
];

export const initialAssets: AssetRecord[] = [
  {
    id: 'ast-1',
    assetName: 'Dell Latitude 5430 Laptop',
    category: 'IT Hardware',
    serialNumber: 'DL-987123',
    assignedTo: 'Rohan Sharma',
    allocatedDate: '2023-01-16',
    status: 'Allocated'
  }
];

export const initialLogs: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-08-24 17:15:22',
    user: 'Super Admin (ss-admin)',
    role: 'Super Admin',
    action: 'Monthly Payroll Run Executed',
    details: 'Calculated payroll for SS Consultancy Services',
    ipAddress: '192.168.1.45'
  }
];
