import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoanCard } from '@/components/LoanCard';
import { useAuth } from '@/contexts/AuthContext';
import { loansAPI, Loan } from '@/lib/api';
import { Search, Filter, TrendingUp, IndianRupee, Users, Target, Settings, Gift, BadgeCheck, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { SpeakerButton } from '@/components/SpeakerButton';
import { AudioSettings, AudioSettings as AudioSettingsType } from '@/components/AudioSettings';
import { AudioTest } from '@/components/AudioTest';

const Marketplace: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [interestRateFilter, setInterestRateFilter] = useState('all');
  const [collateralFilter, setCollateralFilter] = useState('all');
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoadingLoans, setIsLoadingLoans] = useState(true);
  const [audioSettings, setAudioSettings] = useState<AudioSettingsType>({
    enabled: true,
    rate: 0.9,
    pitch: 1,
    volume: 0.8,
    voice: 'default',
    autoPlay: false
  });
  const [showAudioSettings, setShowAudioSettings] = useState(false);

  const mapApiLoan = useCallback((loan: any): Loan => ({
    id: loan.id,
    amount: Number(loan.amount),
    purpose: loan.purpose,
    repaymentTerm: Number(loan.repaymentTerm),
    currentFunding: Number(loan.amountFunded ?? 0),
    status: loan.status,
    interestRate: loan.interestRate ?? 9,
    collateralRequired: loan.collateralRequired ?? false,
    collateralType: loan.collateralType,
    collateralValue: loan.collateralValue,
    borrower: {
      id: loan.borrower?.id ?? '',
      name: loan.borrower?.name ?? 'Borrower',
      trustScore: loan.borrower?.trustScore ?? 70,
      creditScore: loan.borrower?.creditScore,
    },
    createdAt: loan.createdAt,
    updatedAt: loan.updatedAt ?? loan.createdAt,
  }), []);

  const loadMarketplaceLoans = useCallback(async () => {
    setIsLoadingLoans(true);
    try {
      const response = await loansAPI.getAllLoans();
      setLoans((response.data.loans ?? []).map(mapApiLoan));
    } catch (error: any) {
      console.error('Failed to load marketplace loans:', error);
      toast({
        title: "Could not load marketplace",
        description: error.response?.data?.message || "Please refresh and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingLoans(false);
    }
  }, [mapApiLoan]);

  useEffect(() => {
    loadMarketplaceLoans();
  }, [loadMarketplaceLoans]);

  const handleFundLoan = async (loanId: string, amount: number) => {
    try {
      await loansAPI.fundLoan(loanId, amount);
      await loadMarketplaceLoans();

      toast({
        title: "Investment Successful",
        description: `You've successfully invested ₹${amount.toLocaleString('en-IN')} in this loan!`,
      });
    } catch (error: any) {
      console.error('Funding failed:', error);
      toast({
        title: "Investment Failed",
        description: error.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.borrower.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'pending' && loan.status === 'PENDING') ||
                         (filterBy === 'funding' && loan.status === 'FUNDING') ||
                         (filterBy === 'funded' && loan.status === 'FUNDED');
    
    const matchesInterestRate = interestRateFilter === 'all' ||
                               (interestRateFilter === 'low' && loan.interestRate <= 8.5) ||
                               (interestRateFilter === 'medium' && loan.interestRate > 8.5 && loan.interestRate <= 10.5) ||
                               (interestRateFilter === 'high' && loan.interestRate > 10.5);
    
    const matchesCollateral = collateralFilter === 'all' ||
                             (collateralFilter === 'yes' && loan.collateralRequired) ||
                             (collateralFilter === 'no' && !loan.collateralRequired);
    
    return matchesSearch && matchesFilter && matchesInterestRate && matchesCollateral;
  });

  const sortedLoans = [...filteredLoans].sort((a, b) => {
    switch (sortBy) {
      case 'amount-high':
        return b.amount - a.amount;
      case 'amount-low':
        return a.amount - b.amount;
      case 'trust-score':
        return b.borrower.trustScore - a.borrower.trustScore;
      case 'interest-rate-high':
        return b.interestRate - a.interestRate;
      case 'interest-rate-low':
        return a.interestRate - b.interestRate;
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const stats = [
    {
      label: 'Total Available',
      value: `₹${loans.reduce((sum, loan) => sum + (loan.amount - loan.currentFunding), 0).toLocaleString()}`,
      icon: <IndianRupee className="w-4 h-4" />,
      color: 'text-primary'
    },
    {
      label: 'Active Loans',
      value: loans.filter(loan => loan.status === 'FUNDING' || loan.status === 'PENDING').length.toString(),
      icon: <Target className="w-4 h-4" />,
      color: 'text-secondary'
    },
    {
      label: 'Avg. Return',
      value: loans.length > 0 ? `${(loans.reduce((sum, loan) => sum + loan.interestRate, 0) / loans.length).toFixed(1)}%` : '0%',
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'text-success'
    },
    {
      label: 'Borrowers',
      value: new Set(loans.map(loan => loan.borrower.id)).size.toString(),
      icon: <Users className="w-4 h-4" />,
      color: 'text-accent'
    }
  ];

  const bonusCards = [
    {
      title: 'First Funding Bonus',
      value: '₹150',
      description: 'Demo cashback on your next investment above ₹10,000.',
      icon: Gift,
      tone: 'text-primary',
      border: 'border-primary/20',
      bg: 'bg-primary/10',
    },
    {
      title: 'Diversify Badge',
      value: '3 Loans',
      description: 'Unlock a portfolio badge after funding three different borrowers.',
      icon: BadgeCheck,
      tone: 'text-success',
      border: 'border-success/20',
      bg: 'bg-success/10',
    },
    {
      title: 'Protected Pledge',
      value: 'UPI Ready',
      description: 'Pay through Google Pay, PhonePe, Paytm, BHIM, wallet, card, or bank.',
      icon: ShieldCheck,
      tone: 'text-blue-500',
      border: 'border-blue-500/20',
      bg: 'bg-blue-500/10',
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">Loan Marketplace</h1>
                <p className="text-muted-foreground">
                  {user?.role === 'LENDER' ? 
                    'Discover investment opportunities and fund loans to earn returns' :
                    'Browse available loans in our marketplace'
                  }
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setShowAudioSettings(!showAudioSettings)}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Audio</span>
                </Button>
                <SpeakerButton 
                  text={`Loan Marketplace. ${user?.role === 'LENDER' ? 
                    'Discover investment opportunities and fund loans to earn returns' :
                    'Browse available loans in our marketplace'
                  }`}
                  size="md"
                  variant="ghost"
                  className="flex-shrink-0"
                />
              </div>
            </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className={`${stat.color}`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Audio Settings Panel */}
      {showAudioSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="grid lg:grid-cols-2 gap-6">
            <AudioSettings
              onSettingsChange={setAudioSettings}
            />
            <AudioTest />
          </div>
        </motion.div>
      )}

      {user?.role === 'LENDER' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid md:grid-cols-3 gap-4"
        >
          {bonusCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title} className={`${card.bg} ${card.border}`}>
                <CardContent className="p-4">
                  <div className={`mb-3 flex items-center gap-2 ${card.tone}`}>
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{card.title}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{card.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>
      )}

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-gradient-card border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filter & Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search loans or borrowers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="amount-high">Highest Amount</SelectItem>
                  <SelectItem value="amount-low">Lowest Amount</SelectItem>
                  <SelectItem value="trust-score">Trust Score</SelectItem>
                  <SelectItem value="interest-rate-high">Highest Interest Rate</SelectItem>
                  <SelectItem value="interest-rate-low">Lowest Interest Rate</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Loans</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="funding">Funding</SelectItem>
                  <SelectItem value="funded">Funded</SelectItem>
                </SelectContent>
              </Select>

              <Select value={interestRateFilter} onValueChange={setInterestRateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Interest Rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rates</SelectItem>
                  <SelectItem value="low">Low (≤8.5%)</SelectItem>
                  <SelectItem value="medium">Medium (8.5-10.5%)</SelectItem>
                  <SelectItem value="high">High ({'>'}10.5%)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={collateralFilter} onValueChange={setCollateralFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Collateral" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Loans</SelectItem>
                  <SelectItem value="yes">Collateral Required</SelectItem>
                  <SelectItem value="no">No Collateral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Loans Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {isLoadingLoans ? (
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="py-12 text-center text-muted-foreground">
              Loading marketplace loans...
            </CardContent>
          </Card>
        ) : sortedLoans.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedLoans.map((loan, index) => (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <LoanCard 
                  loan={loan} 
                  showFundButton={user?.role === 'LENDER'}
                  onFund={handleFundLoan}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No loans found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setFilterBy('all');
                  setSortBy('newest');
                  setInterestRateFilter('all');
                  setCollateralFilter('all');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Investment Tips for Lenders */}
      {user?.role === 'LENDER' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-gradient-success/10 border-success/20">
            <CardHeader>
              <CardTitle className="text-success">💡 Investment Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Diversify Your Portfolio</h4>
                  <p className="text-muted-foreground">
                    Spread your investments across multiple loans to reduce risk
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Check Trust Scores</h4>
                  <p className="text-muted-foreground">
                    Higher trust scores indicate more reliable borrowers
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Start Small</h4>
                  <p className="text-muted-foreground">
                    Begin with smaller investments to test the waters
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Read Loan Purposes</h4>
                  <p className="text-muted-foreground">
                    Understand what borrowers plan to use the money for
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Marketplace;
