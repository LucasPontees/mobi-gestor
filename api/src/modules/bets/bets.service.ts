import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBetDto, UpdateBetResultDto } from './dto/bet.dto';

@Injectable()
export class BetsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBetDto) {
    // Verificar se o usuário tem uma bankroll
    const bankroll = await this.prisma.bankroll.findUnique({
      where: { userId }
    });

    if (!bankroll) {
      throw new Error('User has no bankroll configured');
    }

    // Criar a aposta
    const bet = await this.prisma.bet.create({
      data: {
        userId,
        description: `${dto.team1} x ${dto.team2} - ${dto.betType}`,
        amount: dto.amount,
        odds: 2.0, // Odds padrão, ajuste conforme necessário
        status: 'PENDING',
        bankBeforeBet: dto.bankBeforeBet
      }
    });

    // Atualizar a bankroll (subtrair o valor da aposta)
    await this.prisma.bankroll.update({
      where: { userId },
      data: {
        currentAmount: bankroll.currentAmount - dto.amount
      }
    });

    return bet;
  }

  async updateResult(userId: string, betId: string, dto: UpdateBetResultDto) {
    // Buscar a aposta
    const bet = await this.prisma.bet.findFirst({
      where: { id: betId, userId }
    });

    if (!bet) {
      throw new NotFoundException('Bet not found');
    }

    // Calcular o resultado
    const profit = dto.result === 'green' 
      ? dto.profit || 0 // Lucro informado ou 0
      : -bet.amount; // Prejuízo é o valor da aposta

    // Atualizar a bankroll
    const bankroll = await this.prisma.bankroll.findUnique({
      where: { userId }
    });

    if (!bankroll) {
      throw new Error('User has no bankroll configured');
    }

    // Atualizar a aposta e a bankroll em uma transação
    return this.prisma.$transaction([
      // Atualizar a aposta
      this.prisma.bet.update({
        where: { id: betId },
        data: {
          status: 'SETTLED',
          result: dto.result === 'green' ? 'WIN' : 'LOSS',
          bankAfterBet: bankroll.currentAmount + profit
        }
      }),
      // Atualizar a bankroll
      this.prisma.bankroll.update({
        where: { userId },
        data: {
          currentAmount: bankroll.currentAmount + profit
        }
      })
    ]);
  }

  async getUserBets(userId: string) {
    return this.prisma.bet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getBetStats(userId: string) {
    const bets = await this.prisma.bet.findMany({
      where: { 
        userId,
        status: 'SETTLED'
      }
    });

    const totalBets = bets.length;
    const wins = bets.filter(bet => bet.result === 'WIN').length;
    const losses = bets.filter(bet => bet.result === 'LOSS').length;
    const winRate = totalBets > 0 ? (wins / totalBets) * 100 : 0;

    const profit = bets.reduce((acc, bet) => {
      if (bet.result === 'WIN') {
        return acc + (bet.amount * (bet.odds - 1));
      } else {
        return acc - bet.amount;
      }
    }, 0);

    return {
      totalBets,
      wins,
      losses,
      winRate,
      profit
    };
  }
} 