export interface Employee {
  id: string;
  empCode: string;
  name: string;
  companyId: string;
  companyName: string;
  department: string;
  designation: string;
  phone: string;
  email: string;
  joiningDate: string;

  // ── Personal Details ───────────────────────────────────────────
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
  maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  fatherName?: string;
  motherName?: string;
  religion?: string;
  nationality?: string;

  // ── Address ───────────────────────────────────────────────────
  addressPresent?: string;
  cityPresent?: string;
  statePresent?: string;
  pinPresent?: string;
  addressPermanent?: string;
  cityPermanent?: string;
  statePermanent?: string;
  pinPermanent?: string;

  // ── Family / Nominee ──────────────────────────────────────────
  nomineeName?: string;
  nomineeRelation?: string;
  nomineeDob?: string;
  nomineeShare?: string; // percentage
  spouseName?: string;
  spouseEmployed?: boolean;

  // ── KYC — Identity Documents ──────────────────────────────────
  aadhaarNumber?: string;
  aadhaarName?: string;     // name as on aadhaar
  panNumber: string;
  panName?: string;          // name as on PAN
  passportNumber?: string;
  passportExpiry?: string;
  drivingLicense?: string;
  voterIdNumber?: string;

  // ── Bank Details ──────────────────────────────────────────────
  bankName: string;
  accountNo: string;
  ifsc: string;
  accountType?: 'Savings' | 'Current';
  bankBranch?: string;
  bankCity?: string;

  // ── Statutory Numbers ─────────────────────────────────────────
  pfNumber: string;
  uanNumber: string;
  esiNumber: string;

  // ── Salary Structure ──────────────────────────────────────────
  basicSalary: number;
  hra: number;
  conveyance: number;
  specialAllowance: number;
  salaryStructureType?: 'Individual' | 'Composite';

  status: 'Active' | 'Inactive';
  exitDate?: string;
  exitReason?: string;
  exitNote?: string;
  exitRecordedBy?: string;
  exitRecordedAt?: string;
  loginPassword?: string;
}

export interface Company {
  id: string;
  name: string;
  code: string;
  companyType?: string;
  industry?: string;
  industryType?: string;
  cinNumber?: string;
  gstin?: string;
  panNumber?: string;
  tanNumber?: string;
  pfCode: string;
  esiCode: string;
  lwfCode?: string;
  ptCode?: string;
  registeredAddress?: string;
  pincode?: string;
  branchesCount: number;
  employeeCount: number;
  contactPerson: string;
  contactDesignation?: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  bankName?: string;
  bankAccountNo?: string;
  ifscCode?: string;
  bankBranch?: string;
}


export interface AttendanceRecord {
  id: string;
  empId: string;
  empName: string;
  date: string;
  inTime: string;
  outTime: string;
  status: 'Present' | 'Absent' | 'Half Day' | 'Leave';
  overtimeHours: number;
  source: 'Manual' | 'Excel' | 'Biometric';
}

export interface PayrollRecord {
  id: string;
  empId: string;
  empName: string;
  companyName: string;
  month: string;
  workingDays: number;
  presentDays: number;
  basicEarned: number;
  hraEarned: number;
  conveyanceEarned: number;
  specialEarned: number;
  overtimePay: number;
  arrears: number;
  grossSalary: number;
  pfDeduction: number;
  esiDeduction: number;
  tdsDeduction: number;
  loanDeduction: number;
  totalDeductions: number;
  netSalary: number;
  status: 'Calculated' | 'Approved' | 'Paid';
}

export interface GlobalParameter {
  pfEmployeeRate: number;
  pfEmployerRate: number;
  pfCapLimit: number;
  esiEmployeeRate: number;
  esiEmployerRate: number;
  esiCapLimit: number;
}

export interface LeaveRequest {
  id: string;
  empId?: string;
  empName: string;
  leaveType: 'Casual' | 'Sick' | 'Earned';
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
  approvedAt?: string;
  approvalRemarks?: string;
}

export interface AssetRecord {
  id: string;
  assetName: string;
  category: string;
  serialNumber: string;
  assignedTo: string;
  allocatedDate: string;
  status: 'Allocated' | 'Available' | 'Under Maintenance';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  details: string;
  ipAddress: string;
}
