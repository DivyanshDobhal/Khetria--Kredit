import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { promisify } from 'util';
import { lookup } from 'dns';

dotenv.config();

const dnsLookup = promisify(lookup);

async function diagnoseConnection() {
  console.log('🔍 MongoDB Atlas Connection Diagnostic\n');
  
  const url = process.env.DATABASE_URL;
  console.log('📍 Connection String:');
  console.log(`   ${url.substring(0, 50)}...${url.substring(url.length - 30)}\n`);
  
  try {
    // Extract hostname for DNS check
    const match = url.match(/@(.+?)\//);
    if (!match) {
      throw new Error('Could not extract hostname from connection string');
    }
    const hostname = match[1];
    console.log(`🌐 Testing DNS resolution for: ${hostname}`);
    
    const { address } = await dnsLookup(hostname);
    console.log(`   ✅ Resolved to IP: ${address}\n`);
    
    // Test MongoDB connection
    console.log('🔐 Testing MongoDB connection...');
    const client = new MongoClient(url, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });
    
    await client.connect();
    console.log('   ✅ Connection successful!\n');
    
    // Get database info
    const adminDb = client.db('admin');
    const status = await adminDb.command({ serverStatus: 1 });
    
    console.log('📊 Server Information:');
    console.log(`   Version: ${status.version}`);
    console.log(`   Uptime: ${Math.floor(status.uptime / 3600)} hours\n`);
    
    // List databases
    const databases = await adminDb.listDatabases();
    console.log(`📑 Available Databases (${databases.databases.length}):`);
    databases.databases.forEach(db => {
      const size = (db.sizeOnDisk / 1024 / 1024).toFixed(2);
      console.log(`   - ${db.name} (${size} MB)`);
    });
    
    // Try to access kshetraKredit database
    console.log('\n📂 Accessing kshetraKredit database...');
    const kshetraDb = client.db('kshetraKredit');
    const collections = await kshetraDb.listCollections().toArray();
    console.log(`   ✅ Collections: ${collections.length}`);
    collections.forEach(col => {
      console.log(`      - ${col.name}`);
    });
    
    await client.close();
    console.log('\n✅ All checks passed! Database connection is working.');
    
  } catch (error) {
    console.error('\n❌ Connection diagnostic failed:\n');
    console.error(`Error: ${error.message}`);
    
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Go to https://cloud.mongodb.com');
    console.log('2. Select your cluster "khetria-kredit"');
    console.log('3. Click "Connect" → "Connect your application"');
    console.log('4. Copy the connection string and verify:');
    console.log('   - Username is correct');
    console.log('   - Password matches exactly (no special char escaping needed if in .env)');
    console.log('5. Go to "Network Access" and check if your IP is whitelisted:');
    console.log('   - Add 0.0.0.0/0 for development (allows all IPs)');
    console.log('   - Or click "Add Current IP Address" to auto-detect');
    console.log('6. Ensure cluster is running (not paused/terminated)');
    console.log('7. Re-run this diagnostic\n');
    
    process.exit(1);
  }
}

diagnoseConnection();
