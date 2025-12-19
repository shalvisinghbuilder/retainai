import { PrismaClient } from '@retainai/db';
import { sign } from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Read JWT secret from .env file
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const jwtSecretMatch = envContent.match(/JWTSECRET=(.+)/);
const secret = jwtSecretMatch ? jwtSecretMatch[1].trim() : '';

if (!secret) {
  console.error('❌ JWTSECRET not found in .env file');
  process.exit(1);
}

async function generateTestLink() {
  try {
    // Get the first candidate in VJTPENDING status (from test data)
    const candidate = await prisma.candidate.findFirst({
      where: { status: 'VJTPENDING' },
      orderBy: { createdAt: 'desc' },
    });

    if (!candidate) {
      console.error('❌ No candidate in VJTPENDING status found');
      console.log('\n💡 To create a test candidate:');
      console.log('   1. Send SMS to Twilio number to start Eva Bot conversation');
      console.log('   2. Complete screening (name, age, lift confirmation)');
      console.log('   3. Eva Bot will send VJT link\n');
      process.exit(1);
    }

    // Generate nonce (same logic as NonceService)
    const payload = {
      candidateId: candidate.id,
      type: 'vjt',
    };
    const nonce = sign(payload, secret, { expiresIn: '24h' });

    const url = `http://localhost:3001?candidate=${candidate.id}&nonce=${nonce}`;

    console.log('\n✅ Test VJT Link Generated:\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(url);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📋 Details:');
    console.log(`   Candidate: ${candidate.name || candidate.phone}`);
    console.log(`   Candidate ID: ${candidate.id}`);
    console.log(`   Status: ${candidate.status}`);
    console.log(`   Nonce expires: 24 hours from now\n`);
    console.log('💡 Copy and paste this URL in your browser to test the VJT app.\n');

    await prisma.$disconnect();
  } catch (error: any) {
    console.error('❌ Error generating test link:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

generateTestLink();

