import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const data = [
  { name: "Jan", positivo: 65, neutro: 25, negativo: 10 },
  { name: "Fev", positivo: 68, neutro: 22, negativo: 10 },
  { name: "Mar", positivo: 62, neutro: 28, negativo: 10 },
  { name: "Abr", positivo: 70, neutro: 20, negativo: 10 },
  { name: "Mai", positivo: 75, neutro: 18, negativo: 7 },
  { name: "Jun", positivo: 78, neutro: 15, negativo: 7 },
];

export function SentimentChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolucao do Sentimento</CardTitle>
        <CardDescription>
          Tendencias de sentimento do cliente nos ultimos 6 meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-75">
          <ResponsiveContainer width="100%" height="300">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={{ stroke: "var(--border)" }}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="positivo"
                name="Positivo"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={{ fill: "var(--chart-2)" }}
              />
              <Line
                type="monotone"
                dataKey="neutro"
                name="Neutro"
                stroke="var(--chart-3)"
                strokeWidth={2}
                dot={{ fill: "var(--chart-3)" }}
              />
              <Line
                type="monotone"
                dataKey="negativo"
                name="Negativo"
                stroke="var(--chart-4)"
                strokeWidth={2}
                dot={{ fill: "var(--chart-4)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
