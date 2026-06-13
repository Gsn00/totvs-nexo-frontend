import { useState } from "react";
import { Search, Filter, Calendar, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "../../components/dashboard/Header";
import { Link } from "react-router";

const meetings = [
  {
    id: "1",
    client: "Saúde & Vida Corp",
    title: "Apresentação de Soluções de Ponto",
    date: "2026-03-18",
    healthScore: 65,
    sentiment: ["neutro"],
    duration: "1h 39min",
    participants: 4,
  },
  {
    id: "2",
    client: "TechStart Inc",
    title: "Sessão de Demo do Produto",
    date: "2024-01-15",
    healthScore: 62,
    sentiment: ["neutro"],
    duration: "30 min",
    participants: 3,
  },
  {
    id: "3",
    client: "Global Trade Ltd",
    title: "Discussão de Renovação de Contrato",
    date: "2024-01-14",
    healthScore: 45,
    sentiment: ["preocupado"],
    duration: "1h 15min",
    participants: 5,
  },
  {
    id: "4",
    client: "Innovate Solutions",
    title: "Kickoff de Implementação",
    date: "2024-01-14",
    healthScore: 92,
    sentiment: ["positivo"],
    duration: "1h",
    participants: 6,
  },
  {
    id: "5",
    client: "DataFlow Systems",
    title: "Chamada de Integração Técnica",
    date: "2024-01-13",
    healthScore: 78,
    sentiment: ["positivo"],
    duration: "55 min",
    participants: 4,
  },
  {
    id: "6",
    client: "Retail Masters",
    title: "Discussão de Solicitação de Recursos",
    date: "2024-01-13",
    healthScore: 58,
    sentiment: ["neutro"],
    duration: "40 min",
    participants: 3,
  },
  {
    id: "7",
    client: "CloudFirst Inc",
    title: "Check-in Trimestral",
    date: "2024-01-12",
    healthScore: 88,
    sentiment: ["positivo"],
    duration: "35 min",
    participants: 2,
  },
  {
    id: "8",
    client: "Manufacturing Plus",
    title: "Revisão de Escalação de Suporte",
    date: "2024-01-12",
    healthScore: 35,
    sentiment: ["negativo"],
    duration: "1h 30min",
    participants: 7,
  },
];

const sentimentStyles = {
  positivo: "bg-green-500/10 text-green-600 dark:text-green-400",
  neutro: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  negativo: "bg-red-500/10 text-red-600 dark:text-red-400",
  preocupado: "bg-red-500/10 text-red-600 dark:text-red-400",
  hesitante: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  engajado: "bg-green-500/10 text-green-600 dark:text-green-400",
  animado: "bg-green-500/10 text-green-600 dark:text-green-400",
  curioso: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  técnico: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  solicitante: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  satisfeito: "bg-green-500/10 text-green-600 dark:text-green-400",
  frustrado: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const healthScoreColor = (score) => {
  if (score >= 70) return "bg-green-500";
  if (score >= 40) return "bg-yellow-500";
  return "bg-red-500";
};

export default function MeetingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState(null);

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSentiment =
      !sentimentFilter || meeting.sentiment.includes(sentimentFilter);
    return matchesSearch && matchesSentiment;
  });

  return (
    <div className="flex flex-col">
      <Header
        title="Reuniões"
        subtitle="Navegue e analise suas transcrições de reuniões"
      />

      <div className="flex-1 space-y-6 p-4 lg:p-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Todas as Reuniões</CardTitle>
                <CardDescription>
                  {filteredMeetings.length} reuniões encontradas
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar reuniões..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 sm:w-64"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Sentimento
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      Filtrar por Sentimento
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSentimentFilter(null)}>
                      Todos
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSentimentFilter("positivo")}
                    >
                      Positivo
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSentimentFilter("neutro")}
                    >
                      Neutro
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSentimentFilter("negativo")}
                    >
                      Negativo
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Período
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-50">Cliente</TableHead>
                    <TableHead>Reunião</TableHead>
                    <TableHead className="hidden md:table-cell">Data</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Duração
                    </TableHead>
                    <TableHead className="w-35">Score de Saúde</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Sentimento
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMeetings.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell className="font-medium">
                        <Link
                          to={`/meetings/${meeting.id}`}
                          className="hover:text-primary"
                        >
                          {meeting.client}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/meetings/${meeting.id}`}
                          className="hover:text-primary"
                        >
                          {meeting.title}
                        </Link>
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {new Date(meeting.date).toLocaleDateString("pt-BR", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground lg:table-cell">
                        {meeting.duration}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">
                              {meeting.healthScore}
                            </span>
                            <span className="text-muted-foreground">/100</span>
                          </div>
                          <Progress
                            value={meeting.healthScore}
                            className="h-1.5"
                            indicatorClassName={healthScoreColor(
                              meeting.healthScore,
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {meeting.sentiment.slice(0, 2).map((s) => (
                            <Badge
                              key={s}
                              className={sentimentStyles[s] || "bg-muted"}
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
