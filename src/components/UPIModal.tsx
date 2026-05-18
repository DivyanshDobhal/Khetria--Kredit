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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/contexts/I18nContext';
import { useWallet } from '@/contexts/WalletContext';
import { Smartphone, CreditCard, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface UPIModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'add' | 'withdraw';
}

export const UPIModal: React.FC<UPIModalProps> = ({
  isOpen,
  onClose,
  type
}) => {
  const { language } = useI18n();
  const { wallet, addTransaction } = useWallet();
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedApp, setSelectedApp] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const upiApps = [
    { id: 'phonepe', name: 'PhonePe', color: 'bg-purple-500' },
    { id: 'gpay', name: 'Google Pay', color: 'bg-blue-500' },
    { id: 'paytm', name: 'Paytm', color: 'bg-blue-600' },
    { id: 'bharatpe', name: 'BharatPe', color: 'bg-orange-500' },
    { id: 'mobikwik', name: 'MobiKwik', color: 'bg-green-500' },
    { id: 'amazonpay', name: 'Amazon Pay', color: 'bg-orange-400' }
  ];

  const handleUPITransaction = async () => {
    const transactionAmount = parseFloat(amount);
    if (transactionAmount <= 0 || !upiId.trim() || !selectedApp) return;

    setIsProcessing(true);

    // Simulate UPI transaction processing
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate for demo

      if (success) {
        addTransaction({
          type: type === 'add' ? 'credit' : 'debit',
          amount: transactionAmount,
          description: `${type === 'add' ? 'UPI Add Money' : 'UPI Withdrawal'} via ${selectedApp}`,
          status: 'completed'
        });

        // Reset form
        setAmount('');
        setUpiId('');
        setSelectedApp('');
        onClose();
      } else {
        // Simulate failed transaction
        addTransaction({
          type: type === 'add' ? 'credit' : 'debit',
          amount: transactionAmount,
          description: `${type === 'add' ? 'UPI Add Money' : 'UPI Withdrawal'} via ${selectedApp} (Failed)`,
          status: 'failed'
        });
      }
      setIsProcessing(false);
    }, 2000);
  };

  const getTitle = () => {
    if (language === 'hi') {
      return type === 'add' ? 'UPI से पैसे जोड़ें' : 'UPI से पैसे निकालें';
    }
    return type === 'add' ? 'Add Money via UPI' : 'Withdraw via UPI';
  };

  const getDescription = () => {
    if (language === 'hi') {
      return type === 'add' 
        ? 'अपने वॉलेट में UPI के माध्यम से पैसे जोड़ें'
        : 'अपने वॉलेट से UPI के माध्यम से पैसे निकालें';
    }
    return type === 'add'
      ? 'Add money to your wallet using UPI'
      : 'Withdraw money from your wallet using UPI';
  };

  const getButtonText = () => {
    if (language === 'hi') {
      return type === 'add' ? 'पैसे जोड़ें' : 'पैसे निकालें';
    }
    return type === 'add' ? 'Add Money' : 'Withdraw Money';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-card">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-bold flex items-center space-x-2">
            <Smartphone className="w-6 h-6" />
            <span>{getTitle()}</span>
          </DialogTitle>
          <DialogDescription>
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Balance */}
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              {language === 'hi' ? 'वर्तमान बैलेंस' : 'Current Balance'}
            </p>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(wallet.balance)}
            </p>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">
              {language === 'hi' ? 'राशि' : 'Amount'}
            </Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={language === 'hi' ? 'राशि दर्ज करें' : 'Enter amount'}
                className="pl-10"
                min="1"
                max={type === 'withdraw' ? wallet.balance : undefined}
              />
            </div>
            {type === 'withdraw' && (
              <p className="text-xs text-muted-foreground">
                {language === 'hi' 
                  ? `अधिकतम: ${formatCurrency(wallet.balance)}`
                  : `Maximum: ${formatCurrency(wallet.balance)}`
                }
              </p>
            )}
          </div>

          {/* UPI ID Input */}
          <div className="space-y-2">
            <Label htmlFor="upi-id">
              {language === 'hi' ? 'UPI ID' : 'UPI ID'}
            </Label>
            <Input
              id="upi-id"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder={language === 'hi' ? 'example@paytm' : 'example@paytm'}
              className="font-mono"
            />
          </div>

          {/* UPI App Selection */}
          <div className="space-y-2">
            <Label>
              {language === 'hi' ? 'UPI ऐप चुनें' : 'Select UPI App'}
            </Label>
            <Select value={selectedApp} onValueChange={setSelectedApp}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'hi' ? 'ऐप चुनें' : 'Select app'} />
              </SelectTrigger>
              <SelectContent>
                {upiApps.map((app) => (
                  <SelectItem key={app.id} value={app.id}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${app.color}`}></div>
                      <span>{app.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* UPI Apps Grid */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              {language === 'hi' ? 'लोकप्रिय UPI ऐप्स' : 'Popular UPI Apps'}
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {upiApps.map((app) => (
                <motion.div
                  key={app.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    className={`w-full h-12 flex flex-col items-center space-y-1 ${
                      selectedApp === app.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedApp(app.id)}
                  >
                    <div className={`w-4 h-4 rounded-full ${app.color}`}></div>
                    <span className="text-xs">{app.name}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Transaction Summary */}
          {amount && upiId && selectedApp && (
            <motion.div 
              className="bg-gradient-success/10 rounded-lg p-4 space-y-2 border border-success/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-center space-x-2">
                {type === 'add' ? (
                  <ArrowDownLeft className="w-4 h-4 text-success" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-success" />
                )}
                <span className="font-medium text-success">
                  {language === 'hi' ? 'लेनदेन सारांश' : 'Transaction Summary'}
                </span>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {language === 'hi' ? 'राशि' : 'Amount'}
                  </span>
                  <span className="font-medium">{formatCurrency(parseFloat(amount) || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {language === 'hi' ? 'UPI ID' : 'UPI ID'}
                  </span>
                  <span className="font-mono text-xs">{upiId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {language === 'hi' ? 'ऐप' : 'App'}
                  </span>
                  <span className="font-medium">{upiApps.find(app => app.id === selectedApp)?.name}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
            >
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleUPITransaction}
              className="flex-1 bg-gradient-primary hover:shadow-glow"
              disabled={isProcessing || !amount || !upiId || !selectedApp || parseFloat(amount) <= 0 || (type === 'withdraw' && parseFloat(amount) > wallet.balance)}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {language === 'hi' ? 'प्रोसेसिंग...' : 'Processing...'}
                </>
              ) : (
                getButtonText()
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
