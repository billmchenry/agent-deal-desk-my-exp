import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const forecastData = [
  { month: "Jan", value: 1200 },
  { month: "Feb", value: 1450 },
  { month: "Mar", value: 1680 },
  { month: "Apr", value: 1920 },
  { month: "May", value: 2340 },
  { month: "Jun", value: 2780 },
];

interface ForecastWidgetProps {
  compact?: boolean;
}

export function ForecastWidget({ compact = false }: ForecastWidgetProps) {
  return (
    <div className={compact ? "h-28 sm:h-32" : "h-48"}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={forecastData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--background))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value: number) => [`$${value}`, 'Projected']}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#forecastGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
