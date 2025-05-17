
import { useState, useEffect } from 'react';
import { Bet, User, AdminStats, PopularTeam, PopularBetType, UserPerformance } from '@/types';
import { subDays, isAfter, format } from 'date-fns';

interface UseAdminStatsProps {
  bets: Bet[];
  users: User[];
}

export function useAdminStats({ bets, users }: UseAdminStatsProps): AdminStats {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalBets: 0,
    totalProfit: 0,
    winRate: 0,
    popularTeams: [],
    popularBetTypes: [],
    userPerformance: []
  });

  useEffect(() => {
    if (!bets.length || !users.length) {
      return;
    }

    const now = new Date();
    const dayAgo = subDays(now, 1);
    const weekAgo = subDays(now, 7);
    const monthAgo = subDays(now, 30);

    // Filtrar apostas por período
    const betsToday = bets.filter(bet => isAfter(new Date(bet.date), dayAgo));
    const betsThisWeek = bets.filter(bet => isAfter(new Date(bet.date), weekAgo));
    const betsThisMonth = bets.filter(bet => isAfter(new Date(bet.date), monthAgo));

    // Calcular times mais populares
    const popularTeams: PopularTeam[] = [
      ...getPopularTeams(betsToday, 'day'),
      ...getPopularTeams(betsThisWeek, 'week'),
      ...getPopularTeams(betsThisMonth, 'month'),
      ...getPopularTeams(bets, 'all')
    ];

    // Calcular tipos de apostas mais populares
    const betTypesCount: Record<string, number> = {};
    bets.forEach(bet => {
      betTypesCount[bet.betType] = (betTypesCount[bet.betType] || 0) + 1;
    });

    const popularBetTypes: PopularBetType[] = Object.entries(betTypesCount)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    // Calcular performance por usuário
    const userPerformance: UserPerformance[] = users.map(user => {
      const userBets = bets.filter(bet => bet.userId === user.id);
      const completedBets = userBets.filter(bet => bet.result !== 'pending');
      const greenBets = completedBets.filter(bet => bet.result === 'green').length;
      const redBets = completedBets.filter(bet => bet.result === 'red').length;
      const winRate = completedBets.length > 0 
        ? (greenBets / completedBets.length) * 100 
        : 0;
      
      const profit = userBets.reduce((total, bet) => {
        return total + (bet.profit || 0);
      }, 0);

      return {
        userId: user.id,
        username: user.username,
        totalBets: userBets.length,
        greenBets,
        redBets,
        winRate,
        profit
      };
    });

    // Calcular estatísticas gerais
    const completedBets = bets.filter(bet => bet.result !== 'pending');
    const greenBets = completedBets.filter(bet => bet.result === 'green').length;
    const winRate = completedBets.length > 0 
      ? (greenBets / completedBets.length) * 100 
      : 0;
    
    const totalProfit = bets.reduce((total, bet) => {
      return total + (bet.profit || 0);
    }, 0);

    setStats({
      totalUsers: users.length,
      totalBets: bets.length,
      totalProfit,
      winRate,
      popularTeams,
      popularBetTypes,
      userPerformance
    });
  }, [bets, users]);

  function getPopularTeams(filteredBets: Bet[], period: 'day' | 'week' | 'month' | 'all'): PopularTeam[] {
    const teamsCount: Record<string, number> = {};
    
    filteredBets.forEach(bet => {
      teamsCount[bet.team1] = (teamsCount[bet.team1] || 0) + 1;
      teamsCount[bet.team2] = (teamsCount[bet.team2] || 0) + 1;
    });

    return Object.entries(teamsCount)
      .map(([teamName, count]) => ({ teamName, count, period }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5
  }

  return stats;
}
