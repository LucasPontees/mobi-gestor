export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  status: 'ACTIVE' | 'INACTIVE';
}

export type BetResult = 'green' | 'red' | 'pending';

export interface Bet {
  id: string;
  date: Date;
  team1: string;
  team2: string;
  betType: string;
  suggestedAmount: number;
  actualAmount?: number;
  odds: number;
  result: BetResult;
  profit?: number;
  bankBeforeBet: number;
  bankAfterBet?: number;
  userId: string;
}

export interface BankSettings {
  initialValue: number;
  dailyPercentageRisk: number;
  expectedReturnMultiplier: number;
}

// Interfaces para estatísticas do admin
export interface AdminStats {
  totalUsers: number;
  totalBets: number;
  totalProfit: number;
  winRate: number;
  popularTeams: PopularTeam[];
  popularBetTypes: PopularBetType[];
  userPerformance: UserPerformance[];
}

export interface PopularTeam {
  teamName: string;
  count: number;
  period: 'day' | 'week' | 'month' | 'all';
}

export interface PopularBetType {
  type: string;
  count: number;
}

export interface UserPerformance {
  userId: string;
  username: string;
  totalBets: number;
  greenBets: number;
  redBets: number;
  winRate: number;
  profit: number;
}
