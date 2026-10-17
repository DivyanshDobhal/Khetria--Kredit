# Peer-to-Peer Micro-Lending Platform

A modern, responsive fintech platform inspired by Slice.it's design, built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Role-based Authentication**: Separate flows for Borrowers and Lenders
- **Loan Marketplace**: Browse and fund loan requests
- **Real-time Progress Tracking**: Live funding progress bars
- **Trust Score System**: Dynamic trust assessment for borrowers
- **Responsive Design**: Mobile-first, works seamlessly on all devices

### User Flows

#### Borrowers
- Create loan requests with amount, purpose, and repayment terms
- Track loan status (PENDING → FUNDING → FUNDED → REPAID)
- View funding progress with animated progress bars
- Access personalized dashboard

#### Lenders
- Browse marketplace of loan requests 
- Fund loans with custom amounts
- Track investment portfolio
- View loan performance and status

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **State Management**: React Context + Custom Hooks

## 🎨 Design System

- **Colors**: HSL-based semantic tokens
- **Typography**: Inter font with bold headings
- **Gradients**: Primary, secondary, and success gradients
- **Components**: Reusable shadcn/ui components with custom variants
- **Animations**: Smooth transitions and micro-interactions

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── FundLoanModal.tsx
│   ├── LoanCard.tsx
│   ├── Navbar.tsx
│   ├── ProgressBar.tsx
│   └── TrustScoreBadge.tsx
├── contexts/            # React contexts
│   └── AuthContext.tsx
├── hooks/               # Custom hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/                 # Utilities
│   ├── api.ts           # API client
│   └── utils.ts         # Helper functions
├── pages/               # Page components
│   ├── BorrowerDashboard.tsx
│   ├── Index.tsx
│   ├── Investments.tsx
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Marketplace.tsx
│   ├── NotFound.tsx
│   └── Register.tsx
└── main.tsx            # App entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd peer-lending-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:8080
   ```

## 🔧 API Integration

The frontend is designed to integrate with a Node.js + Express + Prisma backend:

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Loan Endpoints  
- `GET /api/loans` - Fetch marketplace loans
- `GET /api/loans/:id` - Get loan details
- `POST /api/loans` - Create loan request (borrowers)
- `POST /api/loans/:id/fund` - Fund a loan (lenders)

### Dashboard Endpoints
- `GET /api/dashboard/my-loans` - Borrower's loans
- `GET /api/dashboard/my-investments` - Lender's investments

### Environment Variables
Create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5001/api
```

## 🎮 Demo Mode

The app includes demo accounts for easy testing:

### Demo Accounts
- **Borrower**: demo-borrower@example.com / password123
- **Lender**: demo-lender@example.com / password123

### Demo Data
When backend is unavailable, the app uses mock data to demonstrate functionality.

## 🔐 Authentication

- JWT-based authentication
- Token stored in localStorage
- Automatic token refresh
- Protected routes with role-based access
- Persistent login sessions

## 🎯 Trust Score System

Dynamic trust assessment based on:
- **Profile Completeness**: Verified user information
- **Verification Status**: Email and identity verification  
- **Loan Purpose**: Clarity and legitimacy of loan request
- **Platform History**: Previous loan performance

Trust levels: Low (🔴) | Medium (🟡) | High (🟢)

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navigation**: Collapsible mobile menu
- **Touch-friendly**: Large tap targets and gestures

## ✨ Key Components

### LoanCard
Displays loan information with funding progress, trust score, and action buttons.

### ProgressBar
Animated funding progress with customizable styling and labels.

### TrustScoreBadge  
Visual trust score indicator with color-coded levels.

### FundLoanModal
Modal for lenders to fund loans with amount input and confirmation.

## 🎨 Styling Guidelines

- Use semantic color tokens from `index.css`
- Follow design system defined in `tailwind.config.ts`
- Prefer component variants over custom styles
- Use HSL color format for all colors
- Implement smooth transitions for all interactive elements

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy
The `dist/` folder contains the production build ready for deployment to any static hosting service.

## 🧪 Testing

### Manual Testing Scenarios
1. **Registration Flow**: Create borrower and lender accounts
2. **Loan Creation**: Create loan request as borrower
3. **Funding Flow**: Fund loan as lender
4. **Progress Tracking**: Watch real-time progress updates
5. **Mobile Responsiveness**: Test on various screen sizes

## 🔮 Future Enhancements

- Real-time notifications
- Advanced filtering and search
- Credit scoring integration  
- Payment processing
- Chat/messaging system
- KYC verification
- Analytics dashboard

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

For questions or support, please open an issue on GitHub.

---

Built with ❤️ for the future of peer-to-peer lending.
