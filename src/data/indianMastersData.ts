export interface IndianState {
  id: number;
  name: string;
  code: string;
}

export interface IndianCity {
  id: number;
  stateId: number;
  name: string;
}

export interface StatutoryOffice {
  id: string;
  stateId: number;
  name: string;
  type: 'PF' | 'ESI';
  city: string;
  code: string;
}

export interface IndustryType {
  id: string;
  name: string;
  type: 'Regular' | 'Seasonal';
}

// Complete 28 States & 8 Union Territories
export const INDIAN_STATES: IndianState[] = [
  { id: 1, name: 'Andhra Pradesh', code: 'AP' },
  { id: 2, name: 'Arunachal Pradesh', code: 'AR' },
  { id: 3, name: 'Assam', code: 'AS' },
  { id: 4, name: 'Bihar', code: 'BR' },
  { id: 5, name: 'Chhattisgarh', code: 'CG' },
  { id: 6, name: 'Goa', code: 'GA' },
  { id: 7, name: 'Gujarat', code: 'GJ' },
  { id: 8, name: 'Haryana', code: 'HR' },
  { id: 9, name: 'Himachal Pradesh', code: 'HP' },
  { id: 10, name: 'Jharkhand', code: 'JH' },
  { id: 11, name: 'Karnataka', code: 'KA' },
  { id: 12, name: 'Kerala', code: 'KL' },
  { id: 13, name: 'Madhya Pradesh', code: 'MP' },
  { id: 14, name: 'Maharashtra', code: 'MH' },
  { id: 15, name: 'Manipur', code: 'MN' },
  { id: 16, name: 'Meghalaya', code: 'ML' },
  { id: 17, name: 'Mizoram', code: 'MZ' },
  { id: 18, name: 'Nagaland', code: 'NL' },
  { id: 19, name: 'Odisha', code: 'OR' },
  { id: 20, name: 'Punjab', code: 'PB' },
  { id: 21, name: 'Rajasthan', code: 'RJ' },
  { id: 22, name: 'Sikkim', code: 'SK' },
  { id: 23, name: 'Tamil Nadu', code: 'TN' },
  { id: 24, name: 'Telangana', code: 'TG' },
  { id: 25, name: 'Tripura', code: 'TR' },
  { id: 26, name: 'Uttar Pradesh', code: 'UP' },
  { id: 27, name: 'Uttarakhand', code: 'UK' },
  { id: 28, name: 'West Bengal', code: 'WB' },
  
  // Union Territories
  { id: 30, name: 'Chandigarh', code: 'CH' },
  { id: 31, name: 'Dadra & Nagar Haveli and Daman & Diu', code: 'DN' },
  { id: 32, name: 'Delhi (NCT)', code: 'DL' },
  { id: 33, name: 'Jammu and Kashmir', code: 'JK' },
  { id: 34, name: 'Ladakh', code: 'LA' },
  { id: 35, name: 'Puducherry', code: 'PY' },
  { id: 36, name: 'Andaman & Nicobar Islands', code: 'AN' },
  { id: 37, name: 'Lakshadweep', code: 'LD' },
];

