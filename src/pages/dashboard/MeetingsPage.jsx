import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  ChevronDown,
  MoreVertical,
  Trash2,
  Building2,
  FileText,
  Smile,
  Meh,
  Frown,
  Activity,
  PlusCircle,
  Eye,
  Sparkles,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Header from "../../components/dashboard/Header";
import { Link } from "react-router";
import { apiFetch } from "../../api/apiFetch";
import { PaginationControl } from "@/components/ui/pagination-control";
import { Spinner } from "@/components/ui/spinner";

// Mapeamento de estilos de sentimento com ícones
const sentimentConfig = {
  positivo: {
    badge:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800/60",
    icon: Smile,
    label: "Positivo",
  },
  positive: {
    badge:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800/60",
    icon: Smile,
    label: "Positivo",
  },
  neutro: {
    badge:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800/60",
    icon: Meh,
    label: "Neutro",
  },
  neutral: {
    badge:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800/60",
    icon: Meh,
    label: "Neutro",
  },
  negativo: {
    badge:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800/60",
    icon: Frown,
    label: "Negativo",
  },
  negative: {
    badge:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800/60",
    icon: Frown,
    label: "Negativo",
  },
};

const healthScoreColor = (score) => {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-rose-500";
};

// Função auxiliar para identificar o cargo do usuário autenticado
const getUserRole = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || payload.sub_role || null;
  } catch (e) {
    return null;
  }
};

