
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { UserPerformance } from '@/types';

interface UserPerformanceTableProps {
  userPerformance: UserPerformance[];
}

export function UserPerformanceTable({ userPerformance }: UserPerformanceTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance dos Usuários</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Apostas</TableHead>
              <TableHead>Win Rate</TableHead>
              <TableHead className="text-right">Lucro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userPerformance.map((user) => (
              <TableRow key={user.userId}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>
                  {user.totalBets} ({user.greenBets}/{user.redBets})
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={user.winRate} className="w-[60px]" />
                    <span>{user.winRate.toFixed(1)}%</span>
                  </div>
                </TableCell>
                <TableCell className={`text-right ${user.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {user.profit.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
