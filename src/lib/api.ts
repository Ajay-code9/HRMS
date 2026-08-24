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
  }
};
