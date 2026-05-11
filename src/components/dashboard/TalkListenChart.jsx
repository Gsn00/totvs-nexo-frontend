import {
  BarChart,
  Bar,
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
  { name: "Sem 1", falar: 65, ouvir: 35 },
  { name: "Sem 2", falar: 58, ouvir: 42 },
  { name: "Sem 3", falar: 52, ouvir: 48 },
  { name: "Sem 4", falar: 48, ouvir: 52 },
];

export function TalkListenChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Proporcao Falar-Ouvir</CardTitle>
        <CardDescription>
          Equilibrio entre falar e ouvir nas reunioes com clientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-75">
          <ResponsiveContainer width="100%" height="300">
            <BarChart data={data} barCategoryGap="20%">
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
              <Bar
                dataKey="falar"
                name="Falando"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="ouvir"
                name="Ouvindo"
                fill="var(--chart-2)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
