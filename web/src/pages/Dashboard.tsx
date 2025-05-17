
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { BetForm } from "@/components/BetForm";
import { BetHistory } from "@/components/BetHistory";
import { BankStats } from "@/components/BankStats";
import { Bet, BankSettings } from "@/types";
import { useBankCalculation } from "@/hooks/useBankCalculation";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { user } = useAuth();
  const [bets, setBets] = useState<Bet[]>([]);
  const [bankSettings, setBankSettings] = useState<BankSettings>({
    initialValue: 1000,
    dailyPercentageRisk: 1,
    expectedReturnMultiplier: 2
  });

  // Carregar configurações e apostas do localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("bankSettings");
    if (savedSettings) {
      setBankSettings(JSON.parse(savedSettings));
    }

    const savedBets = localStorage.getItem("bets");
    if (savedBets) {
      setBets(JSON.parse(savedBets));
    }
  }, []);

  // Salvar configurações e apostas no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem("bankSettings", JSON.stringify(bankSettings));
  }, [bankSettings]);

  useEffect(() => {
    localStorage.setItem("bets", JSON.stringify(bets));
  }, [bets]);

  // Cálculos da banca
  const {
    currentBank,
    suggestedBetAmount,
    expectedProfit,
    totalProfit,
    totalBets,
    winRate,
    bankGrowthRate
  } = useBankCalculation({
    bets,
    settings: bankSettings
  });

  // Adicionar nova aposta
  const handleAddBet = (bet: Bet) => {
    setBets(prevBets => [...prevBets, bet]);
  };

  // Redirecionar para login se não houver usuário
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="container py-6 flex-1">
        <BankStats
          bets={bets}
          settings={bankSettings}
          currentBank={currentBank}
          suggestedBetAmount={suggestedBetAmount}
          expectedProfit={expectedProfit}
          totalProfit={totalProfit}
          totalBets={totalBets}
          winRate={winRate}
          bankGrowthRate={bankGrowthRate}
        />

        <div className="mt-8">
          <Tabs defaultValue="add-bet" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="add-bet">Nova Aposta</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>
            <TabsContent value="add-bet">
              <BetForm 
                suggestedAmount={suggestedBetAmount} 
                currentBank={currentBank} 
                onAddBet={handleAddBet} 
              />
            </TabsContent>
            <TabsContent value="history">
              <BetHistory bets={bets} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
