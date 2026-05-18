import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { TrustScoreBadge } from './TrustScoreBadge';
import { useI18n } from '@/contexts/I18nContext';
import { Loan } from '@/lib/api';
import { IndianRupee, TrendingUp, Shield, MessageCircle, Smartphone, Wallet, CreditCard, Landmark, Gift, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface FundLoanModalProps {
  loan: Loan;
  isOpen: boolean;
  onClose: () => void;
  onFund: (amount: number) => void;
  remainingAmount: number;
}

export const FundLoanModal: React.FC<FundLoanModalProps> = ({
  loan,
  isOpen,
  onClose,
  onFund,
  remainingAmount,
}) => {
  const { t, language } = useI18n();
  const [fundAmount, setFundAmount] = useState(Math.min(5000, remainingAmount));
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'wallet' | 'card' | 'bank'>('upi');
  const [selectedApp, setSelectedApp] = useState('gpay');

  const paymentMethods = [
    { id: 'upi', label: 'UPI', detail: 'Instant via UPI apps', icon: Smartphone },
    { id: 'wallet', label: 'Wallet', detail: 'Use Kshetra balance', icon: Wallet },
    { id: 'card', label: 'Card', detail: 'Debit or credit card', icon: CreditCard },
    { id: 'bank', label: 'Net Banking', detail: 'Direct bank payment', icon: Landmark },
  ] as const;

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', color: 'bg-blue-500' },
    { id: 'phonepe', name: 'PhonePe', color: 'bg-purple-500' },
    { id: 'paytm', name: 'Paytm', color: 'bg-sky-500' },
    { id: 'bhim', name: 'BHIM', color: 'bg-orange-500' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateReturns = (amount: number) => {
    // Use the loan's actual interest rate
    const annualRate = loan.interestRate / 100;
    const monthlyRate = annualRate / 12;
    const totalReturn = amount * (1 + (monthlyRate * loan.repaymentTerm));
    return totalReturn - amount;
  };

  const calculateBonus = (amount: number) => {
    if (amount >= 10000) return 150;
    if (amount >= 5000) return 75;
    return 25;
  };

  const redirectToWhatsApp = () => {
    const phoneNumber = '+917231041234';
    const message = language === 'hi' 
      ? `नमस्ते, मैं इस उधारकर्ता को पैसा देना चाहता हूँ। लोन ID: ${loan.id}, राशि: ${formatCurrency(fundAmount)}`
      : `Hello, I want to lend money to this borrower. Loan ID: ${loan.id}, Amount: ${formatCurrency(fundAmount)}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handleSliderChange = (value: number[]) => {
    setFundAmount(value[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    const clampedValue = Math.min(Math.max(value, 50), remainingAmount);
    setFundAmount(clampedValue);
  };

  const handleFund = async () => {
    if (fundAmount < 50 || fundAmount > remainingAmount) return;
    
    setIsLoading(true);
    
    // Simulate payment confirmation before recording the investment.
    setTimeout(() => {
      onFund(fundAmount);
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  const estimatedReturns = calculateReturns(fundAmount);
  const totalReturn = fundAmount + estimatedReturns;
  const rewardBonus = calculateBonus(fundAmount);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[92vh] flex-col overflow-hidden bg-gradient-card p-0 sm:max-w-2xl">
        <DialogHeader className="space-y-2 border-b border-border/50 px-6 py-4">
          <DialogTitle className="text-xl font-bold">{t('fundModal.title')}</DialogTitle>
          <DialogDescription className="line-clamp-2">
            {t('fundModal.subtitle', { name: loan.borrower.name, purpose: loan.purpose })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-4">
          {/* Borrower Info */}
          <div className="bg-muted/30 rounded-lg p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">{loan.borrower.name}</span>
              <TrustScoreBadge score={loan.borrower.trustScore} size="sm" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">{t('loan.amount')}</span>
                <p className="font-medium">{formatCurrency(loan.amount)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">{t('loan.term')}</span>
                <p className="font-medium">{loan.repaymentTerm} months</p>
              </div>
            </div>
          </div>

          {/* Funding Amount */}
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-base font-medium">
              {t('fundModal.investmentAmount')}
            </Label>
            
            <div className="space-y-3">
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  value={fundAmount}
                  onChange={handleInputChange}
                  min={50}
                  max={remainingAmount}
                  className="pl-10"
                  placeholder="Enter amount"
                />
              </div>

              <div className="px-2">
                <Slider
                  value={[fundAmount]}
                  onValueChange={handleSliderChange}
                  max={remainingAmount}
                  min={50}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>₹50</span>
                  <span>{formatCurrency(remainingAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Payment Method</Label>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;

                return (
                  <Button
                    key={method.id}
                    type="button"
                    variant="outline"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`h-auto justify-start gap-2 p-3 text-left ${
                      isSelected ? 'border-primary bg-primary/10 text-primary' : ''
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{method.label}</span>
                      <span className="block truncate text-xs text-muted-foreground">{method.detail}</span>
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          {paymentMethod === 'upi' && (
            <div className="space-y-3">
              <Label className="text-base font-medium">Choose UPI App</Label>
              <div className="grid grid-cols-4 gap-2">
                {upiApps.map((app) => (
                  <Button
                    key={app.id}
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedApp(app.id)}
                    className={`h-14 flex-col gap-1 px-2 ${
                      selectedApp === app.id ? 'border-primary bg-primary/10' : ''
                    }`}
                  >
                    <span className={`h-4 w-4 rounded-full ${app.color}`} />
                    <span className="text-[11px] leading-tight">{app.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Investment Summary */}
          <motion.div 
            className="bg-gradient-success/10 rounded-lg p-3 space-y-3 border border-success/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="font-medium text-success">{t('fundModal.investmentSummary')}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">{t('fundModal.investment')}</span>
                <p className="font-medium">{formatCurrency(fundAmount)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">{t('fundModal.estimatedReturns')}</span>
                <p className="font-medium text-success">
                  +{formatCurrency(estimatedReturns)}
                </p>
              </div>
              <div className="col-span-2 pt-2 border-t border-success/20">
                <span className="text-muted-foreground">{t('fundModal.totalExpectedReturn')}</span>
                <p className="font-bold text-lg text-success">
                  {formatCurrency(totalReturn)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Rewards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-primary/20 bg-primary/10 p-3">
              <div className="mb-1.5 flex items-center gap-2 text-primary">
                <Gift className="h-4 w-4" />
                <span className="text-sm font-medium">Bonus Credit</span>
              </div>
              <p className="text-lg font-bold">{formatCurrency(rewardBonus)}</p>
              <p className="text-xs text-muted-foreground">Demo reward on this investment</p>
            </div>
            <div className="rounded-lg border border-success/20 bg-success/10 p-3">
              <div className="mb-1.5 flex items-center gap-2 text-success">
                <BadgeCheck className="h-4 w-4" />
                <span className="text-sm font-medium">Impact Badge</span>
              </div>
              <p className="text-lg font-bold">Rural Backer</p>
              <p className="text-xs text-muted-foreground">Unlocked after funding</p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-start space-x-2 text-xs text-muted-foreground bg-muted/20 rounded-lg p-3">
            <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium mb-1">{t('fundModal.securityNotice')}</p>
              <p>
                {t('fundModal.securityText')}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 border-t border-border/50 bg-card/95 px-6 py-4 backdrop-blur">
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleFund}
              className="flex-1 bg-gradient-primary hover:shadow-glow"
              disabled={isLoading || fundAmount < 50 || fundAmount > remainingAmount}
            >
              {isLoading ? t('fundModal.processing') : `${paymentMethod === 'upi' ? `Pay with ${upiApps.find(app => app.id === selectedApp)?.name}` : 'Confirm Investment'} ${formatCurrency(fundAmount)}`}
            </Button>
          </div>

          <Button
            onClick={redirectToWhatsApp}
            variant="outline"
            className="w-full border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600"
            disabled={isLoading || fundAmount < 50 || fundAmount > remainingAmount}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {language === 'hi' ? 'WhatsApp पर संपर्क करें' : 'Contact via WhatsApp'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
