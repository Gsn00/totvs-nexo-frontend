"use client";

import { Calendar, AlertTriangle, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const kpis = [
  {
    title: "Total de Reunioes",
    value: "248",
    change: "+12%",
    changeType: "positive",
    description: "vs mes anterior",
    icon: Calendar,
  },
  {
    title: "Risco de Churn",
    value: "8.4%",
    change: "-2.1%",
    changeType: "positive",
    description: "vs mes anterior",
    icon: AlertTriangle,
  },
  {
    title: "Oportunidades de Upsell",
    value: "34",
    change: "+8",
    changeType: "positive",
    description: "identificadas este mes",
    icon: TrendingUp,
  },
  {
    title: "Clientes Ativos",
    value: "156",
    change: "+5",
    changeType: "positive",
    description: "vs mes anterior",
    icon: Users,
  },
];

export function KPICards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </p>
                <p className="text-3xl font-bold tracking-tight">{kpi.value}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2.5">
                <kpi.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span
                className={
                  kpi.changeType === "positive"
                    ? "font-medium text-green-600 dark:text-green-400"
                    : "font-medium text-red-600 dark:text-red-400"
                }
              >
                {kpi.change}
              </span>
              <span className="text-muted-foreground">{kpi.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
