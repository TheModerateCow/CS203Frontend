import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface MyComponentProps {
  data: any[];
  title: string;
  description?: string;
}

const RadialGraph: React.FC<MyComponentProps> = ({
  data,
  title,
  description,
}) => {
  function transformPlayerStatsToChartData(stats: any): ChartDataItem[] {
    return [
      { label: "Punches", count: stats.totalPunches },
      { label: "Dodges", count: stats.totalDodges },
      { label: "KOs", count: stats.totalKOs },
    ];
  }

  const parseData: ChartDataItem[] = transformPlayerStatsToChartData(data);

  return (
    <Card>
      <CardHeader className="items-center pb-4 text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={parseData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis dataKey="label" />
            <PolarGrid radialLines={false} />
            <Radar
              dataKey="count"
              fill="var(--color-desktop)"
              fillOpacity={0}
              stroke="var(--color-desktop)"
              strokeWidth={2}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

interface PlayerStats {
  playerId: number;
  playerName: string;
  totalPunches: number;
  totalDodges: number;
  totalKOs: number;
}

interface ChartDataItem {
  label: string;
  count: number;
}

export default RadialGraph;
