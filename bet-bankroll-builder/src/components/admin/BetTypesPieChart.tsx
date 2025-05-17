
import { Pie } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

interface BetTypesPieChartProps {
  data: { name: string; value: number; }[];
}

export function BetTypesPieChart({ data }: BetTypesPieChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tipos de Apostas</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        {data.length > 0 ? (
          <ChartContainer
            config={{
              type: { label: "Tipo" },
              count: { label: "Apostas" }
            }}
          >
            <>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </>
          </ChartContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Nenhum tipo de aposta registrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