export const INDIAN_CITIES: IndianCity[] = [
  // Andhra Pradesh (1)
  { id: 101, stateId: 1, name: 'Visakhapatnam' },
  { id: 102, stateId: 1, name: 'Vijayawada' },
  { id: 103, stateId: 1, name: 'Guntur' },
  { id: 104, stateId: 1, name: 'Tirupati' },
  { id: 105, stateId: 1, name: 'Nellore' },
  { id: 106, stateId: 1, name: 'Kakinada' },

  // Arunachal Pradesh (2)
  { id: 201, stateId: 2, name: 'Itanagar' },
  { id: 202, stateId: 2, name: 'Naharlagun' },
  { id: 203, stateId: 2, name: 'Pasighat' },

  // Assam (3)
  { id: 301, stateId: 3, name: 'Guwahati' },
  { id: 302, stateId: 3, name: 'Silchar' },
  { id: 303, stateId: 3, name: 'Dibrugarh' },
  { id: 304, stateId: 3, name: 'Jorhat' },

  // Bihar (4)
  { id: 401, stateId: 4, name: 'Patna' },
  { id: 402, stateId: 4, name: 'Gaya' },
  { id: 403, stateId: 4, name: 'Bhagalpur' },
  { id: 404, stateId: 4, name: 'Muzaffarpur' },

  // Chhattisgarh (5)
  { id: 501, stateId: 5, name: 'Raipur' },
  { id: 502, stateId: 5, name: 'Bilaspur' },
  { id: 503, stateId: 5, name: 'Durg' },
  { id: 504, stateId: 5, name: 'Bhilai' },
  { id: 505, stateId: 5, name: 'Korba' },

  // Goa (6)
  { id: 601, stateId: 6, name: 'Panaji' },
  { id: 602, stateId: 6, name: 'Margao' },
  { id: 603, stateId: 6, name: 'Vasco da Gama' },

  // Gujarat (7)
  { id: 701, stateId: 7, name: 'Ahmedabad' },
  { id: 702, stateId: 7, name: 'Surat' },
  { id: 703, stateId: 7, name: 'Vadodara' },
  { id: 704, stateId: 7, name: 'Rajkot' },
  { id: 705, stateId: 7, name: 'Bhavnagar' },
  { id: 706, stateId: 7, name: 'Gandhinagar' },
  { id: 707, stateId: 7, name: 'Jamnagar' },

  // Haryana (8)
  { id: 801, stateId: 8, name: 'Gurgaon (Gurugram)' },
  { id: 802, stateId: 8, name: 'Faridabad' },
  { id: 803, stateId: 8, name: 'Panipat' },
  { id: 804, stateId: 8, name: 'Panchkula' },
  { id: 805, stateId: 8, name: 'Ambala' },
  { id: 806, stateId: 8, name: 'Karnal' },
  { id: 807, stateId: 8, name: 'Hisar' },
  { id: 808, stateId: 8, name: 'Rohtak' },
  { id: 809, stateId: 8, name: 'Sonipat' },
  { id: 810, stateId: 8, name: 'Rewari' },

  // Himachal Pradesh (9)
  { id: 901, stateId: 9, name: 'Shimla' },
  { id: 902, stateId: 9, name: 'Manali' },
  { id: 903, stateId: 9, name: 'Dharamshala' },
  { id: 904, stateId: 9, name: 'Una' },
  { id: 905, stateId: 9, name: 'Hamirpur' },
  { id: 906, stateId: 9, name: 'Baddi' },
  { id: 907, stateId: 9, name: 'Solan' },
  { id: 908, stateId: 9, name: 'Mandi' },
  { id: 909, stateId: 9, name: 'Kullu' },
  { id: 910, stateId: 9, name: 'Nahan' },

  // Jharkhand (10)
  { id: 1001, stateId: 10, name: 'Ranchi' },
  { id: 1002, stateId: 10, name: 'Jamshedpur' },
  { id: 1003, stateId: 10, name: 'Dhanbad' },
  { id: 1004, stateId: 10, name: 'Bokaro' },

  // Karnataka (11)
  { id: 1101, stateId: 11, name: 'Bengaluru (Bangalore)' },
  { id: 1102, stateId: 11, name: 'Mysuru (Mysore)' },
  { id: 1103, stateId: 11, name: 'Mangaluru (Mangalore)' },
  { id: 1104, stateId: 11, name: 'Hubballi-Dharwad' },
  { id: 1105, stateId: 11, name: 'Belagavi' },

  // Kerala (12)
  { id: 1201, stateId: 12, name: 'Thiruvananthapuram' },
  { id: 1202, stateId: 12, name: 'Kochi (Cochin)' },
  { id: 1203, stateId: 12, name: 'Kozhikode (Calicut)' },
  { id: 1204, stateId: 12, name: 'Thrissur' },

  // Madhya Pradesh (13)
  { id: 1301, stateId: 13, name: 'Bhopal' },
  { id: 1302, stateId: 13, name: 'Indore' },
  { id: 1303, stateId: 13, name: 'Jabalpur' },
  { id: 1304, stateId: 13, name: 'Gwalior' },
  { id: 1305, stateId: 13, name: 'Ujjain' },

  // Maharashtra (14)
  { id: 1401, stateId: 14, name: 'Mumbai' },
  { id: 1402, stateId: 14, name: 'Pune' },
  { id: 1403, stateId: 14, name: 'Nagpur' },
  { id: 1404, stateId: 14, name: 'Thane' },
  { id: 1405, stateId: 14, name: 'Nashik' },
  { id: 1406, stateId: 14, name: 'Aurangabad (Chhatrapati Sambhajinagar)' },
  { id: 1407, stateId: 14, name: 'Navi Mumbai' },

  // Manipur, Meghalaya, Mizoram, Nagaland (15-18)
  { id: 1501, stateId: 15, name: 'Imphal' },
  { id: 1601, stateId: 16, name: 'Shillong' },
  { id: 1701, stateId: 17, name: 'Aizawl' },
  { id: 1801, stateId: 18, name: 'Kohima' },
  { id: 1802, stateId: 18, name: 'Dimapur' },

  // Odisha (19)
  { id: 1901, stateId: 19, name: 'Bhubaneswar' },
  { id: 1902, stateId: 19, name: 'Cuttack' },
  { id: 1903, stateId: 19, name: 'Rourkela' },

  // Punjab (20)
  { id: 2001, stateId: 20, name: 'Ludhiana' },
  { id: 2002, stateId: 20, name: 'Amritsar' },
  { id: 2003, stateId: 20, name: 'Jalandhar' },
  { id: 2004, stateId: 20, name: 'SBS Nagar (Nawanshahr)' },
  { id: 2005, stateId: 20, name: 'SAS Nagar (Mohali)' },
  { id: 2006, stateId: 20, name: 'Roop Nagar (Ropar)' },
  { id: 2007, stateId: 20, name: 'Hoshiarpur' },
  { id: 2008, stateId: 20, name: 'Patiala' },
  { id: 2009, stateId: 20, name: 'Bathinda' },
  { id: 2010, stateId: 20, name: 'Pathankot' },
  { id: 2011, stateId: 20, name: 'Phagwara' },
  { id: 2012, stateId: 20, name: 'Batala' },

  // Rajasthan (21)
  { id: 2101, stateId: 21, name: 'Jaipur' },
  { id: 2102, stateId: 21, name: 'Udaipur' },
  { id: 2103, stateId: 21, name: 'Jodhpur' },
  { id: 2104, stateId: 21, name: 'Kota' },
  { id: 2105, stateId: 21, name: 'Bikaner' },
  { id: 2106, stateId: 21, name: 'Ajmer' },
  { id: 2107, stateId: 21, name: 'Bhiwadi' },

  // Sikkim, Tamil Nadu, Telangana, Tripura (22-25)
  { id: 2201, stateId: 22, name: 'Gangtok' },
  { id: 2301, stateId: 23, name: 'Chennai' },
  { id: 2302, stateId: 23, name: 'Coimbatore' },
  { id: 2303, stateId: 23, name: 'Madurai' },
  { id: 2401, stateId: 24, name: 'Hyderabad' },
  { id: 2402, stateId: 24, name: 'Warangal' },
  { id: 2501, stateId: 25, name: 'Agartala' },

  // Uttar Pradesh (26)
  { id: 2601, stateId: 26, name: 'Lucknow' },
  { id: 2602, stateId: 26, name: 'Kanpur' },
  { id: 2603, stateId: 26, name: 'Varanasi' },
  { id: 2604, stateId: 26, name: 'Noida' },
  { id: 2605, stateId: 26, name: 'Greater Noida' },
  { id: 2606, stateId: 26, name: 'Ghaziabad' },
  { id: 2607, stateId: 26, name: 'Agra' },
  { id: 2608, stateId: 26, name: 'Meerut' },
  { id: 2609, stateId: 26, name: 'Prayagraj (Allahabad)' },

  // Uttarakhand (27)
  { id: 2701, stateId: 27, name: 'Dehradun' },
  { id: 2702, stateId: 27, name: 'Haridwar' },
  { id: 2703, stateId: 27, name: 'Roorkee' },
  { id: 2704, stateId: 27, name: 'Haldwani' },
  { id: 2705, stateId: 27, name: 'Rudrapur' },

  // West Bengal (28)
  { id: 2801, stateId: 28, name: 'Kolkata' },
  { id: 2802, stateId: 28, name: 'Howrah' },
  { id: 2803, stateId: 28, name: 'Siliguri' },
  { id: 2804, stateId: 28, name: 'Durgapur' },
  { id: 2805, stateId: 28, name: 'Asansol' },

  // Chandigarh UT (30)
  { id: 3001, stateId: 30, name: 'Chandigarh (Sector 1 to 63)' },
  { id: 3002, stateId: 30, name: 'Industrial Area Phase 1' },
  { id: 3003, stateId: 30, name: 'Industrial Area Phase 2' },
  { id: 3004, stateId: 30, name: 'IT Park Chandigarh' },

  // Delhi NCT (32)
  { id: 3201, stateId: 32, name: 'New Delhi' },
  { id: 3202, stateId: 32, name: 'Dwarka' },
  { id: 3203, stateId: 32, name: 'Rohini' },
  { id: 3204, stateId: 32, name: 'Connaught Place' },
  { id: 3205, stateId: 32, name: 'Okhla Industrial Area' },
  { id: 3206, stateId: 32, name: 'Mayapuri' },
  { id: 3207, stateId: 32, name: 'Lajpat Nagar' },

  // Jammu & Kashmir (33)
  { id: 3301, stateId: 33, name: 'Srinagar' },
  { id: 3302, stateId: 33, name: 'Jammu' },
  { id: 3303, stateId: 33, name: 'Anantnag' },
  { id: 3304, stateId: 33, name: 'Baramulla' },
  { id: 3305, stateId: 33, name: 'Udhampur' },

  // UTs (31, 34-37)
  { id: 3101, stateId: 31, name: 'Daman' },
  { id: 3102, stateId: 31, name: 'Diu' },
  { id: 3103, stateId: 31, name: 'Silvassa' },
  { id: 3401, stateId: 34, name: 'Leh' },
  { id: 3402, stateId: 34, name: 'Kargil' },
  { id: 3501, stateId: 35, name: 'Puducherry' },
  { id: 3601, stateId: 36, name: 'Port Blair' },
  { id: 3701, stateId: 37, name: 'Kavaratti' },
];

