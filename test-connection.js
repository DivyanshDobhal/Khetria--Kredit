import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const maskDatabaseUrl = (url) =>
  url.replace(/(mongodb(?:\+srv)?:\/\/)(.*?)(@)/, '$1***:***$3');

async function testConnection() {
  try {
    console.log('🔍 Testing MongoDB Atlas connection...');
    console.log(`📍 Database URL: ${maskDatabaseUrl(process.env.DATABASE_URL)}`);
    
    // Test raw database connection
    const result = await prisma.$runCommandRaw({ ping: 1 });
    
    console.log('✅ Connection successful!');
    console.log('📊 Ping response:', result);
    
    // Get database stats
    const stats = await prisma.$runCommandRaw({ dbStats: 1 });
    console.log('\n📈 Database Statistics:');
    console.log(`   Database: ${stats.db}`);
    console.log(`   Collections: ${stats.collections}`);
    console.log(`   Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
    
    // Count collections
    const collections = await prisma.$runCommandRaw({ listCollections: 1 });
    console.log(`\n📑 Collections (${collections.cursor.firstBatch.length}):`);
    collections.cursor.firstBatch.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('\n⚠️ Possible causes:');
    console.error('   1. Wrong username or password in DATABASE_URL');
    console.error('   2. IP address not whitelisted in MongoDB Atlas');
    console.error('   3. Network connectivity issue');
    console.error('   4. Cluster not running or suspended');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
