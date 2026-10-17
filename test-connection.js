import dotenv from 'dotenv';
import { prisma, getDatabaseUrl, checkDatabaseConnection } from './src/backend/utils/prisma.js';

dotenv.config();

const maskDatabaseUrl = (url) => {
  if (!url) return 'UNDEFINED';
  return url.replace(/(mongodb(?:\+srv)?:\/\/)(.*?)(@)/, '$1***:***$3');
};

async function testConnection() {
  try {
    const rawUrl = process.env.DATABASE_URL || process.env.MONGODB_URI;
    const resolvedUrl = getDatabaseUrl();

    console.log('🔍 Testing MongoDB Atlas connection...');
    console.log(`📍 Configured Database URL: ${maskDatabaseUrl(rawUrl)}`);
    console.log(`🎯 Normalized Connection URL: ${maskDatabaseUrl(resolvedUrl)}`);

    const health = await checkDatabaseConnection();
    if (!health.connected) {
      throw new Error(health.error);
    }

    console.log(`✅ Connection successful! (Latency: ${health.latencyMs}ms)`);
    console.log('📊 Ping response:', health.ping);

    // Get database stats
    const stats = await prisma.$runCommandRaw({ dbStats: 1 });
    console.log('\n📈 Database Statistics:');
    console.log(`   Database: ${stats.db}`);
    console.log(`   Collections: ${stats.collections}`);
    console.log(`   Data Size: ${((stats.dataSize || 0) / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Storage Size: ${((stats.storageSize || 0) / 1024 / 1024).toFixed(2)} MB`);

    // Count collections
    const collections = await prisma.$runCommandRaw({ listCollections: 1 });
    const batch = collections?.cursor?.firstBatch || [];
    console.log(`\n📑 Collections (${batch.length}):`);
    batch.forEach((col) => {
      console.log(`   - ${col.name}`);
    });

    // Check user count
    const userCount = await prisma.user.count();
    const loanCount = await prisma.loanRequest.count();
    console.log(`\n👥 Application Records:`);
    console.log(`   - Users: ${userCount}`);
    console.log(`   - Loan Requests: ${loanCount}`);

    console.log('\n🎉 Database is fully verified and ready for production!');
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('\n⚠️ Possible causes:');
    console.error('   1. Missing or invalid database name in connection string');
    console.error('   2. Wrong username or password in DATABASE_URL / MONGODB_URI');
    console.error('   3. IP address not whitelisted in MongoDB Atlas (allow 0.0.0.0/0 for Vercel serverless)');
    console.error('   4. Cluster not running or suspended');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
