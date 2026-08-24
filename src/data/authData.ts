export type UserRole = 'Super Admin' | 'Admin' | 'Company Owner' | 'Company HR' | 'Consultant' | 'Employee';

export interface HRPermissions {
  canAddEmployees: boolean;
  canViewSalary: boolean;
  canApproveLeaves: boolean;
  canRunPayroll: boolean;
}

export interface UserAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  companyName: string;
  avatar: string;
  empId?: string;
  hrPermissions?: HRPermissions;
}

export const PRESET_ACCOUNTS: UserAccount[] = [
  {
    id: 'user-1',
    email: 'superadmin@ssconsultancy.com',
    password: 'Super@123',
    name: 'S. K. Sharma (Super Admin)',
    role: 'Super Admin',
    companyName: 'SS Consultancy Services (HQ)',
    avatar: 'SS'
  },
  {
    id: 'user-2',
    email: 'admin@ssconsultancy.com',
    password: 'Admin@123',
    name: 'Rajesh Verma (Operations Admin)',
    role: 'Admin',
    companyName: 'SS Consultancy Operations',
    avatar: 'RV'
  },
  {
    id: 'user-owner',
    email: 'owner@apextech.com',
    password: 'Owner@123',
    name: 'Vikramaditya Mehta (Company Owner)',
    role: 'Company Owner',
    companyName: 'Apex Industrial Tech Ltd',
    avatar: 'VM',
    hrPermissions: {
      canAddEmployees: true,
      canViewSalary: true,
      canApproveLeaves: true,
      canRunPayroll: true
    }
  },
  {
    id: 'user-3',
    email: 'hr@apextech.com',
    password: 'Company@123',
    name: 'Ananya Verma (HR Manager)',
    role: 'Company HR',
    companyName: 'Apex Industrial Tech Ltd',
    avatar: 'AV',
    hrPermissions: {
      canAddEmployees: true,
      canViewSalary: true,
      canApproveLeaves: true,
      canRunPayroll: false
    }
  },
  {
    id: 'user-4',
    email: 'consultant@labourlaw.in',
    password: 'Consult@123',
    name: 'Advocate Vikram Singh (Law Consultant)',
    role: 'Consultant',
    companyName: 'SS Legal Compliance Wing',
    avatar: 'VS'
  },
  {
    id: 'user-5',
    email: 'employee@sscchd.in',
    password: 'Emp@123',
    name: 'Rohan Sharma (Senior Associate)',
    role: 'Employee',
    companyName: 'SS Consultancy Services',
    avatar: 'RS',
    empId: 'emp-101'
  }
];
