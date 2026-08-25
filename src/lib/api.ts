import { UserAccount } from '@/data/authData';
import { Company, Employee, AttendanceRecord, PayrollRecord, LeaveRequest } from '@/types/hrms';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const api = {
  // Auth API
  login: async (email: string, pass: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      return await res.json();
    } catch (e) {
      console.error('Node Backend Offline, using fallback', e);
      return null;
    }
  },

  // Companies API
  getCompanies: async (): Promise<Company[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/companies`);
      const data = await res.json();
      return data.data;
    } catch (e) {
      return [];
    }
  },

  addCompany: async (company: Company) => {
    try {
      const res = await fetch(`${API_BASE_URL}/companies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(company)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Employees API
  getEmployees: async (): Promise<Employee[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/employees`);
      const data = await res.json();
      return data.data;
    } catch (e) {
      return [];
    }
  },

  addEmployee: async (employee: Employee) => {
    try {
      const res = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  addBulkEmployees: async (employees: Employee[]) => {
    try {
      const res = await fetch(`${API_BASE_URL}/employees/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employees)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  updateEmployee: async (employee: Employee) => {
    try {
      const res = await fetch(`${API_BASE_URL}/employees/${employee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Leaves API
  getLeaves: async (): Promise<LeaveRequest[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/leaves`);
      const data = await res.json();
      return data.data;
    } catch (e) {
      return [];
    }
  },

  approveLeave: async (id: string, approverName: string, remarks: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/leaves/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approverName, remarks })
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  rejectLeave: async (id: string, approverName: string, remarks: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/leaves/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approverName, remarks })
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  addLeaveRequest: async (leave: LeaveRequest) => {
    try {
      const res = await fetch(`${API_BASE_URL}/leaves`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leave)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Masters API
  getMasters: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/masters`);
      const data = await res.json();
      return data.data;
    } catch (e) { return []; }
  },

  // Branches API
  getBranches: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/branches`);
      const data = await res.json();
      return data.data;
    } catch (e) { return []; }
  },
  addBranch: async (branch: Record<string, unknown>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/branches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(branch)
      });
      return await res.json();
    } catch (e) { return null; }
  },

  // Salary Components API
  getSalaryComponents: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/salary-components`);
      const data = await res.json();
      return data.data;
    } catch (e) { return []; }
  },

  // Salary Revisions API
  getSalaryRevisions: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/salary-revisions`);
      const data = await res.json();
      return data.data;
    } catch (e) { return []; }
  },

  // Advances & Loans API
  getAdvances: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/advances`);
      const data = await res.json();
      return data.data;
    } catch (e) { return []; }
  },

  // Attendance Period API
  getAttendancePeriods: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/attendance-periods`);
      const data = await res.json();
      return data.data;
    } catch (e) { return []; }
  },

  // Documents API
  getDocuments: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/documents`);
      const data = await res.json();
      return data.data;
    } catch (e) { return []; }
  },

  // Subscriptions & Trial API
  getSubscription: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/subscription`);
      const data = await res.json();
      return data.data;
    } catch (e) { return null; }
  },

  // Assets API
  getAssets: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/assets`);
      const data = await res.json();
      return data.data;
    } catch (e) { return []; }
  },

  // Backups API
  getBackups: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/backups`);
      const data = await res.json();
      return data.data;
    } catch (e) { return []; }
  }
};


