import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Loan purposes for realistic data
const loanPurposes = [
  'Education expenses for my child',
  'Medical emergency treatment',
  'Small business expansion',
  'Home renovation project',
  'Debt consolidation',
  'Wedding expenses',
  'Vehicle purchase',
  'Agricultural equipment',
  'Emergency fund',
  'Technology upgrade for business',
  'Home appliance purchase',
  'Travel for family emergency',
  'Starting a new business',
  'Educational course fees',
  'Home repair after natural disaster'
];

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clean existing data
    console.log('🧹 Cleaning existing data...');
    try {
      // Attempt to drop the entire database (works on Atlas and avoids transaction requirements)
      await prisma.$runCommandRaw({ dropDatabase: 1 });
      console.log('✅ Database dropped');
    } catch (dropErr) {
      console.warn('⚠️ Could not drop database, falling back to deleteMany:', dropErr.message || dropErr);
      await prisma.repayment.deleteMany();
      await prisma.funding.deleteMany();
      await prisma.loanRequest.deleteMany();
      await prisma.user.deleteMany();
      console.log('✅ Existing data cleaned (fallback)');
    }

    // Create users
    console.log('👥 Creating users...');
    const users = [];
    
    // Create 120 borrowers
    for (let i = 0; i < 120; i++) {
      const hashedPassword = await bcrypt.hash('password123', 12);
      const user = await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: hashedPassword,
          role: 'BORROWER',
          creditScore: faker.number.int({ min: 300, max: 850 }),
          trustScore: faker.number.int({ min: 50, max: 100 })
        }
      });
      users.push(user);
    }
    console.log(`✅ Created ${users.length} borrowers`);

    // Create 30 lenders
    const lenders = [];
    for (let i = 0; i < 30; i++) {
      const hashedPassword = await bcrypt.hash('password123', 12);
      const user = await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: hashedPassword,
          role: 'LENDER',
          creditScore: faker.number.int({ min: 300, max: 850 }),
          trustScore: faker.number.int({ min: 50, max: 100 })
        }
      });
      lenders.push(user);
    }
    console.log(`✅ Created ${lenders.length} lenders`);

    // Create loan requests
    console.log('💰 Creating loan requests...');
    const loanRequests = [];
    const borrowersForLoans = faker.helpers.arrayElements(users, 80);
    
    for (const borrower of borrowersForLoans) {
      const amount = faker.number.float({ min: 2000, max: 100000, fractionDigits: 2 });
      const repaymentTerm = faker.number.int({ min: 3, max: 12 });
      
      const loanRequest = await prisma.loanRequest.create({
        data: {
          amount,
          purpose: faker.helpers.arrayElement(loanPurposes),
          repaymentTerm,
          borrowerId: borrower.id
        }
      });
      loanRequests.push(loanRequest);
    }
    console.log(`✅ Created ${loanRequests.length} loan requests`);

    // Simulate funding
    console.log('💸 Simulating funding...');
    const loansToFund = faker.helpers.arrayElements(loanRequests, 50);
    let totalFundings = 0;

    for (const loan of loansToFund) {
      const numLenders = faker.number.int({ min: 1, max: 5 });
      const selectedLenders = faker.helpers.arrayElements(lenders, numLenders);
      
      let totalFunded = 0;
      const fundings = [];

      for (const lender of selectedLenders) {
        const remainingAmount = loan.amount - totalFunded;
        if (remainingAmount <= 0) break;

        const maxFundingAmount = Math.min(remainingAmount, loan.amount / numLenders * 2);
        const fundingAmount = faker.number.float({ 
          min: Math.min(100, remainingAmount), 
          max: maxFundingAmount, 
          fractionDigits: 2 
        });

        const funding = await prisma.funding.create({
          data: {
            amount: fundingAmount,
            lenderId: lender.id,
            loanRequestId: loan.id
          }
        });

        fundings.push(funding);
        totalFunded += fundingAmount;
        totalFundings++;
      }

      // Update loan status and amount funded
      const status = totalFunded >= loan.amount ? 'FUNDED' : 'FUNDING';
      await prisma.loanRequest.update({
        where: { id: loan.id },
        data: {
          amountFunded: totalFunded,
          status
        }
      });
    }
    console.log(`✅ Created ${totalFundings} funding records`);

    // Create some repayments for funded loans
    console.log('💳 Creating repayments...');
    const fundedLoans = await prisma.loanRequest.findMany({
      where: { status: 'FUNDED' },
      take: 20
    });

    let totalRepayments = 0;
    for (const loan of fundedLoans) {
      const monthlyPayment = loan.amount / loan.repaymentTerm;
      const numPayments = faker.number.int({ min: 1, max: loan.repaymentTerm });
      
      for (let i = 0; i < numPayments; i++) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + i + 1);
        
        const isPaid = faker.datatype.boolean({ probability: 0.7 });
        const status = isPaid ? 'PAID' : 'PENDING';
        
        await prisma.repayment.create({
          data: {
            amount: monthlyPayment,
            dueDate,
            status,
            loanRequestId: loan.id
          }
        });
        totalRepayments++;
      }
    }
    console.log(`✅ Created ${totalRepayments} repayments`);

    // Display summary
    console.log('\n📊 Seeding Summary:');
    console.log(`👥 Total Users: ${users.length + lenders.length}`);
    console.log(`   - Borrowers: ${users.length}`);
    console.log(`   - Lenders: ${lenders.length}`);
    console.log(`💰 Loan Requests: ${loanRequests.length}`);
    console.log(`💸 Fundings: ${totalFundings}`);
    console.log(`💳 Repayments: ${totalRepayments}`);
    
    const fundedLoansCount = await prisma.loanRequest.count({ where: { status: 'FUNDED' } });
    const fundingLoansCount = await prisma.loanRequest.count({ where: { status: 'FUNDING' } });
    const pendingLoansCount = await prisma.loanRequest.count({ where: { status: 'PENDING' } });
    
    console.log(`📈 Loan Status Distribution:`);
    console.log(`   - Funded: ${fundedLoansCount}`);
    console.log(`   - Funding: ${fundingLoansCount}`);
    console.log(`   - Pending: ${pendingLoansCount}`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n🔐 Test Credentials:');
    console.log('   Email: Any email from the seeded users');
    console.log('   Password: password123');
    console.log('   Roles: BORROWER or LENDER');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
