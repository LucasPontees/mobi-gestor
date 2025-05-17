import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Criar usuário admin
  const adminUser = await prisma.usuario.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      nome: 'admin',
      senha: await bcrypt.hash('admin123', 10),
      tipo: 'ADMIN',
      status: 'ACTIVE',
      // Criar bankroll junto com o usuário
      banca: {
        create: {
          valorInicial: 1000,
          valorAtual: 1000,
          riscoPercDiario: 1,
          multiplicadorRetorno: 2
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