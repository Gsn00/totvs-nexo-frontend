import { AlertCircle, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const alerts = [
  {
    id: 1,
    competitor: "Senior",
    client: "Acme Corp",
    meeting: "Revisao Q4",
    context: "Cliente mencionou modelo de precos da Senior",
    severity: "high",
    time: "2 horas atras",
  },
  {
    id: 2,
    competitor: "SAP",
    client: "TechStart Inc",
    meeting: "Demo do Produto",
    context: "Perguntou sobre capacidades de integracao com SAP",
    severity: "medium",
    time: "5 horas atras",
  },
  {
    id: 3,
    competitor: "Sankhya",
    client: "Global Trade",
    meeting: "Renovacao de Contrato",
    context: "Comparando recursos com ERP Sankhya",
    severity: "high",
    time: "1 dia atras",
  },
];

const severityStyles = {
  high: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
  medium:
    "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  low: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
};

export function CompetitorAlerts() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Mencoes a Concorrentes
            </CardTitle>
            <CardDescription>
              Mencoes recentes a concorrentes em reunioes
            </CardDescription>
          </div>
          <Badge variant="secondary" className="font-medium">
            {alerts.length} alertas
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className={severityStyles[alert.severity]}>
                    {alert.competitor}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {alert.time}
                  </span>
                </div>
                <p className="font-medium text-sm">{alert.client}</p>
                <p className="text-sm text-muted-foreground">{alert.context}</p>
              </div>
            </div>
          </div>
        ))}

        <Button variant="ghost" className="w-full" asChild>
          <Link to="/meetings">
            Ver todos os alertas
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
