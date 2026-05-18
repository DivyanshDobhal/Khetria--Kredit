import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { 
  Wallet as WalletIcon, 
  Plus, 
  Minus, 
  ArrowUpRight, 
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Smartphone,
  CreditCard,
  Landmark,
  ShieldCheck,
  Gift
} from 'lucide-react';
import { motion } from 'framer-motion';
import { UPIModal } from './UPIModal';

export const Wallet: React.FC = () => {
  const { wallet, addTransaction, requestLoan, transferToBorrower } = useWallet();
  const { user } = useAuth();
  const { language } = useI18n();
  const [requestAmount, setRequestAmount] = useState('');
  const [requestPurpose, setRequestPurpose] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferBorrowerId, setTransferBorrowerId] = useState('');
  const [isUPIModalOpen, setIsUPIModalOpen] = useState(false);
  const [upiModalType, setUpiModalType] = useState<'add' | 'withdraw'>('add');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRequestLoan = () => {
    const amount = parseFloat(requestAmount);
    if (amount > 0 && requestPurpose.trim()) {
      requestLoan(amount, requestPurpose);
      setRequestAmount('');
      setRequestPurpose('');
    }
  };

  const handleTransfer = () => {
    const amount = parseFloat(transferAmount);
    if (amount > 0 && amount <= wallet.balance && transferBorrowerId.trim()) {
      transferToBorrower(amount, transferBorrowerId);
      setTransferAmount('');
      setTransferBorrowerId('');
    }
  };

  const openUPIModal = (type: 'add' | 'withdraw') => {
    setUpiModalType(type);
    setIsUPIModalOpen(true);
  };

  const recentTransactions = wallet.transactions.slice(0, 10);

  const paymentRails = [
    { name: 'Google Pay', detail: 'UPI instant pay', color: 'bg-blue-500' },
    { name: 'PhonePe', detail: 'UPI collect', color: 'bg-purple-500' },
    { name: 'Paytm', detail: 'Wallet + UPI', color: 'bg-sky-500' },
    { name: 'BHIM', detail: 'Bank UPI', color: 'bg-orange-500' },
    { name: 'Cards', detail: 'Debit or credit', color: 'bg-emerald-500' },
    { name: 'Net Banking', detail: 'Bank transfer', color: 'bg-indigo-500' },
  ];

  const quickAmounts = [500, 1000, 2500, 5000];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {language === 'hi' ? 'क्षेत्र वॉलेट' : 'Kshetra Wallet'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'hi' 
              ? 'अपने वॉलेट बैलेंस को प्रबंधित करें और लेनदेन देखें'
              : 'Manage your wallet balance and view transactions'
            }
          </p>
        </div>

        {/* Wallet Balance Card */}
        <Card className="bg-gradient-card border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <WalletIcon className="w-6 h-6" />
              <span>{language === 'hi' ? 'क्षेत्र वॉलेट बैलेंस' : 'Kshetra Wallet Balance'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-primary mb-2">
                {formatCurrency(wallet.balance)}
              </div>
              <p className="text-muted-foreground">
                {language === 'hi' ? 'उपलब्ध शेष राशि' : 'Available Balance'}
              </p>
              
              {/* UPI Quick Actions */}
              <div className="flex space-x-3 justify-center">
                <Button 
                  onClick={() => openUPIModal('add')}
                  className="bg-gradient-primary hover:shadow-glow"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {language === 'hi' ? 'UPI से जोड़ें' : 'Add via UPI'}
                </Button>
                <Button 
                  onClick={() => openUPIModal('withdraw')}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                  size="sm"
                  disabled={wallet.balance <= 0}
                >
                  <Minus className="w-4 h-4 mr-2" />
                  {language === 'hi' ? 'UPI से निकालें' : 'Withdraw via UPI'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-4 mb-8">
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Gift className="h-5 w-5" />
                <span className="font-medium">Wallet Bonus</span>
              </div>
              <p className="text-2xl font-bold">₹75</p>
              <p className="text-sm text-muted-foreground">Demo reward when you add ₹5,000 or more.</p>
            </CardContent>
          </Card>
          <Card className="bg-success/10 border-success/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-success mb-2">
                <ShieldCheck className="h-5 w-5" />
                <span className="font-medium">Secure Escrow</span>
              </div>
              <p className="text-2xl font-bold">T+1</p>
              <p className="text-sm text-muted-foreground">Demo settlement status for lender repayments.</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-blue-500 mb-2">
                <Landmark className="h-5 w-5" />
                <span className="font-medium">Payment Rails</span>
              </div>
              <p className="text-2xl font-bold">6</p>
              <p className="text-sm text-muted-foreground">UPI, wallet, card, and net banking options.</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-card border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5" />
              <span>{language === 'hi' ? 'पेमेंट विकल्प' : 'Payment Options'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {paymentRails.map((rail) => (
                <Button
                  key={rail.name}
                  type="button"
                  variant="outline"
                  onClick={() => openUPIModal('add')}
                  className="h-auto justify-start gap-3 p-3"
                >
                  <span className={`h-4 w-4 rounded-full ${rail.color}`} />
                  <span className="text-left">
                    <span className="block text-sm font-medium">{rail.name}</span>
                    <span className="block text-xs text-muted-foreground">{rail.detail}</span>
                  </span>
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    addTransaction({
                      type: 'credit',
                      amount,
                      description: `Quick wallet top-up`,
                      status: 'completed'
                    });
                  }}
                >
                  +{formatCurrency(amount)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Action Panel */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>{language === 'hi' ? 'क्रियाएं' : 'Actions'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {user?.role === 'BORROWER' && (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">
                    {language === 'hi' ? 'लोन अनुरोध' : 'Request Loan'}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="request-amount">
                        {language === 'hi' ? 'राशि' : 'Amount'}
                      </Label>
                      <Input
                        id="request-amount"
                        type="number"
                        value={requestAmount}
                        onChange={(e) => setRequestAmount(e.target.value)}
                        placeholder={language === 'hi' ? 'राशि दर्ज करें' : 'Enter amount'}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="request-purpose">
                        {language === 'hi' ? 'उद्देश्य' : 'Purpose'}
                      </Label>
                      <Input
                        id="request-purpose"
                        value={requestPurpose}
                        onChange={(e) => setRequestPurpose(e.target.value)}
                        placeholder={language === 'hi' ? 'लोन का उद्देश्य' : 'Loan purpose'}
                        className="mt-1"
                      />
                    </div>
                    <Button 
                      onClick={handleRequestLoan}
                      className="w-full bg-gradient-primary"
                      disabled={!requestAmount || !requestPurpose}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {language === 'hi' ? 'लोन अनुरोध करें' : 'Request Loan'}
                    </Button>
                  </div>
                </div>
              )}

              {user?.role === 'LENDER' && (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">
                    {language === 'hi' ? 'उधारकर्ता को स्थानांतरित करें' : 'Transfer to Borrower'}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="transfer-amount">
                        {language === 'hi' ? 'राशि' : 'Amount'}
                      </Label>
                      <Input
                        id="transfer-amount"
                        type="number"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        placeholder={language === 'hi' ? 'राशि दर्ज करें' : 'Enter amount'}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="borrower-id">
                        {language === 'hi' ? 'उधारकर्ता ID' : 'Borrower ID'}
                      </Label>
                      <Input
                        id="borrower-id"
                        value={transferBorrowerId}
                        onChange={(e) => setTransferBorrowerId(e.target.value)}
                        placeholder={language === 'hi' ? 'उधारकर्ता ID' : 'Borrower ID'}
                        className="mt-1"
                      />
                    </div>
                    <Button 
                      onClick={handleTransfer}
                      className="w-full bg-gradient-primary"
                      disabled={!transferAmount || !transferBorrowerId || parseFloat(transferAmount) > wallet.balance}
                    >
                      <ArrowDownLeft className="w-4 h-4 mr-2" />
                      {language === 'hi' ? 'स्थानांतरित करें' : 'Transfer'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{language === 'hi' ? 'लेनदेन इतिहास' : 'Transaction History'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {recentTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {recentTransactions.map((transaction) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            transaction.type === 'credit' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {transaction.type === 'credit' ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownLeft className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(transaction.timestamp)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${
                            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(transaction.status)}
                            <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <WalletIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{language === 'hi' ? 'कोई लेनदेन नहीं' : 'No transactions yet'}</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* UPI Modal */}
        <UPIModal
          isOpen={isUPIModalOpen}
          onClose={() => setIsUPIModalOpen(false)}
          type={upiModalType}
        />
      </motion.div>
    </div>
  );
};
