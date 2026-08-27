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
  Mic,
  CheckCircle2,
  Info,
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
import { Link, useParams } from "react-router";
import { SentimentTimeline } from "../../components/dashboard/SentimentTimeline";
import { apiFetch } from "../../api/apiFetch";
import MeetingChatbot from "../../components/dashboard/MeetingChatBot";

const entityStyles = {
  competitor:
    "bg-red-500/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
  product:
    "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  role: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  painPoint:
    "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  churnRisk:
    "bg-rose-900/20 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-800",
};

const entityIcons = {
  competitor: <AlertTriangle className="h-3 w-3 shrink-0" />,
  product: <Box className="h-3 w-3 shrink-0" />,
  role: <Users className="h-3 w-3 shrink-0" />,
  painPoint: <XCircle className="h-3 w-3 shrink-0" />,
  churnRisk: <Activity className="h-3 w-3 shrink-0" />,
};

export default function MeetingDetailsPage() {
  const [meeting, setMeeting] = useState(null);
  const { id } = useParams();

  const healthScoreColor = (score) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTalkToListenMetrics = () => {
    const rawRatio = meeting?.analysis?.talk_to_listen_ratio;
    if (rawRatio === undefined || rawRatio === null) return null;

    let totvsPercentage =
      rawRatio <= 1 ? Math.round(rawRatio * 100) : Math.round(rawRatio);
    totvsPercentage = Math.min(Math.max(totvsPercentage, 0), 100);

    const clientPercentage = 100 - totvsPercentage;
    const minIdealRatio = 30;
    const maxIdealRatio = 45;
    const isIdealRatio =
      totvsPercentage >= minIdealRatio && totvsPercentage <= maxIdealRatio;

    return {
      totvsPercentage,
      clientPercentage,
      minIdealRatio,
      maxIdealRatio,
      isIdealRatio,
    };
  };

  // Funcao otimizada para renderizar o texto sem quebras de linha indesejadas
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
                className={`inline-flex items-center gap-1 my-0.5 px-1.5 py-0.5 rounded-md border text-xs font-medium align-baseline shadow-2xs transition-colors ${entityStyles[entity.type]}`}
              >
                {entityIcons[entity.type]}
                <span>{entity.text}</span>
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

  const talkMetrics = getTalkToListenMetrics();

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

        {/* Dashboard de Visão Geral */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Card de Score de Saúde */}
          <Card className="md:col-span-1 flex flex-col justify-between shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Score de Saúde da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-5xl font-extrabold tracking-tight">
                    {meeting.analysis.health_score}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Baseado em engajamento e tom
                  </p>
                </div>
                <div className="w-24 flex flex-col gap-2">
                  <Progress
                    value={meeting.analysis.health_score}
                    className="h-3"
                    indicatorClassName={healthScoreColor(
                      meeting.analysis.health_score,
                    )}
                  />
                  <span className="text-[10px] text-right text-muted-foreground font-medium">
                    Meta: &gt;70%
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-border/50">
                {meeting.meeting.participants.map((p) => (
                  <Badge key={p} variant="secondary" className="text-[11px]">
                    {p}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card de Proporção Falar vs. Ouvir */}
          {talkMetrics && (
            <Card className="md:col-span-2 flex flex-col justify-between shadow-xs border-border/60">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mic className="h-4 w-4 text-primary/80" />
                  Proporção Falar vs. Ouvir (Talk-to-Listen)
                </CardTitle>
                <Badge
                  variant="outline"
                  className={`gap-1.5 text-xs font-medium transition-colors ${
                    talkMetrics.isIdealRatio
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                  }`}
                >
                  {talkMetrics.isIdealRatio ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Info className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  )}
                  {talkMetrics.isIdealRatio && "Equilíbrio Ideal"}
                  {talkMetrics.totvsPercentage < talkMetrics.minIdealRatio &&
                    "TOTVS Falando Pouco"}
                  {talkMetrics.totvsPercentage > talkMetrics.maxIdealRatio &&
                    "TOTVS Falando Demais"}
                </Badge>
              </CardHeader>

              <CardContent className="p-6 pt-2 flex flex-col justify-center space-y-4">
                <div className="space-y-2.5">
                  {/* Cabeçalho das Porcentagens */}
                  <div className="flex justify-between text-xs font-medium">
                    <span className="flex items-center gap-1.5 text-foreground/90 animate-in fade-in duration-700">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      Time TOTVS:{" "}
                      <strong className="font-semibold text-primary">
                        {talkMetrics.totvsPercentage}%
                      </strong>
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground animate-in fade-in duration-700">
                      <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                      {meeting.meeting.client}:{" "}
                      <strong className="font-semibold text-foreground/80">
                        {talkMetrics.clientPercentage}%
                      </strong>
                    </span>
                  </div>

                  {/* Container da Barra com Animação e Zona Alvo */}
                  <div className="relative">
                    <div className="relative flex h-3.5 w-full overflow-hidden rounded-full bg-muted/60 p-0.5 ring-1 ring-border/50">
                      {/* Lado TOTVS */}
                      <div
                        className="h-full rounded-l-full bg-primary/85 hover:bg-primary transition-all duration-1000 ease-out shadow-2xs"
                        style={{ width: `${talkMetrics.totvsPercentage}%` }}
                      />
                      {/* Lado Cliente */}
                      <div
                        className="h-full rounded-r-full bg-slate-400/70 dark:bg-slate-600/70 hover:bg-slate-400 transition-all duration-1000 ease-out"
                        style={{ width: `${talkMetrics.clientPercentage}%` }}
                      />
                    </div>

                    {/* Marcador Discreto da Faixa Ideal (30% a 45%) */}
                    <div
                      className="absolute top-0 h-3.5 border-x-2 border-dashed border-primary/40 bg-primary/5 pointer-events-none transition-opacity duration-500"
                      style={{ left: "30%", width: "15%" }}
                      title="Faixa Ideal de Fala (30% - 45%)"
                    />
                  </div>

                  {/* Legenda do Marcador */}
                  <div className="flex justify-between text-[10px] text-muted-foreground/70 px-0.5">
                    <span>0%</span>
                    <span className="text-primary/70 font-medium">
                      Zona Ideal TOTVS (30% - 45%)
                    </span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Nota de Recomendação */}
                <p className="text-xs text-muted-foreground/90 pt-2 border-t border-border/40 leading-relaxed">
                  <strong className="font-semibold text-foreground">
                    Recomendação:
                  </strong>{" "}
                  O tempo de fala ideal da equipe em reuniões de acompanhamento
                  é de <strong>30% a 45%</strong>, permitindo maior engajamento
                  do cliente.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Conteúdo Principal em Abas */}
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
            <Card className="shadow-xs">
              <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">
                      Transcrição com Mapeamento de Entidades
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      Palavras-chave destacadas por IA para análise rápida de
                      contexto
                    </CardDescription>
                  </div>
                  {/* Legenda de Entidades Refinada */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <Badge
                      variant="outline"
                      className={`${entityStyles.product} border font-normal`}
                    >
                      Produtos
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`${entityStyles.competitor} border font-normal`}
                    >
                      Concorrentes
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`${entityStyles.role} border font-normal`}
                    >
                      Cargos
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`${entityStyles.painPoint} border font-normal`}
                    >
                      Dores
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`${entityStyles.churnRisk} border font-normal`}
                    >
                      Risco Churn
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              {/* Lista de Falas da Transcrição */}
              <CardContent className="p-4 sm:p-6 space-y-4 max-h-[600px] overflow-y-auto">
                {meeting.transcript.map((entry, idx) => (
                  <div
                    key={idx}
                    className="group relative flex gap-3 p-3.5 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/40 hover:border-border/80 transition-all duration-200"
                  >
                    {/* Icone / Avatar do Participante */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs ring-1 ring-primary/20 mt-0.5">
                      {entry.speaker.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-foreground tracking-tight">
                          {entry.speaker}
                        </span>
                        {entry.time && (
                          <span className="text-[11px] font-mono text-muted-foreground bg-background/80 px-2 py-0.5 rounded-md border border-border/40">
                            {entry.time}
                          </span>
                        )}
                      </div>

                      {/* Texto Corrido sem Quebra de Linha Desnecessaria */}
                      <p className="text-sm text-foreground/90 leading-relaxed font-normal break-words">
                        {renderHighlightedText(entry.text, entry.entities)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Insights */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
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

          {/* Aba de ChatBot */}
          <TabsContent value="chatbot">
            <MeetingChatbot />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