export default function MeetingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Paginação
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalMeetings: 0,
    totalPages: 1,
  });

  // Modal de Exclusão
  const [deletingMeeting, setDeletingMeeting] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const userRole = getUserRole();
  const canDelete = userRole === "admin" || userRole === "developer";

  const fetchMeetings = async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch(
        `/meetings/with-analysis?page=${page}&limit=10`,
      );

      if (!response) return;

      const data = await response.json();

      const itemsList = Array.isArray(data) ? data : data.items || [];
      const total = data.total_meetings || itemsList.length;
      const pages = data.total_pages || Math.ceil(total / 10) || 1;

      setMeetings(itemsList);
      setPagination({
        totalMeetings: total,
        totalPages: pages,
      });
    } catch (error) {
      console.error("Erro ao buscar reuniões:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [page]);

  const handleDeleteMeeting = async () => {
    if (!deletingMeeting || isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await apiFetch(`/meetings/${deletingMeeting.id}`, {
        method: "DELETE",
      });

      if (response && (response.ok || response.status === 204)) {
        setDeletingMeeting(null);
        if (page !== 1) {
          setPage(1);
        } else {
          fetchMeetings();
        }
      }
    } catch (error) {
      console.error("Erro ao excluir reunião:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtragem local
  const filteredMeetings = meetings.filter((m) => {
    const meetingData = m.meeting || m;
    const analysisData = m.analysis;

    const matchesSearch =
      meetingData.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meetingData.title?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSentiment =
      !sentimentFilter ||
      analysisData?.sentiment?.toLowerCase() === sentimentFilter.toLowerCase();

    return matchesSearch && matchesSentiment;
  });

  // Métricas rápidas da página
  const avgHealthScore = Math.round(
    meetings.reduce(
      (acc, curr) => acc + (curr.analysis?.health_score || 0),
      0,
    ) / (meetings.filter((curr) => curr.analysis).length || 1),
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header
        title="Reuniões"
        subtitle="Navegue e analise suas transcrições de reuniões processadas pela IA"
      />

      <div className="flex-1 space-y-6 p-4 lg:p-6 max-w-7xl mx-auto w-full">
        {/* Cards de Métricas do Topo */}
        <div className="grid gap-4 sm:grid-cols-3 animate-in fade-in duration-500">
          <Card className="border-border/60 bg-card shadow-xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Reuniões no Histórico
                </p>
                <p className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                  {pagination.totalMeetings}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
                <FileText className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card shadow-xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Média Health Score
                </p>
                <p className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                  {avgHealthScore}{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    /100
                  </span>
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center ring-1 ring-emerald-500/20">
                <Activity className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card shadow-xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Filtro Ativo
                </p>
                <p className="text-sm font-semibold tracking-tight text-foreground mt-1 capitalize">
                  {sentimentFilter
                    ? `Sentimento: ${sentimentFilter}`
                    : "Todos os Sentimentos"}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center ring-1 ring-amber-500/20">
                <Sparkles className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card Principal da Tabela */}
        <Card className="border-border/60 shadow-md">
          <CardHeader className="pb-4 border-b border-border/40">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base font-semibold tracking-tight">
                  Todas as Reuniões
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Exibindo {filteredMeetings.length} de{" "}
                  {pagination.totalMeetings} reuniões analisadas
                </CardDescription>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por cliente ou reunião..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 sm:w-64 h-9 text-xs rounded-xl"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 h-9 rounded-xl"
                    >
                      <Filter className="h-3.5 w-3.5" />
                      Sentimento
                      <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuLabel className="text-xs">
                      Filtrar por Sentimento
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSentimentFilter(null)}>
                      Todos os Sentimentos
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

                <Button
                  asChild
                  size="sm"
                  className="gap-2 shrink-0 h-9 rounded-xl shadow-xs"
                >
                  <Link to="/new-analysis">
                    <PlusCircle className="h-4 w-4" />
                    Nova Análise
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="py-3 font-semibold text-xs">
                      Cliente
                    </TableHead>
                    <TableHead className="py-3 font-semibold text-xs">
                      Título da Reunião
                    </TableHead>
                    <TableHead className="hidden md:table-cell py-3 font-semibold text-xs">
                      Data
                    </TableHead>
                    <TableHead className="py-3 font-semibold text-xs w-[160px]">
                      Score de Saúde
                    </TableHead>
                    <TableHead className="hidden sm:table-cell py-3 font-semibold text-xs">
                      Sentimento
                    </TableHead>
                    <TableHead className="w-[60px] text-right py-3 font-semibold text-xs pr-4">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-36 text-center">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <Spinner className="h-5 w-5 text-primary" />
                          <span className="text-sm">
                            Carregando reuniões...
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredMeetings.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-36 text-center text-muted-foreground"
                      >
                        <div className="flex flex-col items-center justify-center gap-1">
                          <FileText className="h-8 w-8 text-muted-foreground/40" />
                          <p className="text-sm font-medium">
                            Nenhuma reunião encontrada
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Tente ajustar seus filtros de busca
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMeetings.map((item) => {
                      const meeting = item.meeting || item;
                      const analysis = item.analysis;

                      const sentiment = analysis?.sentiment?.toLowerCase();
                      const sentimentInfo = sentimentConfig[sentiment] || {
                        badge:
                          "bg-slate-500/10 text-slate-600 border-slate-300",
                        icon: Smile,
                        label: analysis?.sentiment || "—",
                      };
                      const SentimentIcon = sentimentInfo.icon;

                      return (
                        <TableRow
                          key={meeting.id}
                          className="hover:bg-muted/40 transition-colors duration-150 border-b border-border/40"
                        >
                          {/* Cliente */}
                          <TableCell className="py-3 font-medium">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs ring-1 ring-primary/20">
                                {meeting.client?.charAt(0).toUpperCase() || "C"}
                              </div>
                              <Link
                                to={`/meetings/${meeting.id}`}
                                className="font-semibold text-sm text-foreground hover:text-primary transition-colors"
                              >
                                {meeting.client}
                              </Link>
                            </div>
                          </TableCell>

                          {/* Título */}
                          <TableCell className="py-3">
                            <Link
                              to={`/meetings/${meeting.id}`}
                              className="text-sm text-foreground/90 hover:text-primary transition-colors line-clamp-1"
                            >
                              {meeting.title}
                            </Link>
                          </TableCell>

                          {/* Data */}
                          <TableCell className="hidden text-muted-foreground md:table-cell py-3 text-xs font-mono">
                            {meeting.date
                              ? new Date(
                                  meeting.date.replace(/-/g, "/"),
                                ).toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "—"}
                          </TableCell>

                          {/* Health Score */}
                          <TableCell className="py-3">
                            {analysis ? (
                              <div className="space-y-1 max-w-[130px]">
                                <div className="flex items-center justify-between text-xs font-semibold">
                                  <span>{analysis.health_score}</span>
                                  <span className="text-[10px] text-muted-foreground">
                                    /100
                                  </span>
                                </div>
                                <Progress
                                  value={analysis.health_score}
                                  className="h-1.5"
                                  indicatorClassName={healthScoreColor(
                                    analysis.health_score,
                                  )}
                                />
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">
                                Processando...
                              </span>
                            )}
                          </TableCell>

                          {/* Sentimento */}
                          <TableCell className="hidden sm:table-cell py-3">
                            {analysis ? (
                              <Badge
                                variant="outline"
                                className={`gap-1 font-normal text-xs py-0.5 px-2 rounded-lg border shadow-2xs ${sentimentInfo.badge}`}
                              >
                                <SentimentIcon className="h-3 w-3 shrink-0" />
                                {sentimentInfo.label}
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                —
                              </span>
                            )}
                          </TableCell>

                          {/* Ações */}
                          <TableCell className="text-right py-3 pr-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem asChild>
                                  <Link
                                    to={`/meetings/${meeting.id}`}
                                    className="gap-2 cursor-pointer"
                                  >
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                    Ver Detalhes
                                  </Link>
                                </DropdownMenuItem>

                                {canDelete && (
                                  <DropdownMenuItem
                                    onClick={() => setDeletingMeeting(meeting)}
                                    className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Excluir
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Componente Reutilizável de Paginação */}
            <div className="pt-4 p-4">
              <PaginationControl
                currentPage={page}
                totalPages={pagination.totalPages}
                onPageChange={(newPage) => setPage(newPage)}
                isLoading={isLoading}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog
        open={!!deletingMeeting}
        onOpenChange={() => setDeletingMeeting(null)}
      >
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> Excluir Reunião
            </DialogTitle>
            <DialogDescription className="text-xs pt-1">
              Tem certeza que deseja excluir a reunião{" "}
              <strong className="text-foreground">
                {deletingMeeting?.title}
              </strong>{" "}
              do cliente{" "}
              <strong className="text-foreground">
                {deletingMeeting?.client}
              </strong>
              ? Esta ação removerá definitivamente o histórico e suas análises
              de IA.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingMeeting(null)}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteMeeting}
              disabled={isDeleting}
              className="rounded-xl shadow-md shadow-destructive/20"
            >
              {isDeleting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Excluindo...
                </>
              ) : (
                "Excluir Reunião"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
