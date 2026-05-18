# Kshetra Kredit - Project Workflow Diagram

This document provides a comprehensive workflow diagram for the Kshetra Kredit peer lending platform, illustrating the main user flows, system components, and their interactions.

## System Architecture

```mermaid
graph TD
    subgraph "Frontend"
        UI[UI Components]--Renders-->Pages
        Pages--Uses-->Contexts
        Pages--Uses-->Hooks
        UI--Uses-->Hooks
        Contexts--Provides-->Pages
        Hooks--Enhances-->UI
    end
    
    subgraph "Backend"
        API[API Layer]--Routes-->Controllers
        Controllers--Uses-->Middleware
        Controllers--Uses-->Utils
    end
    
    subgraph "Data"
        LocalStorage[(LocalStorage)]--Stores-->AuthData
        LocalStorage--Stores-->WalletData
        LocalStorage--Stores-->Settings
    end
    
    UI--API Calls-->API
    Pages--API Calls-->API
    API--Responses-->UI
    API--Responses-->Pages
    Contexts--Reads/Writes-->LocalStorage
```

## User Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Frontend UI
    participant Auth as AuthContext
    participant API as Backend API
    participant Storage as LocalStorage
    
    %% Registration Flow
    User->>UI: Navigate to Register Page
    UI->>User: Display Registration Form
    User->>UI: Fill Form & Submit
    UI->>UI: Validate Form
    UI->>UI: Show Terms & Conditions Modal
    User->>UI: Accept Terms
    UI->>Auth: Call register()
    Auth->>API: POST /auth/register
    API->>Auth: Return JWT Token
    Auth->>Storage: Store Token
    Auth->>UI: Update Auth State
    UI->>User: Redirect to Dashboard
    
    %% Login Flow
    User->>UI: Navigate to Login Page
    UI->>User: Display Login Form
    User->>UI: Enter Credentials & Submit
    UI->>Auth: Call login()
    Auth->>API: POST /auth/login
    API->>Auth: Return JWT Token
    Auth->>Storage: Store Token
    Auth->>UI: Update Auth State
    UI->>User: Redirect to Dashboard
```

## Borrower Workflow

```mermaid
sequenceDiagram
    actor Borrower
    participant UI as Frontend UI
    participant API as Backend API
    participant Wallet as WalletContext
    
    Borrower->>UI: Navigate to Dashboard
    UI->>API: GET /dashboard/my-loans
    API->>UI: Return Borrower's Loans
    UI->>Borrower: Display Active Loans
    
    Borrower->>UI: Create Loan Request
    UI->>Borrower: Show Loan Creation Form
    Borrower->>UI: Fill Loan Details & Submit
    UI->>API: POST /loans
    API->>UI: Return Created Loan
    UI->>Borrower: Show Success Message
    
    %% Loan Funded Notification
    Note over API,UI: When loan is funded
    API->>UI: Loan Status Update
    UI->>Wallet: Update Wallet Balance
    UI->>Borrower: Show Funding Notification
    
    %% Repayment Flow
    Borrower->>UI: Navigate to Repayments
    UI->>API: GET /dashboard/my-loans
    API->>UI: Return Loan with Payment Schedule
    UI->>Borrower: Display Payment Options
    Borrower->>UI: Make Payment
    UI->>API: POST /loans/:id/repay
    API->>UI: Confirm Payment
    UI->>Borrower: Show Payment Confirmation
```

## Lender Workflow

```mermaid
sequenceDiagram
    actor Lender
    participant UI as Frontend UI
    participant API as Backend API
    participant Wallet as WalletContext
    
    Lender->>UI: Navigate to Marketplace
    UI->>API: GET /loans?status=ACTIVE
    API->>UI: Return Available Loans
    UI->>Lender: Display Loan Opportunities
    
    Lender->>UI: Filter/Search Loans
    UI->>Lender: Show Filtered Results
    
    Lender->>UI: Select Loan to Fund
    UI->>Lender: Show Funding Modal
    Lender->>UI: Enter Funding Amount & Confirm
    UI->>API: POST /loans/:id/fund
    API->>UI: Confirm Funding
    UI->>Wallet: Update Wallet Balance
    UI->>Lender: Show Funding Confirmation
    
    Lender->>UI: Navigate to Investments
    UI->>API: GET /dashboard/my-investments
    API->>UI: Return Lender's Investments
    UI->>Lender: Display Investment Portfolio
```

## Multi-language Support Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Frontend UI
    participant I18n as I18nContext
    participant Storage as LocalStorage
    participant API as Backend API
    
    %% Language Selection
    User->>UI: Toggle Language
    UI->>I18n: Change Language
    I18n->>Storage: Store Language Preference
    I18n->>UI: Update UI Text
    
    %% API Calls with Language
    UI->>API: API Call with Language Header
    Note over UI,API: x-language header set
    API->>UI: Return Localized Response
```

## Terms & Conditions Acceptance Flow

```mermaid
sequenceDiagram
    actor User
    participant Register as Register Page
    participant Modal as TermsAcceptanceModal
    participant Auth as AuthContext
    
    User->>Register: Fill Registration Form
    User->>Register: Submit Form
    Register->>Register: Validate Form
    
    alt Terms Not Accepted
        Register->>Modal: Show Terms Modal
        Modal->>User: Display Terms & Conditions
        User->>Modal: Accept Terms
        Modal->>Register: Notify Terms Accepted
        Register->>Auth: Complete Registration
    else Terms Already Accepted
        Register->>Auth: Complete Registration Directly
    end
    
    Auth->>User: Registration Complete
```

## Wallet System Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Frontend UI
    participant Wallet as WalletContext
    participant Storage as LocalStorage
    
    %% Initialize Wallet
    UI->>Wallet: Initialize
    Wallet->>Storage: Get Stored Wallet Data
    Storage->>Wallet: Return Wallet Data
    Wallet->>UI: Update UI with Balance
    
    %% Transactions
    alt Borrower Receives Funds
        UI->>Wallet: Credit Funds
        Wallet->>Wallet: Update Balance
        Wallet->>Storage: Store Updated Data
        Wallet->>UI: Show Updated Balance
    else Lender Invests
        UI->>Wallet: Debit Funds
        Wallet->>Wallet: Update Balance
        Wallet->>Storage: Store Updated Data
        Wallet->>UI: Show Updated Balance
    end
    
    %% View Transactions
    User->>UI: Navigate to Wallet
    UI->>Wallet: Get Transactions
    Wallet->>UI: Return Transaction History
    UI->>User: Display Transactions
```

## Chatbot Interaction Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Frontend UI
    participant Chatbot as Chatbot Component
    participant API as Chatbot API
    
    User->>UI: Open Chatbot
    UI->>Chatbot: Initialize
    Chatbot->>User: Display Welcome Message
    
    User->>Chatbot: Send Message
    Chatbot->>API: Process Message
    API->>Chatbot: Return Response
    Chatbot->>User: Display Response
    
    alt Voice Input
        User->>Chatbot: Toggle Voice Input
        Chatbot->>User: Start Listening
        User->>Chatbot: Speak Message
        Chatbot->>API: Process Voice Input
        API->>Chatbot: Return Response
        Chatbot->>User: Display & Speak Response
    end
```

This comprehensive workflow diagram illustrates the key processes and interactions within the Kshetra Kredit platform, providing a clear visualization of how the different components work together to deliver the application's functionality.