export const STATUTORY_OFFICES: StatutoryOffice[] = [
  { id: 'pf-1', stateId: 30, name: 'Regional PF Office Chandigarh', type: 'PF', city: 'Chandigarh', code: 'CHD/RO/01' },
  { id: 'pf-2', stateId: 20, name: 'Sub-Regional PF Office Ludhiana', type: 'PF', city: 'Ludhiana', code: 'PBR/SRO/02' },
  { id: 'pf-3', stateId: 8, name: 'Regional PF Office Gurgaon', type: 'PF', city: 'Gurgaon', code: 'HR/RO/05' },
  { id: 'esi-1', stateId: 30, name: 'ESIC Regional Office Sector 19', type: 'ESI', city: 'Chandigarh', code: 'ESI-CHD-19' },
  { id: 'esi-2', stateId: 20, name: 'ESIC Sub-Regional Office Focal Point', type: 'ESI', city: 'Ludhiana', code: 'ESI-LDH-04' },
  { id: 'esi-3', stateId: 8, name: 'ESIC Regional Office Udyog Vihar', type: 'ESI', city: 'Gurgaon', code: 'ESI-GGN-08' },
];

export const INDUSTRY_MASTERS: IndustryType[] = [
  { id: 'ind-1', name: 'Textile Manufacturing', type: 'Regular' },
  { id: 'ind-2', name: 'Food Processing', type: 'Regular' },
  { id: 'ind-3', name: 'Automobile Manufacturing', type: 'Regular' },
  { id: 'ind-4', name: 'Information Technology', type: 'Regular' },
  { id: 'ind-5', name: 'Pharmaceuticals', type: 'Regular' },
  { id: 'ind-6', name: 'Banking & Finance', type: 'Regular' },
  { id: 'ind-7', name: 'Healthcare Services', type: 'Regular' },
  { id: 'ind-8', name: 'Retail & Wholesale', type: 'Regular' },
  { id: 'ind-9', name: 'Logistics & Transport', type: 'Regular' },
  { id: 'ind-10', name: 'Education Services', type: 'Regular' },
  { id: 'ind-11', name: 'Real Estate & Construction', type: 'Regular' },
  { id: 'ind-12', name: 'Steel and Iron Industry', type: 'Regular' },
  { id: 'ind-13', name: 'Telecommunications', type: 'Regular' },
  { id: 'ind-14', name: 'Chemical Industry', type: 'Regular' },
  { id: 'ind-15', name: 'Power and Energy', type: 'Regular' },

  // Seasonal Industries
  { id: 'ind-16', name: 'Sugarcane Processing', type: 'Seasonal' },
  { id: 'ind-17', name: 'Tea Plantation', type: 'Seasonal' },
  { id: 'ind-18', name: 'Textile Dyeing Units', type: 'Seasonal' },
  { id: 'ind-19', name: 'Fruit Canning/Processing', type: 'Seasonal' },
  { id: 'ind-20', name: 'Tourism & Hospitality (Hill Stations)', type: 'Seasonal' },
  { id: 'ind-21', name: 'Agricultural Equipment Services', type: 'Seasonal' },
  { id: 'ind-22', name: 'Firecracker Industry', type: 'Seasonal' },
  { id: 'ind-23', name: 'Brick Kiln', type: 'Seasonal' },
];
