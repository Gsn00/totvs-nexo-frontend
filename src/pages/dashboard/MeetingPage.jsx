import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  Sparkles,
  Building2,
  UserCircle,
  Package,
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

// Mock meeting data
const meetingData = {
  id: "1",
  client: "Acme Corporation",
  title: "Revisão de Negócios Q4",
  date: "2024-01-15",
  time: "14:30",
  duration: "45 min",
  participants: [
    "João Silva (CEO)",
    "Maria Santos (CTO)",
    "Pedro Lima (Gerente de Conta)",
    "Ana Costa (CSM)",
  ],
  healthScore: 85,
  sentiment: "positivo",
  transcript: [
    {
      speaker: "Pedro Lima",
      role: "Gerente de Conta",
      text: "Obrigado a todos por participarem da revisão do Q4. Estou animado para compartilhar os resultados e discutir nosso roadmap para o próximo ano.",
      timestamp: "00:00:15",
      entities: [],
    },
    {
      speaker: "João Silva",
      role: "CEO - Acme Corp",
      text: "Obrigado Pedro. Estamos muito satisfeitos com a plataforma TOTVS neste trimestre. A integração com nosso ERP foi perfeita.",
      timestamp: "00:00:45",
      entities: [{ type: "product", text: "plataforma TOTVS" }],
    },
    {
      speaker: "Maria Santos",
      role: "CTO - Acme Corp",
      text: "Tenho que dizer que estávamos inicialmente considerando a SAP para nossas necessidades empresariais, mas o modelo de preços de vocês foi muito mais competitivo.",
      timestamp: "00:01:15",
      entities: [{ type: "competitor", text: "SAP" }],
    },
    {
      speaker: "Ana Costa",
      role: "CSM",
      text: "Que ótimo ouvir isso! Estamos trabalhando em vários recursos novos que acredito serão valiosos para sua equipe técnica.",
      timestamp: "00:01:45",
      entities: [],
    },
    {
      speaker: "João Silva",
      role: "CEO - Acme Corp",
      text: "Uma preocupação que temos é o módulo de relatórios. Está um pouco mais lento do que nossa experiência anterior com a solução da Senior.",
      timestamp: "00:02:15",
      entities: [
        { type: "product", text: "módulo de relatórios" },
        { type: "competitor", text: "Senior" },
      ],
    },
    {
      speaker: "Pedro Lima",
      role: "Gerente de Conta",
      text: "Entendo. Temos uma atualização de otimização de performance chegando no Q1 que deve resolver essas preocupações diretamente.",
      timestamp: "00:02:45",
      entities: [],
    },
    {
      speaker: "Maria Santos",
      role: "CTO - Acme Corp",
      text: "Isso seria excelente. Além disso, estamos planejando expandir para mais dois departamentos - Financeiro e RH.",
      timestamp: "00:03:15",
      entities: [
        { type: "role", text: "Financeiro" },
        { type: "role", text: "RH" },
      ],
    },
  ],
  insights: {
    painPoints: [
      "Performance do módulo de relatórios está mais lenta do que esperado",
      "Curva de aprendizado para novos membros da equipe",
      "Documentação de integração poderia ser mais detalhada",
    ],
    positiveHighlights: [
      "Satisfação geral com a plataforma",
      "Integração com ERP funcionando perfeitamente",
      "Modelo de preços apreciado",
      "Planejando expandir para mais departamentos",
    ],
    riskPoints: [
      "Concorrente (SAP) foi considerado anteriormente",
      "Experiência anterior com solução da Senior mencionada",
      "Preocupações de performance com módulo de relatórios",
    ],
    aiSuggestions: [
      "Acompanhar com cronograma de atualização de performance do Q1",
      "Agendar demonstração técnica para departamentos de Financeiro e RH",
      "Fornecer documentação aprimorada para integração",
      "Considerar oferecer pacote de suporte premium",
    ],
  },
};

const entityStyles = {
  competitor:
    "bg-red-500/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700",
  product:
    "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700",
  role: "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700",
};

const entityIcons = {
  competitor: Building2,
  product: Package,
  role: UserCircle,
};

export default function MeetingDetailsPage() {
  const { id } = useParams();
  const meeting = meetingData;

  const healthScoreColor = (score) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex flex-col">
      <Header title={meeting.title} subtitle={meeting.client} />

      <div className="flex-1 space-y-6 p-4 lg:p-6">
        {/* Back button and metadata */}
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
              {new Date(meeting.date).toLocaleDateString("pt-BR", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {meeting.time} ({meeting.duration})
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {meeting.participants.length} participantes
            </span>
          </div>
        </div>

        {/* Health Score Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold">{meeting.healthScore}</p>
                  <p className="text-sm text-muted-foreground">
                    Score de Saúde
                  </p>
                </div>
                <div className="w-32">
                  <Progress
                    value={meeting.healthScore}
                    className="h-3"
                    indicatorClassName={healthScoreColor(meeting.healthScore)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {meeting.participants.map((p) => (
                  <Badge key={p} variant="secondary">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
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
          </TabsList>

          {/* Transcript Tab */}
          <TabsContent value="transcript" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transcrição da Reunião</CardTitle>
                <CardDescription>
                  Entidades destacadas:
                  <span className="ml-2 inline-flex gap-2">
                    <Badge className={entityStyles.competitor}>
                      Concorrentes
                    </Badge>
                    <Badge className={entityStyles.product}>Produtos</Badge>
                    <Badge className={entityStyles.role}>
                      Cargos/Departamentos
                    </Badge>
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {meeting.transcript.map((entry, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                      {entry.speaker
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{entry.speaker}</p>
                        <span className="text-xs text-muted-foreground">
                          {entry.role}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {entry.timestamp}
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        {entry.entities.length > 0 && entry.text}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Pain Points */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-5 w-5" />
                    Pontos de Dor do Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {meeting.insights.painPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                        <span className="text-muted-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Positive Highlights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <TrendingUp className="h-5 w-5" />
                    Destaques Positivos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {meeting.insights.positiveHighlights.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                        <span className="text-muted-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Risk Points */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                    <AlertTriangle className="h-5 w-5" />
                    Pontos de Risco
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {meeting.insights.riskPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-500" />
                        <span className="text-muted-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* AI Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Sparkles className="h-5 w-5" />
                    Sugestões da IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {meeting.insights.aiSuggestions.map((suggestion, idx) => (
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

          {/* Sentiment Timeline Tab */}
          <TabsContent value="timeline">
            <SentimentTimeline />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
