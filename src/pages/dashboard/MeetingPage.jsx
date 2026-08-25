import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Users,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  Sparkles,
  Activity,
  Box,
  XCircle,
  BotMessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "../../components/dashboard/Header";
import { Link } from "react-router";
import { SentimentTimeline } from "../../components/dashboard/SentimentTimeline";
import { useParams } from "react-router";
import { apiFetch } from "../../api/apiFetch";

const entityStyles = {
  competitor:
    "bg-red-500/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700",
  product:
    "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700",
  role: "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700",
  painPoint:
    "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700",
  churnRisk:
    "bg-rose-900/30 text-rose-800 dark:text-rose-200 border-rose-400 dark:border-rose-800",
};

const entityIcons = {
  competitor: <AlertTriangle className="h-3 w-3" />,
  product: <Box className="h-3 w-3" />,
  role: <Users className="h-3 w-3" />,
  painPoint: <XCircle className="h-3 w-3" />,
  churnRisk: <Activity className="h-3 w-3" />,
};

export default function MeetingDetailsPage() {
  const [meeting, setMeeting] = useState(null);
  const { id } = useParams();

  const healthScoreColor = (score) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Função para renderizar o texto com as entidades destacadas
  const renderHighlightedText = (text, entities) => {
    if (!entities || entities.length === 0) return text;

    let parts = [text];
    entities.forEach((entity) => {
      const newParts = [];
      parts.forEach((part) => {
        if (typeof part !== "string") {
          newParts.push(part);
          return;
        }
        const splitText = part.split(entity.text);
        splitText.forEach((t, i) => {
          newParts.push(t);
          if (i < splitText.length - 1) {
            newParts.push(
              <span
                key={`${entity.text}-${i}`}
                className={`px-1 rounded border ${entityStyles[entity.type]} font-medium mx-0.5 flex items-center gap-1 text-xs`}
              >
                {entityIcons[entity.type]}
                {entity.text}
              </span>,
            );
          }
        });
      });
      parts = newParts;
    });
    return parts;
  };

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await apiFetch(`/meetings/${id}/with-analysis`);
        if (!response) return;
        const data = await response.json();
        setMeeting(data);
      } catch (error) {
        console.error("Error fetching meeting data:", error);
      }
    };
    fetchMeeting();
  }, [id]);

  if (!meeting) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Carregando detalhes da reunião...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Header title={meeting.meeting.title} subtitle={meeting.meeting.client} />

      <div className="flex-1 space-y-6 p-4 lg:p-6">
        {/* Navegação e Metadados */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="ghost" asChild className="w-fit">
            <Link to="/meetings">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Reuniões
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(
                meeting.meeting.date.replace(/-/g, "/"),
              ).toLocaleDateString("pt-BR", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {meeting.meeting.participants.length} participantes
            </span>
          </div>
        </div>

        {/* Card de Score de Saúde */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold">
                    {meeting.analysis.health_score}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Score de Saúde
                  </p>
                </div>
                <div className="w-32">
                  <Progress
                    value={meeting.analysis.health_score}
                    className="h-3"
                    indicatorClassName={healthScoreColor(
                      meeting.analysis.health_score,
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                {meeting.meeting.participants.map((p) => (
                  <Badge key={p} variant="secondary">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conteúdo Principal */}
        <Tabs defaultValue="transcript" className="flex flex-col space-y-6">
          <TabsList>
            <TabsTrigger value="transcript" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Transcrição
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Insights IA
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Sentimento
            </TabsTrigger>
            <TabsTrigger value="chatbot" className="gap-2">
              <BotMessageSquare className="h-4 w-4" />
              ChatBot
            </TabsTrigger>
          </TabsList>

          {/* Aba de Transcrição */}
          <TabsContent value="transcript" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between space-y-0">
                <div>
                  <CardTitle>Transcrição da Reunião</CardTitle>
                  <CardDescription className="mt-2 flex flex-wrap gap-2">
                    <Badge className={entityStyles.product}>Produtos</Badge>
                    <Badge className={entityStyles.competitor}>
                      Concorrentes
                    </Badge>
                    <Badge className={entityStyles.role}>Cargos</Badge>
                    <Badge className={entityStyles.painPoint}>Dores</Badge>
                    <Badge className={entityStyles.churnRisk}>
                      Risco de Churn
                    </Badge>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 max-h-150 overflow-y-auto pr-4">
                {meeting.transcript.map((entry, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col space-y-1 border-l-2 border-muted pl-4 hover:border-primary transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-primary">
                        {entry.speaker}
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90 flex flex-wrap">
                      {renderHighlightedText(entry.text, entry.entities)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Insights */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Pain Points */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                    <AlertTriangle className="h-5 w-5" />
                    Pontos de Dor do Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {meeting.analysis.pain_points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                        <span className="text-muted-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Destaques Positivos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <TrendingUp className="h-5 w-5" />
                    Destaques Positivos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {meeting.analysis.highlights.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                        <span className="text-muted-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Pontos de Risco */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                    <Activity className="h-5 w-5" />
                    Pontos de Risco e Churn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {meeting.analysis.risk_factors.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                        <span className="text-muted-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Sugestões da IA */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Sparkles className="h-5 w-5" />
                    Sugestões de Próximas Ações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {meeting.analysis.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span className="text-muted-foreground">
                          {suggestion}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba de Sentimento */}
          <TabsContent value="timeline">
            <SentimentTimeline
              client={meeting.meeting.client}
              sentimentData={meeting.analysis.sentiment_timeline}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
