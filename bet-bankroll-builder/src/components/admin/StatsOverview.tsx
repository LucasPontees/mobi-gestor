
import { AdminStats } from '@/types';
import { SummaryCards } from './SummaryCards';
import { TeamChart } from './TeamChart';
import { BetTypesPieChart } from './BetTypesPieChart';
import { UserPerformanceTable } from './UserPerformanceTable';

interface StatsOverviewProps {
  stats: AdminStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const { totalUsers, totalBets, totalProfit, winRate, popularTeams, popularBetTypes, userPerformance } = stats;

  // Prepare data for charts
  const popularTeamsToday = popularTeams
    .filter(team => team.period === 'day')
    .map(team => ({
      name: team.teamName,
      value: team.count,
    }));

  const popularTeamsWeek = popularTeams
    .filter(team => team.period === 'week')
    .map(team => ({
      name: team.teamName,
      value: team.count,
    }));

  const betTypeData = popularBetTypes.slice(0, 5).map(type => ({
    name: type.type,
    value: type.count,
  }));

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <SummaryCards 
        totalUsers={totalUsers} 
        totalBets={totalBets} 
        totalProfit={totalProfit} 
        winRate={winRate} 
      />

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <TeamChart 
          title="Times Mais Apostados (Hoje)" 
          data={popularTeamsToday} 
          color="#8884d8" 
        />
        
        <TeamChart 
          title="Times Mais Apostados (Semana)" 
          data={popularTeamsWeek}
          color="#82ca9d" 
        />
        
        <BetTypesPieChart data={betTypeData} />
        
        <UserPerformanceTable userPerformance={userPerformance} />
      </div>
    </div>
  );
}
