import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token and language to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add language preference
  const language = localStorage.getItem('language') || 'en';
  config.params = { ...config.params, lang: language };
  config.headers['x-language'] = language;
  
  return config;
});

// Auth API
export const authAPI = {
  register: (userData: { email: string; password: string; name: string; role: 'BORROWER' | 'LENDER' }) =>
    api.post('/auth/register', userData),
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  switchRole: () => api.post('/auth/switch-role'),
};

// Loans API
export const loansAPI = {
  createLoan: (loanData: { amount: number; purpose: string; repaymentTerm: number }) =>
    api.post('/loans', loanData),
  getAllLoans: () => api.get('/loans'),
  getLoanById: (id: string) => api.get(`/loans/${id}`),
  fundLoan: (id: string, amount: number) => api.post(`/loans/${id}/fund`, { amount }),
};

// Dashboard API
export const dashboardAPI = {
  getMyLoans: () => api.get('/dashboard/my-loans'),
  getMyInvestments: () => api.get('/dashboard/my-investments'),
  getStats: () => api.get('/dashboard/stats'),
};

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'BORROWER' | 'LENDER';
  creditScore?: number;
  trustScore?: number;
}

export interface Loan {
  id: string;
  amount: number;
  purpose: string;
  repaymentTerm: number;
  currentFunding: number;
  status: 'PENDING' | 'FUNDING' | 'FUNDED' | 'REPAID';
  interestRate: number; // Dynamic interest rate between 7-12%
  collateralRequired: boolean; // Whether collateral is required
  collateralType?: string; // Type of collateral if required
  collateralValue?: number; // Value of collateral if provided
  borrower: {
    id: string;
    name: string;
    trustScore: number;
    creditScore?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Investment {
  id: string;
  amount: number;
  loan: Loan;
  createdAt: string;
  returns: number;
}

// Function to generate randomized interest rates between 7-12%
const generateInterestRate = (): number => {
  return Math.round((Math.random() * 5 + 7) * 100) / 100; // 7.00 to 12.00
};

// Function to generate collateral data
const generateCollateralData = () => {
  const collateralTypes = [
    'Property', 'Vehicle', 'Gold', 'Fixed Deposit', 'Stocks', 'Business Assets', 
    'Agricultural Land', 'Equipment', 'Jewelry', 'Government Bonds'
  ];
  
  const requiresCollateral = Math.random() > 0.3; // 70% chance of requiring collateral
  
  if (!requiresCollateral) {
    return {
      collateralRequired: false
    };
  }
  
  const collateralType = collateralTypes[Math.floor(Math.random() * collateralTypes.length)];
  const collateralValue = Math.floor(Math.random() * 500000) + 50000; // 50k to 550k
  
  return {
    collateralRequired: true,
    collateralType,
    collateralValue
  };
};

// Indian rural names for borrowers and lenders
const indianRuralBorrowers = [
  'राम सिंह', 'सीता देवी', 'कृष्ण कुमार', 'गीता शर्मा', 'अजय पटेल',
  'मीना यादव', 'सुरेश गुप्ता', 'कविता सिंह', 'विक्रम जैन', 'पूजा अग्रवाल',
  'राजेश कुमार', 'सुनीता शर्मा', 'अमित सिंह', 'राधा देवी', 'संजय पटेल',
  'किरण यादव', 'मोहन गुप्ता', 'रानी सिंह', 'विनोद जैन', 'सरोज अग्रवाल'
];

const indianRuralLenders = [
  'लक्ष्मी देवी', 'हरि प्रसाद', 'कमला सिंह', 'राम प्रसाद', 'सुशीला देवी',
  'गोपाल यादव', 'माया शर्मा', 'बलराम सिंह', 'सावित्री देवी', 'किशन लाल',
  'रामकली देवी', 'शंकर प्रसाद', 'गंगा देवी', 'भोला सिंह', 'रामप्यारी देवी',
  'महेश यादव', 'सरस्वती देवी', 'रामनाथ सिंह', 'गीता देवी', 'कृष्ण कुमार'
];

// Dummy data for development/demo
export const dummyLoans: Loan[] = [
  {
    id: '1',
    amount: 50000,
    purpose: 'Small Business Expansion',
    repaymentTerm: 12,
    currentFunding: 25000,
    status: 'FUNDING',
    interestRate: generateInterestRate(),
    ...generateCollateralData(),
    borrower: { id: 'b1', name: indianRuralBorrowers[0], trustScore: 85, creditScore: 780 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    amount: 30000,
    purpose: 'Emergency Medical Bills',
    repaymentTerm: 6,
    currentFunding: 0,
    status: 'PENDING',
    interestRate: generateInterestRate(),
    ...generateCollateralData(),
    borrower: { id: 'b2', name: indianRuralBorrowers[1], trustScore: 72, creditScore: 650 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    amount: 80000,
    purpose: 'Education & Training',
    repaymentTerm: 24,
    currentFunding: 80000,
    status: 'FUNDED',
    interestRate: generateInterestRate(),
    ...generateCollateralData(),
    borrower: { id: 'b3', name: indianRuralBorrowers[2], trustScore: 91, creditScore: 820 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    amount: 25000,
    purpose: 'Agricultural Equipment',
    repaymentTerm: 8,
    currentFunding: 15000,
    status: 'FUNDING',
    interestRate: generateInterestRate(),
    ...generateCollateralData(),
    borrower: { id: 'b4', name: indianRuralBorrowers[3], trustScore: 78, creditScore: 720 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    amount: 40000,
    purpose: 'Home Renovation',
    repaymentTerm: 18,
    currentFunding: 0,
    status: 'PENDING',
    interestRate: generateInterestRate(),
    ...generateCollateralData(),
    borrower: { id: 'b5', name: indianRuralBorrowers[4], trustScore: 88, creditScore: 790 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    amount: 60000,
    purpose: 'Wedding Expenses',
    repaymentTerm: 12,
    currentFunding: 60000,
    status: 'FUNDED',
    interestRate: generateInterestRate(),
    ...generateCollateralData(),
    borrower: { id: 'b6', name: indianRuralBorrowers[5], trustScore: 82, creditScore: 750 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    amount: 35000,
    purpose: 'Vehicle Purchase',
    repaymentTerm: 15,
    currentFunding: 20000,
    status: 'FUNDING',
    interestRate: generateInterestRate(),
    ...generateCollateralData(),
    borrower: { id: 'b7', name: indianRuralBorrowers[6], trustScore: 75, creditScore: 680 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    amount: 20000,
    purpose: 'Debt Consolidation',
    repaymentTerm: 10,
    currentFunding: 0,
    status: 'PENDING',
    interestRate: generateInterestRate(),
    ...generateCollateralData(),
    borrower: { id: 'b8', name: indianRuralBorrowers[7], trustScore: 70, creditScore: 640 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '9',
    amount: 45000,
    purpose: 'Starting a New Business',
    repaymentTerm: 20,
    currentFunding: 45000,
    status: 'FUNDED',
    interestRate: generateInterestRate(),
    ...generateCollateralData(),
    borrower: { id: 'b9', name: indianRuralBorrowers[8], trustScore: 90, creditScore: 810 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '10',
    amount: 30000,
    purpose: 'Educational Course Fees',
    repaymentTerm: 12,
    currentFunding: 18000,
    status: 'FUNDING',
    interestRate: generateInterestRate(),
    ...generateCollateralData(),
    borrower: { id: 'b10', name: indianRuralBorrowers[9], trustScore: 83, creditScore: 760 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '11',
    amount: 55000,
    purpose: 'Home Repair after Natural Disaster',
    repaymentTerm: 14,
    currentFunding: 0,
    status: 'PENDING',
    interestRate: generateInterestRate(),
    ...generateCollateralData(),
    borrower: { id: 'b11', name: indianRuralBorrowers[10], trustScore: 86, creditScore: 770 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '12',
    amount: 25000,
    purpose: 'Technology Upgrade for Business',
    repaymentTerm: 8,
    currentFunding: 25000,
    status: 'FUNDED',
    interestRate: generateInterestRate(),
    ...generateCollateralData(),
    borrower: { id: 'b12', name: indianRuralBorrowers[11], trustScore: 79, creditScore: 730 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '13',
    amount: 40000,
    purpose: 'Home Appliance Purchase',
    repaymentTerm: 16,
    currentFunding: 25000,
    status: 'FUNDING',
    interestRate: generateInterestRate(),
    ...generateCollateralData(),
    borrower: { id: 'b13', name: indianRuralBorrowers[12], trustScore: 81, creditScore: 740 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '14',
    amount: 35000,
    purpose: 'Travel for Family Emergency',
    repaymentTerm: 6,
    currentFunding: 0,
    status: 'PENDING',
    interestRate: generateInterestRate(),
    ...generateCollateralData(),
    borrower: { id: 'b14', name: indianRuralBorrowers[13], trustScore: 77, creditScore: 710 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '15',
    amount: 50000,
    purpose: 'Emergency Fund',
    repaymentTerm: 12,
    currentFunding: 50000,
    status: 'FUNDED',
    interestRate: generateInterestRate(),
    ...generateCollateralData(),
    borrower: { id: 'b15', name: indianRuralBorrowers[14], trustScore: 87, creditScore: 780 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '16',
    amount: 30000,
    purpose: 'Medical Emergency Treatment',
    repaymentTerm: 9,
    currentFunding: 15000,
    status: 'FUNDING',
    interestRate: generateInterestRate(),
    ...generateCollateralData(),
    borrower: { id: 'b16', name: indianRuralBorrowers[15], trustScore: 84, creditScore: 760 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '17',
    amount: 25000,
    purpose: 'Education Expenses for Child',
    repaymentTerm: 18,
    currentFunding: 0,
    status: 'PENDING',
    interestRate: generateInterestRate(),
    ...generateCollateralData(),
    borrower: { id: 'b17', name: indianRuralBorrowers[16], trustScore: 80, creditScore: 750 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '18',
    amount: 40000,
    purpose: 'Small Business Expansion',
    repaymentTerm: 15,
    currentFunding: 40000,
    status: 'FUNDED',
    interestRate: generateInterestRate(),
    ...generateCollateralData(),
    borrower: { id: 'b18', name: indianRuralBorrowers[17], trustScore: 89, creditScore: 800 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '19',
    amount: 35000,
    purpose: 'Agricultural Equipment',
    repaymentTerm: 10,
    currentFunding: 20000,
    status: 'FUNDING',
    interestRate: generateInterestRate(),
    ...generateCollateralData(),
    borrower: { id: 'b19', name: indianRuralBorrowers[18], trustScore: 76, creditScore: 700 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '20',
    amount: 45000,
    purpose: 'Home Renovation Project',
    repaymentTerm: 20,
    currentFunding: 0,
    status: 'PENDING',
    interestRate: generateInterestRate(),
    ...generateCollateralData(),
    borrower: { id: 'b20', name: indianRuralBorrowers[19], trustScore: 85, creditScore: 770 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export default api;
