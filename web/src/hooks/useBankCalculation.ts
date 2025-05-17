
import { useState, useEffect } from 'react';
import { Bet, BankSettings } from '@/types';

interface UseBankCalculationProps {
  bets: Bet[];
  settings: BankSettings;
}

interface BankCalculationResult {
  currentBank: number;
  suggestedBetAmount: number;
  expectedProfit: number;
  totalProfit: number;
  totalBets: number;
  winRate: number;
  bankGrowthRate: number;
}

export function useBankCalculation({ 
  bets,
  settings
}: UseBankCalculationProps): BankCalculationResult {
  const [result, setResult] = useState<BankCalculationResult>({
    currentBank: settings.initialValue,
    suggestedBetAmount: settings.initialValue * (settings.dailyPercentageRisk / 100),
    expectedProfit: settings.initialValue * (settings.dailyPercentageRisk / 100) * settings.expectedReturnMultiplier,
    totalProfit: 0,
    totalBets: 0,
    winRate: 0,
    bankGrowthRate: 0
  });

  useEffect(() => {
    if (!bets.length) {
      setResult({
        currentBank: settings.initialValue,
        suggestedBetAmount: Number((settings.initialValue * (settings.dailyPercentageRisk / 100)).toFixed(2)),
        expectedProfit: Number((settings.initialValue * (settings.dailyPercentageRisk / 100) * settings.expectedReturnMultiplier).toFixed(2)),
        totalProfit: 0,
        totalBets: 0,
        winRate: 0,
        bankGrowthRate: 0
      });
      return;
    }

    // Ordena apostas por data
    const sortedBets = [...bets].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calcula banco atual baseado no histórico de apostas
    const currentBank = sortedBets[sortedBets.length - 1].bankAfterBet;
    
    // Calcula win rate
    const completedBets = sortedBets.filter(bet => bet.result !== 'pending');
    const winningBets = completedBets.filter(bet => bet.result === 'green');
    const winRate = completedBets.length > 0 
      ? (winningBets.length / completedBets.length) * 100 
      : 0;
    
    // Calcula lucro total
    const totalProfit = currentBank - settings.initialValue;
    
    // Calcula a taxa de crescimento da banca
    const bankGrowthRate = settings.initialValue > 0 
      ? ((currentBank / settings.initialValue) - 1) * 100 
      : 0;
    
    // Calcula o valor sugerido para a próxima aposta (1% da banca atual)
    const suggestedBetAmount = Number((currentBank * (settings.dailyPercentageRisk / 100)).toFixed(2));
    
    // Calcula o lucro esperado da próxima aposta (valor sugerido * multiplicador de retorno esperado)
    const expectedProfit = Number((suggestedBetAmount * settings.expectedReturnMultiplier).toFixed(2));

    setResult({
      currentBank,
      suggestedBetAmount,
      expectedProfit,
      totalProfit,
      totalBets: completedBets.length,
      winRate,
      bankGrowthRate
    });
  }, [bets, settings]);

  return result;
}
