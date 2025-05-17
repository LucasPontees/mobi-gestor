
import { Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

interface TeamChartProps {
  title: string;
  data: { name: string; value: number; }[];
  color: string;
}

export function TeamChart({ title, data, color }: TeamChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        {data.length > 0 ? (
          <ChartContainer
            config={{
              team: { label: "Time" },
              count: { label: "Apostas" }
            }}
          >
            <>
              <Bar
                data={data}
                dataKey="value"
                name="value"
                fill={color}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </>
          </ChartContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Nenhuma aposta</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
