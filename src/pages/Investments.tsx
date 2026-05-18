import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrustScoreBadge } from '@/components/TrustScoreBadge';
import { ProgressBar } from '@/components/ProgressBar';
import { useAuth } from '@/contexts/AuthContext';
import { Investment, dummyLoans } from '@/lib/api';
import { TrendingUp, Calendar, Target, Wallet, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

const Investments: React.FC = () => {
  const { user } = useAuth();

  // Mock investment data
  const investments: Investment[] = [
    {
      id: '1',
      amount: 2500,
      loan: dummyLoans[0],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      returns: 185.50
    },
    {
      id: '2',
      amount: 1500,
      loan: dummyLoans[2],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      returns: 320.25
    }
  ];

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalReturns = investments.reduce((sum, inv) => sum + inv.returns, 0);
  const portfolioValue = totalInvested + totalReturns;
  const averageReturn = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-muted text-muted-foreground';
      case 'FUNDING':
        return 'bg-primary/10 text-primary';
      case 'FUNDED':
        return 'bg-success/10 text-success';
      case 'REPAID':
        return 'bg-accent/10 text-accent';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const stats = [
    {
      label: 'Total Invested',
      value: formatCurrency(totalInvested),
      icon: <Wallet className="w-4 h-4" />,
      color: 'text-primary'
    },
    {
      label: 'Total Returns',
      value: formatCurrency(totalReturns),
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'text-success'
    },
    {
      label: 'Portfolio Value',
      value: formatCurrency(portfolioValue),
      icon: <PieChart className="w-4 h-4" />,
      color: 'text-secondary'
    },
    {
      label: 'Avg. Return',
      value: `${averageReturn.toFixed(1)}%`,
      icon: <Target className="w-4 h-4" />,
      color: 'text-accent'
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Investments</h1>
          <p className="text-muted-foreground">
            Track your loan investments and portfolio performance
          </p>
        </div>

        {/* Portfolio Overview */}
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

      {/* Performance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-gradient-success/10 border-success/20 mb-8">
          <CardHeader>
            <CardTitle className="text-success flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Portfolio Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-1">
                  +{((totalReturns / totalInvested) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Total Return Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">
                  {investments.length}
                </div>
                <div className="text-sm text-muted-foreground">Active Investments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">
                  8.2%
                </div>
                <div className="text-sm text-muted-foreground">Expected Annual Return</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Investment List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-foreground mb-6">My Investment Portfolio</h2>
        
        {investments.length > 0 ? (
          <div className="space-y-6">
            {investments.map((investment, index) => (
              <motion.div
                key={investment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="bg-gradient-card border-border/50 hover:shadow-elevated transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
                      {/* Loan Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {investment.loan.purpose}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-muted-foreground text-sm">
                                by {investment.loan.borrower.name}
                              </span>
                              <TrustScoreBadge score={investment.loan.borrower.trustScore} size="sm" />
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(investment.loan.status)} text-xs`}>
                            {investment.loan.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">My Investment</span>
                            <p className="font-semibold text-foreground">
                              {formatCurrency(investment.amount)}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Loan Amount</span>
                            <p className="font-semibold text-foreground">
                              {formatCurrency(investment.loan.amount)}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Term</span>
                            <p className="font-semibold text-foreground">
                              {investment.loan.repaymentTerm} months
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Invested Date</span>
                            <p className="font-semibold text-foreground">
                              {new Date(investment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <ProgressBar 
                          current={investment.loan.currentFunding}
                          target={investment.loan.amount}
                          animated={false}
                        />
                      </div>

                      {/* Returns Info */}
                      <div className="lg:w-48 space-y-3">
                        <div className="text-center lg:text-right">
                          <div className="text-xs text-muted-foreground mb-1">Returns Earned</div>
                          <div className="text-2xl font-bold text-success">
                            +{formatCurrency(investment.returns)}
                          </div>
                          <div className="text-xs text-success">
                            +{((investment.returns / investment.amount) * 100).toFixed(1)}% ROI
                          </div>
                        </div>

                        <div className="text-center lg:text-right">
                          <div className="text-xs text-muted-foreground mb-1">Total Value</div>
                          <div className="text-lg font-semibold text-foreground">
                            {formatCurrency(investment.amount + investment.returns)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No investments yet</h3>
              <p className="text-muted-foreground mb-4">
                Start investing in loans to build your portfolio and earn returns
              </p>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Investment Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5" />
              <span>Investment Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-2 flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Next Steps</span>
                </h4>
                <p className="text-muted-foreground">
                  Consider diversifying into different loan categories to spread risk
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span>Performance</span>
                </h4>
                <p className="text-muted-foreground">
                  Your portfolio is performing above average with consistent returns
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center space-x-2">
                  <Target className="w-4 h-4 text-accent" />
                  <span>Risk Level</span>
                </h4>
                <p className="text-muted-foreground">
                  Current risk level: Moderate. Consider high-trust score borrowers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Investments;
