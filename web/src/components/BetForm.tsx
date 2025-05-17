import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bet } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface BetFormProps {
  suggestedAmount: number;
  currentBank: number;
  onAddBet: (bet: Bet) => void;
}

export function BetForm({ suggestedAmount, currentBank, onAddBet }: BetFormProps) {
  const { user } = useAuth();
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [betType, setBetType] = useState("");
  const [amount, setAmount] = useState(suggestedAmount.toString());
  const [odds, setOdds] = useState("2.00");
  const [result, setResult] = useState<"green" | "red" | "pending">("pending");
  const [profit, setProfit] = useState("");

  const resetForm = () => {
    setTeam1("");
    setTeam2("");
    setBetType("");
    setAmount(suggestedAmount.toString());
    setOdds("2.00");
    setResult("pending");
    setProfit("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos
    if (!team1 || !team2 || !betType || !amount || !odds) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (!user) {
      toast.error("Você precisa estar logado para fazer uma aposta");
      return;
    }

    const actualAmount = parseFloat(amount);
    const actualOdds = parseFloat(odds);
    let actualProfit = 0;
    let bankAfter = currentBank;

    if (isNaN(actualAmount) || isNaN(actualOdds)) {
      toast.error("Valores inválidos");
      return;
    }

    if (actualOdds < 1) {
      toast.error("Odds deve ser maior que 1");
      return;
    }

    // Calcular o lucro/perda baseado no resultado
    if (result === "green" && profit) {
      actualProfit = parseFloat(profit);
      bankAfter = currentBank + actualProfit;
    } else if (result === "red") {
      actualProfit = -actualAmount;
      bankAfter = currentBank - actualAmount;
    }

    // Criar nova aposta
    const newBet: Bet = {
      id: uuidv4(),
      date: new Date(),
      team1,
      team2,
      betType,
      suggestedAmount,
      actualAmount,
      odds: actualOdds,
      result,
      profit: result === "green" ? actualProfit : result === "red" ? -actualAmount : undefined,
      bankBeforeBet: currentBank,
      bankAfterBet: bankAfter,
      userId: user.id
    };

    onAddBet(newBet);
    toast.success("Aposta adicionada com sucesso!");
    resetForm();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Nova Aposta</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="team1">Time 1</Label>
              <Input
                id="team1"
                value={team1}
                onChange={(e) => setTeam1(e.target.value)}
                placeholder="Ex: Flamengo"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="team2">Time 2</Label>
              <Input
                id="team2"
                value={team2}
                onChange={(e) => setTeam2(e.target.value)}
                placeholder="Ex: Palmeiras"
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="betType">Tipo de Aposta</Label>
            <Input
              id="betType"
              value={betType}
              onChange={(e) => setBetType(e.target.value)}
              placeholder="Ex: Resultado Final, Mais de 2.5 gols"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Valor da Aposta</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={suggestedAmount.toString()}
              />
              <p className="text-xs text-muted-foreground">Valor sugerido: R$ {suggestedAmount.toFixed(2)}</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="odds">Odds</Label>
              <Input
                id="odds"
                type="number"
                min="1"
                step="0.01"
                value={odds}
                onChange={(e) => setOdds(e.target.value)}
                placeholder="Ex: 1.85"
              />
              <p className="text-xs text-muted-foreground">Mínimo: 1.00</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="result">Resultado</Label>
              <Select value={result} onValueChange={(value: "green" | "red" | "pending") => setResult(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="green">
                    <span className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-betting-green mr-2"></span>
                      Green (Ganhou)
                    </span>
                  </SelectItem>
                  <SelectItem value="red">
                    <span className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-betting-red mr-2"></span>
                      Red (Perdeu)
                    </span>
                  </SelectItem>
                  <SelectItem value="pending">
                    <span className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                      Pendente
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {result === "green" && (
            <div className="grid gap-2">
              <Label htmlFor="profit">Lucro (R$)</Label>
              <Input
                id="profit"
                type="number"
                min="0"
                step="0.01"
                value={profit}
                onChange={(e) => setProfit(e.target.value)}
                placeholder="0.00"
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Adicionar Aposta</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
