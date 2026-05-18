import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
}

export interface Wallet {
  balance: number;
  transactions: Transaction[];
}

interface WalletContextType {
  wallet: Wallet;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  requestLoan: (amount: number, purpose: string) => void;
  transferToBorrower: (amount: number, borrowerId: string) => void;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet>({
    balance: 10000, // Demo balance
    transactions: []
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load wallet data from localStorage on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem(`wallet_${user?.id}`);
    if (savedWallet) {
      try {
        const parsedWallet = JSON.parse(savedWallet);
        setWallet({
          ...parsedWallet,
          transactions: parsedWallet.transactions.map((t: any) => ({
            ...t,
            timestamp: new Date(t.timestamp)
          }))
        });
      } catch (error) {
        console.error('Error loading wallet data:', error);
      }
    }
  }, [user?.id]);

  // Save wallet data to localStorage whenever it changes
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`wallet_${user.id}`, JSON.stringify(wallet));
    }
  }, [wallet, user?.id]);

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    setWallet(prev => {
      const newBalance = transactionData.type === 'credit' 
        ? prev.balance + transactionData.amount
        : prev.balance - transactionData.amount;

      return {
        balance: Math.max(0, newBalance), // Ensure balance doesn't go negative
        transactions: [newTransaction, ...prev.transactions]
      };
    });
  };

  const requestLoan = (amount: number, purpose: string) => {
    if (user?.role === 'BORROWER') {
      addTransaction({
        type: 'credit',
        amount,
        description: `Loan request: ${purpose}`,
        status: 'pending'
      });
    }
  };

  const transferToBorrower = (amount: number, borrowerId: string) => {
    if (user?.role === 'LENDER' && wallet.balance >= amount) {
      addTransaction({
        type: 'debit',
        amount,
        description: `Transfer to borrower ${borrowerId}`,
        status: 'completed'
      });
    }
  };

  const value: WalletContextType = {
    wallet,
    addTransaction,
    requestLoan,
    transferToBorrower,
    isLoading
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
