export const CURRENCIES = [
  { code: 'LKR', symbol: 'Rs.', label: 'LKR (Rs.)', name: 'Sri Lankan Rupee' },
  { code: 'USD', symbol: '$', label: 'USD ($)', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)', name: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)', name: 'British Pound' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)', name: 'Indian Rupee' },
  { code: 'AED', symbol: 'AED', label: 'AED (د.إ)', name: 'UAE Dirham' },
  { code: 'SGD', symbol: 'S$', label: 'SGD (S$)', name: 'Singapore Dollar' }
];

export const PAYMENT_MODES = [
  { id: 'LankaQR / FriMi', label: 'LankaQR / FriMi / Genie', icon: 'Smartphone' },
  { id: 'Credit Card', label: 'Credit Card', icon: 'CreditCard' },
  { id: 'Debit Card', label: 'Debit Card', icon: 'CreditCard' },
  { id: 'Cash', label: 'Cash In Hand', icon: 'Banknote' },
  { id: 'Online Banking', label: 'CEFT / Online Banking', icon: 'Landmark' },
  { id: 'Koko / MintPay', label: 'Koko / MintPay / Wallet', icon: 'Wallet' }
];

export const CATEGORIES = {
  credit: [
    { id: 'Salary', name: 'Salary / Wages', icon: 'Briefcase', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
    { id: 'Freelance', name: 'Freelance / Consulting', icon: 'Laptop', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' },
    { id: 'Business', name: 'Business Profits', icon: 'TrendingUp', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
    { id: 'Investments', name: 'Dividends / Returns', icon: 'LineChart', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' },
    { id: 'Rental', name: 'Rental Income', icon: 'Home', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)' },
    { id: 'Rewards', name: 'Cashback & Refunds', icon: 'Gift', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
    { id: 'Other Income', name: 'Other Inflow', icon: 'PlusCircle', color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.15)' }
  ],
  debit: [
    { id: 'Food', name: 'Food & Dining', icon: 'Utensils', color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)' },
    { id: 'Groceries', name: 'Keells / Cargills Groceries', icon: 'ShoppingCart', color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)' },
    { id: 'Housing', name: 'Rent & Housing', icon: 'Home', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
    { id: 'Bills', name: 'Utilities & Telecom', icon: 'Zap', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
    { id: 'Transport', name: 'Ceypetco Fuel & Commute', icon: 'Car', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)' },
    { id: 'Shopping', name: 'Shopping & Apparel', icon: 'ShoppingBag', color: '#d946ef', bg: 'rgba(217, 70, 239, 0.15)' },
    { id: 'Entertainment', name: 'Entertainment & Subs', icon: 'Film', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)' },
    { id: 'Health', name: 'Health & Pharmacy', icon: 'HeartPulse', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
    { id: 'Education', name: 'Courses & Books', icon: 'BookOpen', color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.15)' },
    { id: 'Gadgets', name: 'Electronics & Tech', icon: 'Cpu', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' },
    { id: 'Personal Care', name: 'Self Care & Gym', icon: 'Sparkles', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' },
    { id: 'Other Expense', name: 'Miscellaneous', icon: 'MinusCircle', color: '#64748b', bg: 'rgba(100, 116, 139, 0.15)' }
  ]
};

// Generate relative sample timestamps so the demo always looks fresh relative to today
const getRelativeDate = (daysAgo = 0, timeStr = '12:00') => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}T${timeStr}`;
};

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    type: 'credit',
    amount: 285000,
    category: 'Salary',
    description: 'Monthly Salary Credit (Commercial Bank)',
    paymentMode: 'Online Banking',
    timestamp: getRelativeDate(0, '09:30'),
    tags: ['salary', 'primary-income'],
    notes: 'Credited directly to savings account'
  },
  {
    id: 'tx-2',
    type: 'debit',
    amount: 3850,
    category: 'Food',
    description: 'Team Lunch at Cafe Colombo',
    paymentMode: 'LankaQR / FriMi',
    timestamp: getRelativeDate(0, '13:45'),
    tags: ['lunch', 'office'],
    notes: 'Paid via LankaQR'
  },
  {
    id: 'tx-3',
    type: 'debit',
    amount: 18200,
    category: 'Groceries',
    description: 'Keells Supermarket Weekly Restock',
    paymentMode: 'Debit Card',
    timestamp: getRelativeDate(0, '19:15'),
    tags: ['grocery', 'keells', 'essentials'],
    notes: 'Pantry provisions and fresh produce'
  },
  {
    id: 'tx-4',
    type: 'credit',
    amount: 95000,
    category: 'Freelance',
    description: 'Web Development Client Milestone',
    paymentMode: 'Online Banking',
    timestamp: getRelativeDate(1, '11:20'),
    tags: ['client', 'freelance'],
    notes: 'Received via CEFT transfer'
  },
  {
    id: 'tx-5',
    type: 'debit',
    amount: 75000,
    category: 'Housing',
    description: 'Apartment Monthly Rent (Colombo 05)',
    paymentMode: 'Online Banking',
    timestamp: getRelativeDate(1, '10:00'),
    tags: ['rent', 'fixed-expense'],
    notes: 'Paid to landlord account'
  },
  {
    id: 'tx-6',
    type: 'debit',
    amount: 8500,
    category: 'Transport',
    description: 'Ceypetco Fuel Station Auto-fill',
    paymentMode: 'Credit Card',
    timestamp: getRelativeDate(2, '08:45'),
    tags: ['fuel', 'ceypetco'],
    notes: 'Full tank Petrol Octane 92'
  },
  {
    id: 'tx-7',
    type: 'debit',
    amount: 2900,
    category: 'Entertainment',
    description: 'Netflix Ultra Subscription',
    paymentMode: 'Credit Card',
    timestamp: getRelativeDate(2, '21:00'),
    tags: ['subscription'],
    notes: 'Monthly renewal debit'
  },
  {
    id: 'tx-8',
    type: 'credit',
    amount: 1450,
    category: 'Rewards',
    description: 'Sampath Bank Card Cashback Reward',
    paymentMode: 'Credit Card',
    timestamp: getRelativeDate(3, '14:10'),
    tags: ['cashback'],
    notes: 'Statement credit discount'
  },
  {
    id: 'tx-9',
    type: 'debit',
    amount: 14500,
    category: 'Shopping',
    description: 'Odel / Daraz Apparel & Tech Order',
    paymentMode: 'Credit Card',
    timestamp: getRelativeDate(4, '17:30'),
    tags: ['shopping', 'daraz'],
    notes: 'Delivered via courier'
  },
  {
    id: 'tx-10',
    type: 'debit',
    amount: 6850,
    category: 'Bills',
    description: 'Dialog Home Broadband Fibre & Mobile',
    paymentMode: 'LankaQR / FriMi',
    timestamp: getRelativeDate(5, '15:00'),
    tags: ['utility', 'dialog', 'broadband'],
    notes: 'Unlimited Fibre package'
  }
];
