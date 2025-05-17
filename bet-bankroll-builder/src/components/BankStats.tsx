
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label
} from "recharts";
import { Bet, BankSettings } from "@/types";

interface BankStatsProps {
  bets: Bet[];
  settings: BankSettings;
  currentBank: number;
  suggestedBetAmount: number;
  expectedProfit: number;
  totalProfit: number;
  totalBets: number;
  winRate: number;
  bankGrowthRate: number;
}

export function BankStats({
  bets,
  settings,
  currentBank,
  suggestedBetAmount,
  expectedProfit,
  totalProfit,
  totalBets,
  winRate,
  bankGrowthRate
}: BankStatsProps) {
  // Preparar dados para o gráfico
  const chartData = bets.map(bet => ({
    date: new Date(bet.date).toLocaleDateString('pt-BR'),
    value: bet.bankAfterBet
  }));

  // Se não há apostas ainda, adicionar o valor inicial da banca
  if (chartData.length === 0) {
    chartData.push({
      date: new Date().toLocaleDateString('pt-BR'),
      value: settings.initialValue
    });
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Banca Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {currentBank.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Inicial: R$ {settings.initialValue.toFixed(2)}
            </p>
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Crescimento</span>
                <span className={bankGrowthRate >= 0 ? "text-betting-green" : "text-betting-red"}>
                  {bankGrowthRate.toFixed(2)}%
                </span>
              </div>
              <Progress 
                value={Math.min(Math.max(bankGrowthRate, 0), 100)} 
                className={bankGrowthRate >= 0 ? "bg-green-100" : "bg-red-100"} 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aposta Sugerida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {suggestedBetAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {settings.dailyPercentageRisk}% da banca atual
            </p>
            <div className="mt-4 text-xs">
              <div className="flex items-center justify-between">
                <span>Retorno Esperado</span>
                <span className="text-betting-green">R$ {expectedProfit.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Acerto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de apostas: {totalBets}
            </p>
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Progresso</span>
                <span>{winRate.toFixed(1)}%</span>
              </div>
              <Progress value={winRate} className="bg-blue-100" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lucro Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProfit >= 0 ? "text-betting-green" : "text-betting-red"}`}>
              R$ {Math.abs(totalProfit).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalProfit >= 0 ? "Lucro" : "Prejuízo"} acumulado
            </p>
            <div className="mt-4 text-xs">
              <div className="flex items-center justify-between">
                <span>ROI</span>
                <span className={totalProfit >= 0 ? "text-betting-green" : "text-betting-red"}>
                  {settings.initialValue > 0 ? (totalProfit / settings.initialValue * 100).toFixed(2) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Evolução da Banca</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="line" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="line">Linha</TabsTrigger>
              <TabsTrigger value="area">Área</TabsTrigger>
            </TabsList>
            <TabsContent value="line" className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['auto', 'auto']}>
                    <Label
                      value="Valor (R$)"
                      position="left"
                      angle={-90}
                      style={{ textAnchor: "middle" }}
                    />
                  </YAxis>
                  <Tooltip formatter={(value: number) => [`R$ ${value.toFixed(2)}`, "Valor da Banca"]} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4CAF50"
                    strokeWidth={2}
                    dot={{ fill: "#4CAF50", strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="area" className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                  <defs>
                    <linearGradient id="bankGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['auto', 'auto']}>
                    <Label
                      value="Valor (R$)"
                      position="left"
                      angle={-90}
                      style={{ textAnchor: "middle" }}
                    />
                  </YAxis>
                  <Tooltip formatter={(value: number) => [`R$ ${value.toFixed(2)}`, "Valor da Banca"]} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4CAF50"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#bankGradient)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
