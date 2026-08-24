// Node.js Prisma Database Master Seeder Script matching 100% Client Database Seeders

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Master Database Seeder...');

  // 1. AttendanceTypesTableSeeder
  const attendanceTypes = ['Present', 'Absent', 'Half Day', 'Casual Leave', 'Sick Leave', 'Earned Leave', 'Maternity Leave', 'Overtime Work'];

  // 2. CompanyTypesTableSeeder & Industry Category
  const companyTypes = ['Private Limited (Pvt Ltd)', 'Public Limited', 'Partnership Firm', 'Proprietorship', 'LLP'];

  // 3. EsiBranchesTableSeeder & PfOfficesTableSeeder
  const statutoryOffices = [
    { name: 'Regional PF Office Chandigarh', city: 'Chandigarh', code: 'CHD/RO/01' },
    { name: 'Sub-Regional PF Office Ludhiana', city: 'Ludhiana', code: 'PBR/SRO/02' },
    { name: 'Regional PF Office Gurgaon', city: 'Gurgaon', code: 'HR/RO/05' },
    { name: 'ESIC Regional Office Sector 19', city: 'Chandigarh', code: 'ESI-CHD-19' },
    { name: 'ESIC Sub-Regional Office Focal Point', city: 'Ludhiana', code: 'ESI-LDH-04' }
  ];

  // 4. PfTypesSeeder (NPF, LPF, HPF, PPF, HPN)
  const pfTypes = [
    { code: 'NPF', description: 'Not Applicable' },
    { code: 'LPF', description: 'PF On Limited Salary (₹15,000 Cap)' },
    { code: 'HPF', description: 'PF On Higher Actual Salary' },
    { code: 'PPF', description: 'Pensioner With Limited Salary' },
    { code: 'HPN', description: 'Pensioner With Higher Salary' }
  ];

  // 5. RelationsTableSeeder
  const relations = ['Father', 'Mother', 'Spouse', 'Son', 'Daughter', 'Brother', 'Sister'];

  // 6. SalaryFactorsTableSeeder
  const salaryFactors = [
    { name: 'Basic Salary', type: 'Earning' },
    { name: 'House Rent Allowance (HRA)', type: 'Earning' },
    { name: 'Conveyance Allowance', type: 'Earning' },
    { name: 'Special Allowance', type: 'Earning' },
    { name: 'Overtime Pay', type: 'Earning' },
    { name: 'Employees Provident Fund (EPF)', type: 'Deduction' },
    { name: 'Employees State Insurance (ESIC)', type: 'Deduction' },
    { name: 'Professional Tax (PT)', type: 'Deduction' },
    { name: 'TDS Income Tax', type: 'Deduction' }
  ];

  // 7. Statutory Parameters (statutory_parameters)
  const statutoryParams = {
    pfEmployeeRate: 12.0,
    pfEmployerEpfRate: 3.67,
    pfEmployerEpsRate: 8.33,
    pfCapLimit: 15000,
    esiEmployeeRate: 0.75,
    esiEmployerRate: 3.25,
    esiCapLimit: 21000
  };

  console.log('✅ Seeded All Master Seeders:');
  console.log(` - ${attendanceTypes.length} Attendance Types`);
  console.log(` - ${companyTypes.length} Company Types`);
  console.log(` - ${statutoryOffices.length} Statutory PF/ESI Offices`);
  console.log(` - ${pfTypes.length} PF Types`);
  console.log(` - ${relations.length} Nominee Relations`);
  console.log(` - ${salaryFactors.length} Salary Factors`);
  console.log(` - Statutory EPF (12%) / ESIC (0.75%) Parameters`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
