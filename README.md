# Kolliq Mobile App

**A comprehensive gig economy platform connecting workers, employers, and traders in Nigeria with seamless job matching, marketplace, and financial services.**

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Revenue & Monetization](#revenue--monetization)
3. [App Features](#app-features)
4. [User Roles & Flows](#user-roles--flows)
5. [Technical Stack](#technical-stack)
6. [Architecture](#architecture)
7. [Installation & Setup](#installation--setup)
8. [Configuration](#configuration)
9. [API Integration](#api-integration)
10. [File Structure](#file-structure)
11. [Running the App](#running-the-app)

---

## 🎯 Project Overview

**Kolliq** is a React Native Expo-based mobile application that revolutionizes the gig economy in Nigeria by connecting:

- 🟢 **Workers** - Finding and accepting gig jobs based on skills and location
- 🟠 **Employers** - Posting jobs and managing worker payments via escrow
- 🟣 **Traders** - Buying and selling products in a marketplace
- 💰 **All Users** - Access to wallets, loans, insurance, and savings products

**Business Model:**
- Commission on job completions
- Marketplace listing fees (2% platform fee on sales)
- Escrow management for secure payments
- Financial services revenue

---

## 💰 Revenue & Monetization

### **Primary Revenue Streams**

#### **1. Job Commission** ✅ (40% of Revenue)
- Commission on each completed gig (5-10%)
- Employer funds escrow for job
- When job completes → Workers paid → Kolliq takes commission
- **Example**: ₦10,000 job → Kolliq takes ₦500-₦1,000

#### **2. Loan Interest & Fees** ✅ (30% of Revenue)
- **Loan disbursements with 5-10% interest**
- Loan application fees (₦500-₦1,000)
- Early repayment penalties
- Default recovery mechanisms
- **Example**: ₦50,000 loan → Kolliq earns ₦2,500-₦5,000 interest

#### **3. Marketplace Fees** ✅ (15% of Revenue)
- **2% platform fee on every transaction**
- Deducted automatically from purchase
- **Example**: ₦50,000 product sale → Kolliq takes ₦1,000

#### **4. Escrow Float Investment** ✅ (10% of Revenue)
- Employer funds held temporarily in escrow
- Before job completion and worker payout
- Platform invests float at low-risk
- **Example**: ₦500K daily escrow → ₦183.25M annually in float

#### **5. Insurance Premiums & Processing** ✅ (5% of Revenue)
- Monthly insurance premiums from workers
- Claim processing fees
- Insurance partnerships (referral revenue)

### **Secondary Revenue Streams** (Future Implementation)

#### **Premium Features** 🔄
- **Featured listings** - Traders pay to feature products
- **Promoted jobs** - Employers pay to reach more workers
- **Verified badges** - Fee for seller verification
- **Listing boost** - Temporary top-of-feed placement

#### **Subscription Plans** 🔄
- **Worker Premium** - ₦500/month for priority job matching
- **Employer Premium** - ₦2,000/month for unlimited job postings
- **Trader Premium** - ₦1,000/month for featured listings + analytics

#### **B2B & Data Services** 🔄
- **Anonymized market data** - Wage trends, job demand by location
- **Enterprise dashboards** - Analytics for large employers
- **API access** - For third-party integrations

### **Revenue Projection (Sample)**

**Daily Volume:**
```
100 jobs posted @ ₦5,000 avg           = ₦500,000 escrow
150 marketplace transactions @ ₦20,000  = ₦3,000,000 GMV
50 workers taking loans                 = ₦2,500,000 disbursed
200 insurance active subscribers        = ₦300,000 premiums
```

**Daily Revenue:**
```
Job Commission (5% on ₦500K)           = ₦25,000
Marketplace Fee (2% on ₦3M)            = ₦60,000
Loan Interest & Fees (5-10%)           = ₦125,000 - ₦250,000
Escrow Float Investment                = ₦5,000 - ₦10,000
Payment Processing Fees                = ₦10,000 - ₦20,000
Insurance Revenue                      = ₦15,000 - ₦30,000
────────────────────────────────────────────────────
DAILY REVENUE                          = ₦240,000 - ₦400,000

MONTHLY (30 days)                      = ₦7.2M - ₦12M
ANNUAL                                 = ₦86.4M - ₦144M
```

### **Revenue Model Benefits**

✅ **Multi-stream approach** = Resilient business model
✅ **Users don't pay directly** = Low acquisition friction
✅ **Network effects** = More users → Higher volume → Higher revenue
✅ **Aligned incentives** = Everyone wins (platform, workers, employers, traders)
✅ **Scalable** = Revenue grows with transaction volume
✅ **B2B potential** = Enterprise services for additional revenue

---

## ✨ App Features

### 🔐 **Authentication & Onboarding** (8 Steps)

1. **Phone Entry** - Nigerian phone number (0801XXXXXXXX format)
2. **OTP Verification** - 6-digit one-time password (5-minute TTL)
3. **PIN Creation** - 4-digit personal identification number
4. **Personal Details** - Name, gender, date of birth, email, BVN
5. **Role Selection** - Choose: Worker, Trader, or Employer
6. **Role-Specific Data** - Collect skills/trade/business info based on role
7. **Location Setup** - City and area selection
8. **Review & Confirmation** - Verify data and complete registration

**After Registration:**
- Automatic wallet provisioning (Squad virtual account)
- Role-based dashboard access
- Token storage for future logins

---

### 👷 **Worker Features**

**Home Screen - Job Feed:**
- 🎯 AI-matched job recommendations (max 3 top matches)
- Match score breakdown (location, skills, availability)
- Distance calculation from job location
- Employer ratings and reviews
- One-tap job acceptance

**Job Management:**
- ✅ Accept job → Status: IN_PROGRESS
- 📊 View job details (pay, location, skills needed)
- 👔 Contact employer via SMS
- ✔️ Job completion notification
- 💰 Payment received via wallet

**Profile:**
- Skills management (add/remove)
- Availability settings (weekdays, weekends, full-time)
- Vehicle ownership tracking
- Languages spoken
- Rating history

**Earnings:**
- 💵 View accepted jobs and earnings
- 📈 Historical transaction list
- 🏦 Bank account management for payouts

---

### 💼 **Employer Features**

**Dashboard:**
- 📋 Quick job posting (one-tap hero button)
- 👥 Worker management interface
- 💳 Escrow wallet balance display
- 📊 Posted jobs list with status

**Job Management:**
- ➕ Create new job with:
  - Title, description, location
  - Pay per worker
  - Number of workers needed
  - Required skills
  - Start date and availability
- 💰 Escrow instructions (Squad integration)
- 👥 View accepted workers
- ✅ Mark job complete → Auto-payment
- ⭐ Rate workers (1-5 stars)

**Worker Management:**
- 📇 List of all accepted workers
- 📞 Contact information
- ⭐ Worker ratings and reviews
- 📊 Job history

**Payments:**
- 🔐 Secure escrow management
- 📤 Auto-payment on job completion
- 📱 SMS notifications to workers

---

### 🛒 **Trader Features**

**Marketplace Listings:**
- ➕ Create product listing with:
  - Title, description, images
  - Price and condition (new/used/refurbished)
  - Category and quantity
  - Market name (optional)
  - Phone visibility toggle
- 📸 Multiple images per listing
- 🏪 Manage active/paused/sold listings

**Buying & Selling:**
- 🔍 Browse marketplace
- 💳 Purchase using wallet balance
- 📊 Auto 2% platform fee deduction
- 📬 Seller receives remainder instantly
- 💬 Message inquiries to sellers
- ⭐ Rate buyers/sellers

**Marketplace Features:**
- 🏷️ Category filtering
- 📍 City filtering
- 🔎 Search by product name
- 💰 Price range filtering
- ⭐ Seller ratings
- 📱 Optional seller contact info

---

### 💰 **Financial Services** (All Roles)

**Wallet:**
- 💳 Virtual Squad account (9-digit number)
- 📊 Real-time balance
- 💵 Main wallet balance
- 🔒 Escrow balance (jobs)
- 💾 Savings balance
- 💸 Payout history

**Payments:**
- 📥 Incoming from job completions
- 📤 Outgoing for marketplace purchases
- 📋 Transaction history (last 50)
- 🔍 Searchable transactions

**Savings:**
- 🏦 Flexible savings account
- 💰 Deposit anytime
- 🧾 Withdrawal requests
- 📈 Interest tracking

**Loans:**
- 📊 Eligibility checker (based on EIS score)
- 💵 Loan application process
- ✅ Approval notifications
- 📅 Repayment schedules
- 📈 Remaining balance tracking

**Insurance:**
- 🛡️ Income protection insurance
- ✅ Activation (typically 7-14 days processing)
- 📋 Claim filing (days missed + reason)
- 📊 Claim status tracking
- 💰 Payout on approval

**Bank Account Management:**
- 🏦 Save bank account details (50+ Nigerian banks)
- ✅ Two-step verification (verify → save)
- 💳 Account number lookup
- 🔒 Secure storage

---

### 📊 **Shared Features (All Users)**

**User Profile:**
- 👤 Full name, email, phone
- 📍 Location information
- 🗣️ Languages spoken
- 📸 Profile photo (optional)
- ⭐ User rating
- 📋 Role-specific data

**Ratings & Reviews:**
- ⭐ 1-5 star system
- 💬 Optional comments
- 📊 Average rating calculation
- 👥 Rating history

**Push Notifications:**
- 🎯 New job matches (worker)
- ✅ Worker acceptance (employer)
- 💰 Payment received
- 📧 Messages
- 📋 Claim approvals
- ⚠️ System alerts

**Security:**
- 🔐 PIN-based login (not password)
- 🔒 Encrypted token storage
- 🚪 Auto-logout on unauthorized (401)
- 🆔 JWT token management
- 🔑 PIN reset via OTP

---

## 👥 User Roles & Flows

### **Worker Flow**

```
Phone Entry
    ↓
OTP Verification
    ↓
PIN Creation (4 digits)
    ↓
Personal Details
    ↓
Confirm Role: WORKER
    ↓
Skills & Availability
    ↓
Location Setup
    ↓
Review & Register
    ↓
Wallet Provisioning
    ↓
Home Screen (Job Feed)
```

**Worker Actions:**
1. Browse job feed (AI-matched, top 3)
2. Tap job → View details
3. Accept job → Status: IN_PROGRESS
4. Wait for employer to complete job
5. Receive payment → Wallet notification
6. Rate employer
7. View earnings in wallet

---

### **Employer Flow**

```
Phone Entry
    ↓
OTP Verification
    ↓
PIN Creation (4 digits)
    ↓
Personal Details
    ↓
Confirm Role: EMPLOYER
    ↓
Business Info & Worker Types
    ↓
Location Setup
    ↓
Review & Register
    ↓
Wallet Provisioning
    ↓
Employer Dashboard
```

**Employer Actions:**
1. Post job (hero button on dashboard)
2. Set pay, workers needed, skills
3. Fund escrow via Squad
4. Job matching activates automatically
5. Workers accept → IN_PROGRESS status
6. Mark job complete when done
7. Auto-payment released
8. Rate workers

---

### **Trader Flow**

```
Phone Entry
    ↓
OTP Verification
    ↓
PIN Creation (4 digits)
    ↓
Personal Details
    ↓
Confirm Role: TRADER
    ↓
Trade Category & Market Info
    ↓
Location Setup
    ↓
Review & Register
    ↓
Wallet Provisioning
    ↓
Marketplace
```

**Trader Actions:**
1. Create product listing (with images)
2. Set price, condition, quantity
3. Browse marketplace
4. Purchase products (2% platform fee)
5. Respond to buyer inquiries
6. Manage active/sold listings

---

## 🛠️ Technical Stack

### **Frontend**
- **Framework**: React Native 0.73+
- **Navigation**: React Navigation (native stack)
- **State Management**: Zustand v4
- **HTTP Client**: Axios with interceptors
- **Storage**: expo-secure-store (encrypted)
- **UI Framework**: React Native StyleSheet
- **Icons**: Expo Vector Icons (Ionicons, Feather)
- **Fonts**: Plus Jakarta Sans (Google Fonts)
- **Notifications**: Expo Notifications
- **Real-time**: Socket.io (ready for WebSockets)
- **Language**: TypeScript
- **Build**: Expo

### **Backend Architecture**
```
Mobile App (React Native)
    ↓
Node.js Middleware (Railway)
    ↓
Django Backend (Railway)
    ↓
PostgreSQL Database
```

### **External Services**
- **Authentication**: JWT tokens (custom via middleware)
- **Payments**: Squad (virtual accounts, transfers)
- **SMS**: SMS gateway (OTP, notifications)
- **Storage**: Cloudflare R2 (images)
- **Hosting**: Railway.app

---

## 🏗️ Architecture

### **API Structure**

```
Base URL: https://node-middleware.up.railway.app

Auth Endpoints (Node.js Middleware):
├── POST /auth/request-otp
├── POST /auth/verify-otp
├── POST /auth/complete-profile (register)
├── POST /auth/login
├── POST /auth/change-pin
├── POST /auth/reset-pin/request
├── POST /auth/reset-pin/confirm
└── GET  /api/users/auth/profile/

Job Endpoints (Django via Middleware):
├── GET  /api/jobs/feed/
├── POST /api/jobs/create/
├── POST /api/jobs/accept/
├── POST /api/jobs/complete/
├── GET  /api/jobs/mine/
├── POST /api/jobs/rate/
└── GET  /api/jobs/ratings/{user_id}/

Wallet Endpoints (Django via Middleware):
├── GET  /api/wallets/
├── GET  /api/wallets/banks/
├── GET  /api/wallets/bank-account/
├── POST /api/wallets/bank-account/verify/
├── POST /api/wallets/bank-account/save/
└── GET  /api/payments/transactions/

Marketplace Endpoints (Django via Middleware):
├── GET  /api/marketplace/categories/
├── GET  /api/marketplace/listings/
├── POST /api/marketplace/listings/create/
├── POST /api/marketplace/listings/{id}/purchase/
├── GET  /api/marketplace/enquiries/mine/
└── POST /api/marketplace/enquiries/

Financial Endpoints (Django via Middleware):
├── GET  /api/financial/savings/
├── POST /api/financial/savings/deposit/
├── GET  /api/financial/loans/
├── POST /api/financial/loans/apply/
├── GET  /api/financial/insurance/
├── POST /api/financial/insurance/activate/
└── POST /api/financial/insurance/claim/
```

### **Request/Response Format**

**Standardized Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "code": 200
}
```

**Standardized Error Response:**
```json
{
  "success": false,
  "data": null,
  "error": {
    "detail": "Error message"
  },
  "code": 400
}
```

### **State Management (Zustand)**

```typescript
useAppStore {
  // User Data
  user: { id, phone, full_name, email, role }
  isLoggedIn: boolean
  
  // Onboarding Data
  onboardingData: {
    phone, pin, full_name, email, date_of_birth, bvn, role,
    gender, location_area, location_city, languages,
    // Worker fields
    skills, availability, has_vehicle, vehicle_type,
    // Trader fields
    trade_category, business_name, market_name,
    // Employer fields
    worker_types_needed, hiring_frequency, team_size
  }
  
  // Wallet & Financial
  wallet: { balance, escrow_balance, savings_balance }
  transactions: []
  
  // Methods
  setUser(), setLoggedIn(), setOnboardingData(), etc.
}
```

---

## 📦 Installation & Setup

### **Prerequisites**
- Node.js 16+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- Expo Go app (for mobile device testing)

### **Install Dependencies**

```bash
cd kolliq-mobile
npm install
# or
yarn install
```

### **Install Required Packages**

```bash
npx expo install expo-secure-store
npx expo install expo-notifications
npx expo install @react-navigation/native
npx expo install react-native-safe-area-context
npx expo install socket.io-client
npx expo install axios zustand
```

### **Development Setup**

```bash
# Start Expo development server
npm start
# or
yarn start
```

Then choose:
- `i` - Open in iOS Simulator
- `a` - Open in Android Emulator
- `w` - Open in web browser
- `j` - Open Debugger
- Or scan QR code with Expo Go app

---

## ⚙️ Configuration

### **.env File**

Create `.env` file in root directory:

```env
EXPO_PUBLIC_API_BASE_URL=https://node-middleware.up.railway.app
```

**Note**: This file is added to `.gitignore` for security.

### **Constants Configuration**

**colors** (`constants/index.ts`):
```typescript
COLORS = {
  primary: '#1B4D3E',        // Forest Green
  accent: '#F4721E',         // Energy Orange
  background: '#F5F5F0',     // Off White
  // ... more colors
}
```

**fonts**:
```typescript
FONTS = {
  weights: {
    regular: 'PlusJakartaSans_400Regular',
    medium: 'PlusJakartaSans_500Medium',
    semibold: 'PlusJakartaSans_600SemiBold',
    bold: 'PlusJakartaSans_700Bold',
  }
}
```

**API endpoints** (`constants/endpoints.ts`):
```typescript
ENDPOINTS = {
  REQUEST_OTP: '/auth/request-otp',
  VERIFY_OTP: '/auth/verify-otp',
  // ... 40+ endpoints
}
```

---

## 🔌 API Integration

### **Authentication Service**

**File**: `services/auth.ts`

```typescript
// Request OTP
await authService.requestOtp(phone)

// Verify OTP
await authService.verifyOtp(phone, otp)

// Register (Complete Profile)
await authService.register({
  phone, full_name, email, date_of_birth, bvn, pin, role,
  // + optional/role-specific fields
})

// Login
await authService.login(phone, pin)

// Get Profile
await authService.getProfile()

// Change PIN
await authService.changePin(phone, old_pin, new_pin)
```

### **Jobs Service**

**File**: `services/jobsService.ts`

```typescript
// Get job feed (top 3 AI-matched)
await getJobsFeed()

// Get job details
await getJobDetail(jobId)

// Accept job
await acceptJob(job_id)

// Create job (employer)
await createJob(jobData)

// Complete job (employer)
await completeJob(job_id, worker_id?)

// Get my jobs
await getMyJobs()

// Rate job
await rateJob({ job_id, to_user_id, stars, comment })

// Get ratings
await getUserRatings(userId)
```

### **Wallet Service**

**File**: `services/walletService.ts`

```typescript
// Get wallet
await getWallet()

// Get banks
await getBanks()

// Verify bank account
await verifyBankAccount(bank_code, account_number)

// Save bank account
await saveBankAccount({ bank_code, account_number, bank_account_name })

// Get transactions
await getTransactions()
```

### **Marketplace Service**

**File**: `services/marketplaceService.ts`

```typescript
// Get categories
await getCategories()

// Get listings
await getListings({ category, city, q, min_price, max_price })

// Create listing
await createListing(listingData)

// Purchase listing
await purchaseListing(listing_id, quantity, message?)

// Send enquiry
await sendEnquiry({ listing_id, message })

// Get my enquiries
await getMyEnquiries()

// Respond to enquiry
await respondToEnquiry(enquiry_id)
```

### **Financial Service**

**File**: `services/financialService.ts`

```typescript
// Savings
await getSavings()
await depositSavings(amount)
await withdrawSavings(amount)

// Loans
await getLoans()
await checkLoanEligibility()
await applyLoan(amount)
await repayLoan(loan_id, amount)

// Insurance
await getInsurance()
await activateInsurance()
await fileClaim({ days_missed, reason })
await getClaims()
```

---

## 📁 File Structure

```
kolliq-mobile/
├── app/
│   ├── (auth)/                         # Authentication screens
│   │   ├── WelcomeScreen.tsx
│   │   ├── PhoneEntryScreen.tsx
│   │   ├── OTPVerificationScreen.tsx
│   │   ├── CreatePinScreen.tsx
│   │   ├── PersonalDetailsScreen.tsx
│   │   ├── UserTypeSelectionScreen.tsx
│   │   ├── OnboardingWorkerScreen.tsx
│   │   ├── OnboardingTraderDetailsScreen.tsx
│   │   ├── OnboardingEmployerDetailsScreen.tsx
│   │   ├── OnboardingLocationScreen.tsx
│   │   ├── OnboardingReviewScreen.tsx
│   │   ├── SuccessScreen.tsx
│   │   └── LoginScreen.tsx
│   ├── (jobseeker)/                    # Worker screens
│   │   ├── HomeScreen.tsx              # Job feed
│   │   ├── JobsFeedScreen.tsx
│   │   ├── JobDetailScreen.tsx
│   │   ├── GigDetailScreen.tsx
│   │   ├── AcceptJobScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── (employer)/                     # Employer screens
│   │   ├── DashboardScreen.tsx
│   │   ├── PostJobScreen.tsx
│   │   ├── WorkersScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── EscrowInstructionsScreen.tsx
│   ├── (trader)/                       # Trader screens
│   │   └── IdentityScreen.tsx
│   └── (shared)/                       # Shared screens
│       ├── WalletScreen.tsx
│       ├── SavingsScreen.tsx
│       ├── LoansScreen.tsx
│       ├── InsuranceScreen.tsx
│       ├── SplashScreen.tsx
│       ├── EISScoreScreen.tsx
│       └── WalletLoadingScreen.tsx
├── assets/
│   ├── fonts/
│   └── images/
├── components/
│   ├── ui/                             # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── GigCard.tsx
│   │   ├── ScoreCard.tsx
│   │   ├── WalletCard.tsx
│   │   └── SuccessAnimation.tsx
│   ├── jobs/
│   └── wallet/
├── constants/
│   ├── index.ts                        # Colors, fonts, sizes, API config
│   └── endpoints.ts                    # API endpoint definitions
├── hooks/
│   └── useAppStore.ts
├── services/
│   ├── api.ts                          # Axios instance (api.post/get/patch)
│   ├── apiClient.ts                    # Alternative Axios client (apiClient)
│   ├── auth.ts                         # Authentication service
│   ├── authService.ts                  # Legacy auth
│   ├── jobsService.ts                  # Jobs API
│   ├── jobs.ts                         # Legacy jobs (DEPRECATED)
│   ├── walletService.ts                # Wallet API
│   ├── marketplaceService.ts           # Marketplace API
│   ├── financialService.ts             # Financial services API
│   ├── squad.ts                        # Squad integration
│   └── ai.ts                           # AI utilities
├── store/
│   ├── authStore.ts                    # Legacy
│   ├── jobStore.ts                     # Legacy
│   ├── walletStore.ts                  # Legacy
│   └── useAppStore.ts                  # Current Zustand store
├── types/
│   └── index.ts                        # TypeScript interfaces
├── utils/
│   ├── formatCurrency.ts
│   ├── formatDate.ts
│   └── scoreCalculator.ts
├── App.tsx                             # Root navigation
├── index.ts                            # Entry point
├── app.json                            # Expo config
├── babel.config.js                     # Babel config
├── tsconfig.json                       # TypeScript config
├── package.json                        # Dependencies
├── .env                                # Environment variables (GITIGNORED)
├── .gitignore                          # Git ignore rules
└── README.md                           # This file
```

---

## 🚀 Running the App

### **Development Mode**

```bash
npm start
```

This opens Expo Metro Bundler. Choose your platform:
- **`i`** - iOS Simulator
- **`a`** - Android Emulator
- **`w`** - Web browser
- **Scan QR code** - Expo Go app

### **Production Build**

```bash
# EAS Build setup
eas build --platform ios --auto-submit
eas build --platform android

# Or local build
npx expo build:ios
npx expo build:android
```

### **Debugging**

```bash
# Clear cache
npm start -- --clear

# Reset and clear everything
rm -rf node_modules .expo
npm install
npm start
```

### **Testing**

```bash
# Run in specific environment
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000 npm start

# Check for TypeScript errors
npx tsc --noEmit

# Check for ESLint errors
npx eslint .
```

---

## 🔄 Data Flow

### **Registration Flow**

```
PhoneEntryScreen
    ↓ (Phone normalized to 2348XXXXXXXXX)
OTPVerificationScreen
    ↓ (6-digit OTP verified)
CreatePinScreen
    ↓ (4-digit PIN created)
PersonalDetailsScreen
    ↓ (Name, gender, DOB, email, BVN)
UserTypeSelectionScreen
    ↓ (Select: worker, trader, employer)
RoleSpecificScreen (OnboardingWorker/Trader/Employer)
    ↓ (Skills, trade category, business info)
OnboardingLocationScreen
    ↓ (City and area selection)
OnboardingReviewScreen
    ↓ (authService.register() - POST /auth/complete-profile)
Success Screen
    ↓ (Tokens stored, role stored)
Dashboard (based on role)
```

### **Login Flow**

```
LoginScreen (Phone + 4-digit PIN)
    ↓ (authService.login() - POST /auth/login)
Dashboard (auto-route based on role)
    ↓
Worker: HomeScreen (job feed)
Employer: DashboardScreen
Trader: Marketplace
```

### **Job Acceptance Flow (Worker)**

```
HomeScreen (Job Feed - top 3 AI-matched)
    ↓ (Tap job)
JobDetailScreen (View details)
    ↓ (Tap Accept)
AcceptJobScreen (Confirm)
    ↓ (jobsService.acceptJob() - POST /api/jobs/accept/)
Job Status: IN_PROGRESS
    ↓
Wait for employer to complete
    ↓
Payment Received (notification + wallet credit)
    ↓
Rate Employer Screen
    ↓
Earnings History (visible in wallet)
```

### **Job Posting Flow (Employer)**

```
EmployerDashboard
    ↓ (Tap "Post Job")
PostJobScreen (Enter job details)
    ↓ (jobsService.createJob() - POST /api/jobs/create/)
EscrowInstructionsScreen (Show Squad details)
    ↓ (Employer funds escrow)
Job Status: ACTIVE → MATCHING
    ↓
Workers receive notifications
    ↓
Workers accept → IN_PROGRESS
    ↓
EmployerDashboard (Mark Complete)
    ↓ (jobsService.completeJob() - POST /api/jobs/complete/)
Auto-payment released to workers
    ↓
Rate Workers Screen
```

---

## 🔐 Security Features

✅ **PIN-based Authentication** (not password)
✅ **JWT Token Management** (secure storage)
✅ **Encrypted Token Storage** (expo-secure-store)
✅ **Auto-logout on 401 Unauthorized**
✅ **Bearer Token in All Requests**
✅ **OTP Verification** (6 digits, 5-minute TTL)
✅ **PIN Reset via OTP** (account recovery)
✅ **HTTPS Only** (production)
✅ **Request/Response Logging** (console debugging)

---

## 📊 API Status Summary

| Feature | Endpoints | Status |
|---------|-----------|--------|
| Authentication | 8 | ✅ Complete |
| Jobs | 8 | ✅ Complete |
| Wallets | 6 | ✅ Complete |
| Marketplace | 15 | ✅ Complete |
| Financial | 11 | ✅ Complete |
| **TOTAL** | **48+** | ✅ **100%** |

---

## 🎨 Design System

**Color Palette:**
- Primary: #1B4D3E (Forest Green)
- Accent: #F4721E (Energy Orange)
- Background: #F5F5F0 (Off White)
- Text: #1A1A18 (Near Black)
- Muted: #888880 (Gray)

**Spacing:**
- XS: 4px | SM: 8px | MD: 16px | LG: 24px | XL: 32px

**Typography:**
- Regular (400) | Medium (500) | SemiBold (600) | Bold (700)

**UI Principles:**
- Minimal, grounded design (no overly flashy gradients)
- Clear CTAs with accessible colors
- Consistent spacing and typography
- Dark text on light backgrounds

---

## 🤝 Contributing

1. Create a feature branch
2. Commit changes
3. Push to repository
4. Create pull request

---

## 📞 Support

For issues or questions:
- Check API documentation
- Review console logs
- Check `.env` configuration
- Verify backend is running

---

## 📄 License

Proprietary - Kolliq 2026

---

**Built with ❤️ for the Nigerian Gig Economy | May 2026**
