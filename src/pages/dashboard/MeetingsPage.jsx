import { useState, useEffect } from "react";
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
import { apiFetch } from "../../api/apiFetch";

const sentimentStyles = {
  positive: "bg-green-500/10 text-green-600 dark:text-green-400",
  neutral: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  negative: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const healthScoreColor = (score) => {
  if (score >= 70) return "bg-green-500";
  if (score >= 40) return "bg-yellow-500";
  return "bg-red-500";
};

export default function MeetingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState(null);
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await apiFetch("/meetings/with-analysis");

        if (!response) return;

        const data = await response.json();
        setMeetings(data);
      } catch (error) {
        console.error("Erro ao buscar reuniões:", error);
      }
    };
    fetchMeetings();
  }, []);

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
                  {meetings.length} reuniões encontradas
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

                    <TableHead className="w-35">Score de Saúde</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Sentimento
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meetings.map((meeting) => (
                    <TableRow key={meeting.meeting.id}>
                      <TableCell className="font-medium">
                        <Link
                          to={`/meetings/${meeting.meeting.id}`}
                          className="hover:text-primary"
                        >
                          {meeting.meeting.client}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/meetings/${meeting.meeting.id}`}
                          className="hover:text-primary"
                        >
                          {meeting.meeting.title}
                        </Link>
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {new Date(
                          meeting.meeting.date.replace(/-/g, "/"),
                        ).toLocaleDateString("pt-BR", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">
                              {meeting.analysis.health_score}
                            </span>
                            <span className="text-muted-foreground">/100</span>
                          </div>
                          <Progress
                            value={meeting.analysis.health_score}
                            className="h-1.5"
                            indicatorClassName={healthScoreColor(
                              meeting.analysis.health_score,
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex flex-wrap gap-1">
                          <Badge
                            key={meeting.analysis.sentiment}
                            className={
                              sentimentStyles[meeting.analysis.sentiment] ||
                              "bg-muted"
                            }
                          >
                            {meeting.analysis.sentiment}
                          </Badge>
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
