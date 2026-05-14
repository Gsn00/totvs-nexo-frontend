import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const sentimentData = [
  { time: "00:00", sentiment: 65, label: "Abertura" },
  { time: "05:00", sentiment: 72, label: "Discussão do produto" },
  { time: "10:00", sentiment: 78, label: "Feedback de integração" },
  { time: "15:00", sentiment: 55, label: "Menção a concorrente" },
  { time: "20:00", sentiment: 62, label: "Preocupações de performance" },
  { time: "25:00", sentiment: 70, label: "Discussão do roadmap" },
  { time: "30:00", sentiment: 82, label: "Planos de expansão" },
  { time: "35:00", sentiment: 85, label: "Preview de recursos" },
  { time: "40:00", sentiment: 88, label: "Próximos passos acordados" },
  { time: "45:00", sentiment: 90, label: "Fechamento positivo" },
];

export function SentimentTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Linha do Tempo de Sentimento</CardTitle>
        <CardDescription>
          Acompanhe como o sentimento do cliente evoluiu durante a reunião
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-100">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sentimentData}>
              <defs>
                <linearGradient
                  id="sentimentGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="time"
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={{ stroke: "var(--border)" }}
                label={{
                  value: "Duração da Reunião",
                  position: "insideBottom",
                  offset: -5,
                  fill: "var(--muted-foreground)",
                  fontSize: 12,
                }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={{ stroke: "var(--border)" }}
                label={{
                  value: "Score de Sentimento",
                  angle: -90,
                  position: "insideLeft",
                  fill: "var(--muted-foreground)",
                  fontSize: 12,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "var(--foreground)" }}
                formatter={(value, name, props) => [
                  `${value}% - ${props.payload.label}`,
                  "Sentimento",
                ]}
              />
              <ReferenceLine
                y={50}
                stroke="var(--muted-foreground)"
                strokeDasharray="5 5"
                label={{
                  value: "Neutro",
                  position: "right",
                  fill: "var(--muted-foreground)",
                  fontSize: 10,
                }}
              />
              <Area
                type="monotone"
                dataKey="sentiment"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#sentimentGradient)"
                dot={{ fill: "var(--primary)", strokeWidth: 0, r: 4 }}
                activeDot={{
                  fill: "var(--primary)",
                  strokeWidth: 2,
                  stroke: "var(--background)",
                  r: 6,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Key Moments */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              90%
            </p>
            <p className="text-sm text-muted-foreground">Pico de Sentimento</p>
            <p className="mt-1 text-xs text-muted-foreground">
              às 45:00 - Fechamento positivo
            </p>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              55%
            </p>
            <p className="text-sm text-muted-foreground">Ponto Mais Baixo</p>
            <p className="mt-1 text-xs text-muted-foreground">
              às 15:00 - Menção a concorrente
            </p>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-2xl font-bold text-primary">+25%</p>
            <p className="text-sm text-muted-foreground">Variação Líquida</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tendência geral positiva
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
