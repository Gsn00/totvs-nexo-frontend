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

export function SentimentTimeline({ client, sentimentData }) {
  const calculateAverageSentiment = (data) => {
    if (!data || data.length === 0) return 0;
    const totalSentiment = data.reduce(
      (sum, entry) => sum + entry.sentiment,
      0,
    );
    return (totalSentiment / data.length).toFixed(0);
  };

  const getHighestSentiment = (sentimentData) => {
    if (!sentimentData || sentimentData.length === 0) return null;
    const entry = sentimentData.reduce((max, item) =>
      item.sentiment > max.sentiment ? item : max,
    );
    return {
      ...entry,
      label: entry.label.includes(":")
        ? entry.label.substring(entry.label.indexOf(":") + 1).trim()
        : entry.label,
    };
  };

  const getLowestSentiment = (sentimentData) => {
    if (!sentimentData || sentimentData.length === 0) return null;
    const entry = sentimentData.reduce((min, item) =>
      item.sentiment < min.sentiment ? item : min,
    );
    return {
      ...entry,
      label: entry.label.includes(":")
        ? entry.label.substring(entry.label.indexOf(":") + 1).trim()
        : entry.label,
    };
  };

  const getFinalSentiment = (data) => {
    if (!data || data.length === 0) return null;
    const finalEntry = data[data.length - 1];
    return {
      sentiment: finalEntry.sentiment,
      label: finalEntry.label.includes(":")
        ? finalEntry.label.substring(finalEntry.label.indexOf(":") + 1).trim()
        : finalEntry.label,
    };
  };

  const final = getFinalSentiment(sentimentData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Linha do Tempo de Sentimento</CardTitle>
        <CardDescription>
          Acompanhe a evolução do sentimento baseada nos marcos da reunião com a{" "}
          {client}.
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
                  value: "Tempo da Reunião",
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
                y={calculateAverageSentiment(sentimentData)}
                stroke="var(--muted-foreground)"
                strokeDasharray="5 5"
                label={{
                  value: `Média (${calculateAverageSentiment(sentimentData)}%)`,
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
              {getHighestSentiment(sentimentData)["sentiment"]}%
            </p>
            <p className="text-sm text-muted-foreground">Pico de Sentimento</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tempo {getHighestSentiment(sentimentData)["time"]} -{" "}
              {getHighestSentiment(sentimentData)["label"]}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {getLowestSentiment(sentimentData)["sentiment"]}%
            </p>
            <p className="text-sm text-muted-foreground">Ponto Mais Baixo</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tempo {getLowestSentiment(sentimentData)["time"]} -{" "}
              {getLowestSentiment(sentimentData)["label"]}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p
              className={`text-2xl font-bold ${
                final.sentiment >= 70
                  ? "text-green-600"
                  : final.sentiment <= 40
                    ? "text-red-600"
                    : "text-yellow-600"
              }`}
            >
              {final.sentiment}%
            </p>
            <p className="text-sm text-muted-foreground">Sentimento Final</p>
            <p className="mt-1 text-xs text-muted-foreground">{final.label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
