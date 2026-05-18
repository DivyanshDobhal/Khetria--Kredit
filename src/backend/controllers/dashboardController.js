import { PrismaClient } from '@prisma/client';
import { getMessage } from '../utils/i18n.js';

const prisma = new PrismaClient();

// Get borrower's loans
const getMyLoans = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const whereClause = {
      borrowerId: req.user.id,
      ...(status && { status })
    };

    const [loans, total] = await Promise.all([
      prisma.loanRequest.findMany({
        where: whereClause,
        include: {
          borrower: {
            select: {
              id: true,
              name: true,
              email: true,
              creditScore: true,
              trustScore: true
            }
          },
          fundings: {
            include: {
              lender: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          repayments: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: parseInt(limit)
      }),
      prisma.loanRequest.count({ where: whereClause })
    ]);

    // Calculate additional metrics for each loan
    const loansWithMetrics = loans.map(loan => {
      const fundingProgress = (loan.amountFunded / loan.amount) * 100;
      const totalRepaid = loan.repayments
        .filter(repayment => repayment.status === 'PAID')
        .reduce((sum, repayment) => sum + repayment.amount, 0);
      
      return {
        ...loan,
        fundingProgress: Math.round(fundingProgress * 100) / 100,
        totalRepaid,
        remainingAmount: loan.amount - totalRepaid
      };
    });

    res.json({
      loans: loansWithMetrics,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get my loans error:', error);
    res.status(500).json({ 
      message: getMessage('server.error', req.language) 
    });
  }
};

// Get lender's investments
const getMyInvestments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const [investments, total] = await Promise.all([
      prisma.funding.findMany({
        where: { lenderId: req.user.id },
        include: {
          loanRequest: {
            include: {
              borrower: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              },
              fundings: {
                include: {
                  lender: {
                    select: {
                      id: true,
                      name: true
                    }
                  }
                }
              },
              repayments: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: parseInt(limit)
      }),
      prisma.funding.count({ where: { lenderId: req.user.id } })
    ]);

    // Calculate investment metrics
    const investmentsWithMetrics = investments.map(investment => {
      const loan = investment.loanRequest;
      const fundingProgress = (loan.amountFunded / loan.amount) * 100;
      const totalRepaid = loan.repayments
        .filter(repayment => repayment.status === 'PAID')
        .reduce((sum, repayment) => sum + repayment.amount, 0);
      
      // Calculate expected return based on funding percentage
      const fundingPercentage = investment.amount / loan.amount;
      const expectedReturn = totalRepaid * fundingPercentage;
      
      return {
        ...investment,
        loanRequest: {
          ...loan,
          fundingProgress: Math.round(fundingProgress * 100) / 100,
          totalRepaid,
          remainingAmount: loan.amount - totalRepaid
        },
        expectedReturn: Math.round(expectedReturn * 100) / 100,
        returnPercentage: loan.amount > 0 ? Math.round((expectedReturn / investment.amount) * 100 * 100) / 100 : 0
      };
    });

    res.json({
      investments: investmentsWithMetrics,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get my investments error:', error);
    res.status(500).json({ 
      message: getMessage('server.error', req.language) 
    });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    if (req.user.role === 'BORROWER') {
      // Borrower statistics
      const [
        totalLoans,
        activeLoans,
        fundedLoans,
        totalBorrowed,
        totalRepaid
      ] = await Promise.all([
        prisma.loanRequest.count({ where: { borrowerId: req.user.id } }),
        prisma.loanRequest.count({ 
          where: { 
            borrowerId: req.user.id,
            status: { in: ['PENDING', 'FUNDING', 'FUNDED'] }
          }
        }),
        prisma.loanRequest.count({ 
          where: { 
            borrowerId: req.user.id,
            status: 'FUNDED'
          }
        }),
        prisma.loanRequest.aggregate({
          where: { borrowerId: req.user.id },
          _sum: { amount: true }
        }),
        prisma.repayment.aggregate({
          where: {
            loanRequest: { borrowerId: req.user.id },
            status: 'PAID'
          },
          _sum: { amount: true }
        })
      ]);

      res.json({
        totalLoans,
        activeLoans,
        fundedLoans,
        totalBorrowed: totalBorrowed._sum.amount || 0,
        totalRepaid: totalRepaid._sum.amount || 0,
        outstandingAmount: (totalBorrowed._sum.amount || 0) - (totalRepaid._sum.amount || 0)
      });
    } else {
      // Lender statistics
      const [
        totalInvestments,
        activeInvestments,
        totalInvested,
        totalReturns
      ] = await Promise.all([
        prisma.funding.count({ where: { lenderId: req.user.id } }),
        prisma.funding.count({
          where: {
            lenderId: req.user.id,
            loanRequest: {
              status: { in: ['FUNDED', 'FUNDING'] }
            }
          }
        }),
        prisma.funding.aggregate({
          where: { lenderId: req.user.id },
          _sum: { amount: true }
        }),
        prisma.repayment.aggregate({
          where: {
            loanRequest: {
              fundings: {
                some: { lenderId: req.user.id }
              }
            },
            status: 'PAID'
          },
          _sum: { amount: true }
        })
      ]);

      res.json({
        totalInvestments,
        activeInvestments,
        totalInvested: totalInvested._sum.amount || 0,
        totalReturns: totalReturns._sum.amount || 0,
        netProfit: (totalReturns._sum.amount || 0) - (totalInvested._sum.amount || 0)
      });
    }
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ 
      message: getMessage('server.error', req.language) 
    });
  }
};

export {
  getMyLoans,
  getMyInvestments,
  getDashboardStats
};
