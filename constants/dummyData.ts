// constants/dummyData.ts

export const DUMMY_USER = {
  full_name: 'Tunde Adeyemi',
  role: 'worker',
  eis_score: 67,
  location_city: 'Lagos',
};

export const DUMMY_WALLET = {
  account_number: '0733848693',
  account_name: 'Kolliq - Tunde Adeyemi',
  bank_name: 'GTBank',
  balance: '12500.00',
  savings_balance: '3000.00',
  escrow_balance: '0.00',
  wallet_ready: true,
};

export const DUMMY_JOBS = [
  {
    job_id: '1',
    title: 'Delivery Rider Needed',
    skill_required: 'delivery',
    pay_per_worker: 3500,
    location_area: 'Surulere, Lagos',
    duration_hours: 4,
    employer_name: 'FastLogistics Ltd',
    employer_rating: 4.8,
    distance_km: 1.2,
    escrow_funded: true,
    match_score: 95,
  },
  {
    job_id: '2',
    title: 'Warehouse Assistant',
    skill_required: 'market',
    pay_per_worker: 5000,
    location_area: 'Apapa, Lagos',
    duration_hours: 8,
    employer_name: 'MegaMart Stores',
    employer_rating: 4.5,
    distance_km: 3.4,
    escrow_funded: true,
    match_score: 78,
  },
  {
    job_id: '3',
    title: 'Event Setup Crew',
    skill_required: 'construction',
    pay_per_worker: 4000,
    location_area: 'Victoria Island, Lagos',
    duration_hours: 6,
    employer_name: 'EventPro Nigeria',
    employer_rating: 4.2,
    distance_km: 5.1,
    escrow_funded: true,
    match_score: 65,
  },
];

export const DUMMY_TRANSACTIONS = [
  {
    id: '1',
    type: 'credit' as const,
    amount: '3325.00',
    description: 'Gig payment — Delivery Rider Needed',
    created_at: '2026-05-09T14:30:00Z',
  },
  {
    id: '2',
    type: 'debit' as const,
    amount: '200.00',
    description: 'Insurance premium deduction',
    created_at: '2026-05-09T08:00:00Z',
  },
  {
    id: '3',
    type: 'credit' as const,
    amount: '5000.00',
    description: 'Gig payment — Warehouse Assistant',
    created_at: '2026-05-08T17:00:00Z',
  },
  {
    id: '4',
    type: 'debit' as const,
    amount: '200.00',
    description: 'Daily savings deposit',
    created_at: '2026-05-08T08:00:00Z',
  },
];

export const DUMMY_LOAN_ELIGIBILITY = {
  eligible: true,
  max_amount: 10000,
  interest_rate: 5.0,
  tenure_days: 28,
  funding_source: 'demo_float',
  note: 'You qualify for up to ₦10,000',
};

export const DUMMY_INSURANCE = {
  unlocked: true,
  active: false,
  premium_per_day: '200.00',
  coverage_limit: '50000.00',
};

export const DUMMY_SAVINGS = {
  unlocked: true,
  wallet_balance: '12500.00',
  savings: {
    balance: '3000.00',
    total_interest_earned: '45.00',
  },
  annual_interest_rate: 5.0,
};

export const DUMMY_TRADER = {
  full_name: 'Amina Musa',
  business_name: 'Amina Fresh Provisions',
  role: 'trader',
  eis_score: 45,
  location_city: 'Kano',
};

export const DUMMY_EMPLOYER = {
  full_name: 'Alhaji Musa',
  business_name: 'FastLogistics Ltd',
  role: 'employer',
  location_city: 'Lagos',
  business_rating: 4.8,
};

export const DUMMY_ACTIVE_JOBS = [
  {
    job_id: '1',
    title: 'Delivery Rider Needed',
    status: 'active',
    workers_needed: 1,
    workers_accepted: 1,
    pay_per_worker: 3500,
    location_area: 'Surulere, Lagos',
    posted_at: '2026-05-09T10:00:00Z',
  },
];

export const DUMMY_TOP_WORKERS = [
  {
    user_id: '1',
    full_name: 'Tunde A.',
    skill: 'Delivery',
    eis_score: 67,
    rating: 4.8,
  },
  {
    user_id: '2',
    full_name: 'Chidi O.',
    skill: 'Labor',
    eis_score: 54,
    rating: 4.5,
  },
  {
    user_id: '3',
    full_name: 'Emeka B.',
    skill: 'Cleaning',
    eis_score: 72,
    rating: 4.9,
  },
];

export const DUMMY_JOB_DETAIL = {
  title: 'Warehouse Loader',
  employer: 'Logistics Pro',
  rating: '4.8',
  location: 'Ikeja Industrial Area',
  duration: '6',
  startTime: 'Tomorrow, 8:00 AM',
  workersNeeded: '3',
  description: 'We need strong individuals to help load boxes into delivery trucks. Must be able to lift 20kg. Safety gear will be provided on site.',
  pay: '₦15,000',
};

export const DUMMY_CATEGORIES = ['Delivery', 'Cleaning', 'Labor', 'Catering', 'Security', 'Warehousing', 'Teaching', 'Other'];

export const DUMMY_ESCROW_INSTRUCTIONS = {
  accountNumber: '0123456789',
  bank: 'GTBank',
  amount: '₦0',
  reference: 'SQD-XXXXXX',
};

export const DUMMY_EIS_SCORE = {
  score: 65,
  gigsDone: 12,
  daysActive: 45,
};
