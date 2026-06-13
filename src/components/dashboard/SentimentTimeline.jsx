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
  { time: "00:00", sentiment: 65, label: "Início da Reunião" },
  { time: "10:15", sentiment: 78, label: "Paixão pela linha RM e TOTVS" },
  { time: "12:45", sentiment: 72, label: "Interesse no Meu RH" },
  { time: "15:30", sentiment: 45, label: "Risco: Avaliação da Senior" },
  { time: "20:00", sentiment: 55, label: "Preocupação: Custo de Implementação" },
  { time: "25:45", sentiment: 40, label: "Alerta: Risco de buscar outras opções" },
  { time: "40:00", sentiment: 60, label: "Discussão de integração nativa" },
  { time: "60:00", sentiment: 68, label: "Abertura para demo do Clockin" },
  { time: "80:00", sentiment: 75, label: "Alinhamento de próximos passos" },
  { time: "99:13", sentiment: 75, label: "Fechamento da Reunião" },
];

export function SentimentTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Linha do Tempo de Sentimento</CardTitle>
        <CardDescription>
          Acompanhe a evolução do sentimento baseada nos marcos da reunião com a Saúde & Vida Corp.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
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
                y={65}
                stroke="var(--muted-foreground)"
                strokeDasharray="5 5"
                label={{
                  value: "Média (65%)",
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
              78%
            </p>
            <p className="text-sm text-muted-foreground">Pico de Sentimento</p>
            <p className="mt-1 text-xs text-muted-foreground">
              às 10:15 - Paixão pela linha RM
            </p>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              40%
            </p>
            <p className="text-sm text-muted-foreground">Ponto Mais Baixo</p>
            <p className="mt-1 text-xs text-muted-foreground">
              às 25:45 - Risco de buscar outras opções
            </p>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-2xl font-bold text-primary">+10%</p>
            <p className="text-sm text-muted-foreground">Variação Líquida</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Recuperação com foco em integração
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
