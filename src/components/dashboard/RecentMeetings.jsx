import { ArrowRight, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router";

const meetings = [
  {
    id: "1",
    client: "Acme Corporation",
    title: "Revisao de Negocios Q4",
    date: "Hoje, 14:30",
    healthScore: 85,
    sentiment: "positivo",
    duration: "45 min",
  },
  {
    id: "2",
    client: "TechStart Inc",
    title: "Sessao de Demo do Produto",
    date: "Hoje, 11:00",
    healthScore: 62,
    sentiment: "neutro",
    duration: "30 min",
  },
  {
    id: "3",
    client: "Global Trade Ltd",
    title: "Discussao de Renovacao de Contrato",
    date: "Ontem, 16:00",
    healthScore: 45,
    sentiment: "negativo",
    duration: "1h 15min",
  },
  {
    id: "4",
    client: "Innovate Solutions",
    title: "Kickoff de Implementacao",
    date: "Ontem, 10:00",
    healthScore: 92,
    sentiment: "positivo",
    duration: "1h",
  },
];

const sentimentStyles = {
  positivo: "bg-green-500/10 text-green-600 dark:text-green-400",
  neutro: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  negativo: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const healthScoreColor = (score) => {
  if (score >= 70) return "bg-green-500";
  if (score >= 40) return "bg-yellow-500";
  return "bg-red-500";
};

export function RecentMeetings() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Reunioes Recentes</CardTitle>
            <CardDescription>
              Ultimas transcricoes de reunioes analisadas
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/meetings">
              Ver todas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <Link
              key={meeting.id}
              to={`/meetings/${meeting.id}`}
              className="block rounded-lg border border-border p-4 transition-all hover:border-primary/50 hover:bg-muted/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{meeting.client}</p>
                    <Badge className={sentimentStyles[meeting.sentiment]}>
                      {meeting.sentiment}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {meeting.title}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{meeting.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {meeting.duration}
                    </span>
                  </div>
                </div>
                <div className="w-24 space-y-1 text-right">
                  <p className="text-sm font-medium">{meeting.healthScore}%</p>
                  <Progress
                    value={meeting.healthScore}
                    className="h-1.5"
                    indicatorClassName={healthScoreColor(meeting.healthScore)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Score de Saude
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
