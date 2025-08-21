import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo users
  const user1Hash = await bcrypt.hash('password123', 12);
  const user2Hash = await bcrypt.hash('password123', 12);

  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      username: 'alice',
      passwordHash: user1Hash,
      rating: 1200,
      wallet: {
        create: {
          balance: 1000, // 1000 credits
          locked: 0,
        },
      },
    },
    include: { wallet: true },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      username: 'bob',
      passwordHash: user2Hash,
      rating: 1150,
      wallet: {
        create: {
          balance: 1000, // 1000 credits
          locked: 0,
        },
      },
    },
    include: { wallet: true },
  });

  // Add initial wallet transactions for the deposit
  await prisma.walletTransaction.createMany({
    data: [
      {
        userId: user1.id,
        walletId: user1.wallet!.id,
        type: 'DEPOSIT',
        amount: 1000,
        status: 'SUCCESS',
        ref: 'Initial seed balance',
      },
      {
        userId: user2.id,
        walletId: user2.wallet!.id,
        type: 'DEPOSIT',
        amount: 1000,
        status: 'SUCCESS',
        ref: 'Initial seed balance',
      },
    ],
  });

  console.log('✅ Seeding completed!');
  console.log('Demo users created:');
  console.log('- alice@example.com / password123 (1000 credits)');
  console.log('- bob@example.com / password123 (1000 credits)');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
