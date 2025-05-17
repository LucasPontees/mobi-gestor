
import { useState, useMemo } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Bet, BetResult } from "@/types";

interface BetHistoryProps {
  bets: Bet[];
}

export function BetHistory({ bets }: BetHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResult, setFilterResult] = useState<BetResult | "all">("all");

  const filteredBets = useMemo(() => {
    return bets
      .filter(bet => 
        filterResult === "all" || bet.result === filterResult
      )
      .filter(bet => 
        bet.team1.toLowerCase().includes(searchTerm.toLowerCase()) || 
        bet.team2.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bet.betType.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [bets, searchTerm, filterResult]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Histórico de Apostas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="grid gap-2">
            <Label htmlFor="search">Pesquisar</Label>
            <Input
              id="search"
              placeholder="Buscar por times ou tipo de aposta"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="filter">Filtrar por resultado</Label>
            <Select value={filterResult} onValueChange={(value: BetResult | "all") => setFilterResult(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os resultados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
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

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Confronto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Lucro/Perda</TableHead>
                <TableHead>Banca Após</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBets.length > 0 ? (
                filteredBets.map((bet) => (
                  <TableRow key={bet.id}>
                    <TableCell>{formatDate(bet.date)}</TableCell>
                    <TableCell>{bet.team1} x {bet.team2}</TableCell>
                    <TableCell>{bet.betType}</TableCell>
                    <TableCell>R$ {bet.actualAmount?.toFixed(2) || bet.suggestedAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span 
                        className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${
                          bet.result === "green" ? "bg-green-100 text-betting-green" :
                          bet.result === "red" ? "bg-red-100 text-betting-red" :
                          "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {bet.result === "green" ? "Green" : bet.result === "red" ? "Red" : "Pendente"}
                      </span>
                    </TableCell>
                    <TableCell className={
                      bet.profit && bet.profit > 0 
                        ? "text-betting-green" 
                        : bet.profit && bet.profit < 0 
                        ? "text-betting-red" 
                        : ""
                    }>
                      {bet.profit !== undefined ? `R$ ${Math.abs(bet.profit).toFixed(2)}` : "-"}
                    </TableCell>
                    <TableCell>R$ {bet.bankAfterBet.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Nenhuma aposta encontrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
