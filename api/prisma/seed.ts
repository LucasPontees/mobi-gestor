import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Criar usuário admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
      status: 'ACTIVE',
      // Criar bankroll junto com o usuário
      bankroll: {
        create: {
          initialAmount: 1000,
          currentAmount: 1000,
          dailyRiskPerc: 1,
          returnMultiplier: 2
        }
      }
    }
  });

  console.log({ adminUser });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });