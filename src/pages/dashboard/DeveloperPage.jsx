import { useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Terminal,
  XCircle,
  Code,
  Calendar,
  Building2,
  Cpu,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { PaginationControl } from "@/components/ui/pagination-control";
import Header from "../../components/dashboard/Header";
import { apiFetch } from "@/api/apiFetch";

const logLevelStyles = {
  ERROR:
    "bg-red-500/15 text-red-600 dark:text-red-400 border-red-300 dark:border-red-800/60",
  WARNING:
    "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800/60",
  INFO: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-800/60",
};

export default function DeveloperPage() {
  const [metrics, setMetrics] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [logFilter, setLogFilter] = useState("ALL");

  // Paginação dos Logs
  const [logsPage, setLogsPage] = useState(1);
  const [logsPagination, setLogsPagination] = useState({
    totalLogs: 0,
    totalPages: 1,
  });

  // Modal Stacktrace
  const [selectedLog, setSelectedLog] = useState(null);

  const loadDevData = async () => {
    setIsLoading(true);
    try {
      // 1. Métricas da IA / Sistema
      const metricsRes = await apiFetch("/dev/metrics");
      if (metricsRes && metricsRes.ok) {
        const data = await metricsRes.json();
        setMetrics(data);
      }

      // 2. Logs do Sistema Paginados (20 por página)
      const logsRes = await apiFetch(
        `/dev/logs?page=${logsPage}&limit=20&level=${logFilter}`,
      );
      if (logsRes && logsRes.ok) {
        const data = await logsRes.json();
        setLogs(data.logs);
        setLogsPagination({
          totalLogs: data.total_logs,
          totalPages: data.total_pages,
        });
      }
    } catch (err) {
      console.error("Erro ao carregar dev console:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDevData();
  }, [logFilter, logsPage]);

  const handleFilterChange = (newLevel) => {
    setLogFilter(newLevel);
    setLogsPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header
        title="Painel de Desenvolvedor"
        subtitle="Monitoramento técnico da IA, latência do NexoEngine e auditoria de erros"
      />

      <div className="flex-1 space-y-6 p-4 lg:p-6 max-w-7xl mx-auto w-full">
        {/* KPI Cards (3 Métricas Principais) */}
        <div className="grid gap-4 sm:grid-cols-3 animate-in fade-in duration-500">
          <Card className="border-border/60 shadow-xs transition-all hover:border-primary/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taxa de Sucesso IA
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold tracking-tight">
                {metrics?.success_rate ?? 0}%
              </div>
              <Progress
                value={metrics?.success_rate ?? 0}
                className="h-1.5 mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {metrics?.completed_count ?? 0} de{" "}
                {metrics?.total_meetings ?? 0} reuniões concluídas
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-xs transition-all hover:border-primary/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Latência Média Geral
              </CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold tracking-tight">
                {metrics?.avg_latency_seconds ?? 0}s
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Tempo de resposta médio global por inferência
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-xs transition-all hover:border-primary/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Análises com Falha
              </CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold tracking-tight text-destructive">
                {metrics?.failed_count ?? 0}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Total de falhas gravadas no histórico
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Comparação de Tempo Médio por Modelo de IA */}
        <Card className="border-border/60 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              Desempenho por Modelo de IA (Benchmark)
            </CardTitle>
            <CardDescription className="text-xs">
              Média de tempo de resposta e volume de requisições por modelo
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="py-2.5 font-semibold text-xs">
                      Modelo de IA
                    </TableHead>
                    <TableHead className="py-2.5 font-semibold text-xs">
                      Análises Processadas
                    </TableHead>
                    <TableHead className="py-2.5 font-semibold text-xs">
                      Tempo Médio de Inferência
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-20 text-center">
                        <Spinner className="h-4 w-4 text-primary inline mr-2" />
                        <span className="text-xs text-muted-foreground">
                          Carregando comparativo...
                        </span>
                      </TableCell>
                    </TableRow>
                  ) : !metrics?.model_metrics ||
                    metrics.model_metrics.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="h-16 text-center text-xs text-muted-foreground"
                      >
                        Nenhum dado de modelo registrado até o momento.
                      </TableCell>
                    </TableRow>
                  ) : (
                    metrics.model_metrics.map((model) => (
                      <TableRow
                        key={model.model_name}
                        className="hover:bg-muted/30"
                      >
                        <TableCell className="py-2.5">
                          <Badge
                            variant="outline"
                            className="font-mono text-xs bg-primary/5 border-primary/20"
                          >
                            {model.model_name}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2.5 text-xs text-muted-foreground">
                          {model.total_analyses} execuções
                        </TableCell>
                        <TableCell className="py-2.5 text-xs font-semibold text-foreground">
                          {model.avg_latency_seconds}s
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Console de Logs com Indicação do Modelo Usado */}
        <Card className="border-border/60 shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-700">
          <CardHeader className="border-b border-border/40 pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                  </div>
                  <Terminal className="h-4 w-4 text-primary" />
                  Console de Logs do Sistema
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Exibindo {logs.length} de {logsPagination.totalLogs} logs
                  gravados no sistema
                </CardDescription>
              </div>

              {/* Filtro de Nível de Log */}
              <div className="flex items-center gap-1.5">
                {["ALL", "ERROR", "WARNING", "INFO"].map((lvl) => (
                  <Button
                    key={lvl}
                    size="sm"
                    variant={logFilter === lvl ? "default" : "outline"}
                    onClick={() => handleFilterChange(lvl)}
                    className="text-xs h-8 rounded-lg font-medium transition-all"
                  >
                    {lvl === "ALL" ? "Todos" : lvl}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 bg-muted/40 text-foreground rounded-b-xl font-mono text-xs max-h-[520px] overflow-y-auto space-y-2.5">
            {isLoading ? (
              <div className="flex items-center justify-center h-40 gap-2 text-muted-foreground">
                <Spinner className="h-5 w-5 text-primary" />
                <span>Buscando logs em tempo real...</span>
              </div>
            ) : logs.length === 0 ? (
              <p className="text-muted-foreground text-center py-10">
                Nenhum log registrado para este filtro.
              </p>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="group flex flex-col gap-2 p-3 rounded-xl bg-card border border-border/70 hover:border-border hover:bg-accent/40 transition-all duration-200 shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-muted-foreground font-mono text-[11px] flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md border border-border/40">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {new Date(log.created_at).toLocaleString("pt-BR")}
                      </span>

                      <Badge
                        variant="outline"
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md uppercase font-semibold ${
                          logLevelStyles[log.level] || "text-muted-foreground"
                        }`}
                      >
                        {log.level}
                      </Badge>

                      <span className="text-muted-foreground font-semibold">
                        [{log.source}]
                      </span>
                    </div>

                    {log.detail && (
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => setSelectedLog(log)}
                        className="text-primary hover:text-primary hover:bg-primary/10 text-[11px] h-6"
                      >
                        <Code className="h-3 w-3 mr-1" /> Stacktrace
                      </Button>
                    )}
                  </div>

                  {/* Informações da Reunião e Modelo Utilizado */}
                  {(log.client || log.meeting_title || log.model_used) && (
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      {(log.client || log.meeting_title) && (
                        <div className="flex items-center gap-2 text-primary/90 bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20 w-fit">
                          <Building2 className="h-3 w-3 shrink-0" />
                          <span className="font-semibold">{log.client}</span>
                          {log.meeting_title && (
                            <span>— {log.meeting_title}</span>
                          )}
                        </div>
                      )}

                      {log.model_used && (
                        <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md border border-purple-300 dark:border-purple-800/60 font-mono text-[10px]">
                          <Cpu className="h-3 w-3 shrink-0" />
                          <span>{log.model_used}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-foreground/90 leading-relaxed break-words font-mono">
                    {log.message}
                  </p>
                </div>
              ))
            )}
          </CardContent>

          {/* Paginação do Console de Logs */}
          <div className="p-4 border-t border-border/40">
            <PaginationControl
              currentPage={logsPage}
              totalPages={logsPagination.totalPages}
              onPageChange={(newPage) => setLogsPage(newPage)}
              isLoading={isLoading}
            />
          </div>
        </Card>
      </div>

      {/* Modal Visualizador de StackTrace de Erro */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2 text-base">
              <AlertTriangle className="h-5 w-5" /> StackTrace do Log #
              {selectedLog?.id}
            </DialogTitle>
            <DialogDescription className="text-xs pt-1">
              {selectedLog?.message}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 rounded-xl bg-muted/80 p-4 font-mono text-xs text-destructive overflow-x-auto max-h-[350px] border border-border">
            <pre>
              {selectedLog?.detail || "Nenhum detalhe adicional informado."}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
