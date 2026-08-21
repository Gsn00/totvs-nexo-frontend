import { useState } from "react";
import { FileText, Upload, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import Header from "../../components/dashboard/Header";
import { useNavigate } from "react-router";
import { CalendarIcon, XCircle } from "lucide-react";
import { format, set } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { apiFetch } from "@/api/apiFetch";

const analysisSteps = [
  {
    id: 1,
    label: "Processando transcrição",
    description: "Analisando e limpando o texto",
  },
  {
    id: 2,
    label: "Extraindo entidades",
    description: "Identificando concorrentes, produtos e cargos",
  },
  {
    id: 3,
    label: "Analisando sentimento",
    description: "Detectando padrões emocionais",
  },
  {
    id: 4,
    label: "Finalizando análise",
    description: "Preparando o relatório final",
  },
];

export default function NewAnalysis() {
  const [transcript, setTranscript] = useState("");
  const [clientName, setClientName] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [timeZone, setTimeZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [analysisState, setAnalysisState] = useState("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (
      !transcript.trim() ||
      !clientName.trim() ||
      !meetingTitle.trim() ||
      !meetingDate
    )
      return;

    setAnalysisState("analyzing");
    setCurrentStep(0);
    setProgress(0);

    const date = format(meetingDate, "yyyy-MM-dd", { locale: ptBR });

    const body = new FormData();
    body.append("client", clientName);
    body.append("title", meetingTitle);
    body.append("date", date);
    body.append("transcription", transcript);

    let meetingId = null;
    const response = await apiFetch("/meetings", {
      method: "POST",
      body: body,
    });

    if (!response) {
      setAnalysisState("failed");
      return;
    }

    if (response.ok) {
      const data = await response.json();
      meetingId = data.id;
    } else {
      setAnalysisState("failed");
    }

    for (let i = 0; i < analysisSteps.length; i++) {
      setCurrentStep(i);
      const stepProgress = ((i + 1) / analysisSteps.length) * 100;

      if (i != analysisSteps.length - 1) {
        for (let p = progress; p <= stepProgress; p += 2) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          setProgress(p);
        }
      } else {
        setProgress(0);
      }
    }

    async function checkStatus() {
      const status = await apiFetch(`/meetings/${meetingId}/status`);
      if (status && status.ok) {
        const data = await status.json();

        if (data.status === "completed") {
          for (let p = progress; p <= 100; p += 2) {
            await new Promise((resolve) => setTimeout(resolve, 50));
            setProgress(p);
          }
          setAnalysisState("completed");
          await new Promise((resolve) => setTimeout(resolve, 800));
          navigate(`/meetings/${meetingId}`);
        } else if (data.status === "failed") {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          setAnalysisState("failed");
        } else {
          if (progress < 99) {
            setProgress((prev) => prev + 1);
          }
          setTimeout(checkStatus, 3000);
        }
      }
    }
    checkStatus();
  };

  const handleFileUpload = (e) => {
    // Simulate file reading
  };

  return (
    <div className="flex flex-col">
      <Header
        title="Nova Análise"
        subtitle="Analise uma transcrição de reunião com IA"
      />

      <div className="flex-1 p-4 lg:p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {analysisState === "idle" && (
            <>
              {/* Meeting Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes da Reunião</CardTitle>
                  <CardDescription>
                    Forneça informações sobre a reunião
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="client">Nome do Cliente</Label>
                      <Input
                        id="client"
                        placeholder="ex: Acme Corporation"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Título da Reunião</Label>
                      <Input
                        id="title"
                        placeholder="ex: Revisão de Negócios Q4"
                        value={meetingTitle}
                        onChange={(e) => setMeetingTitle(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Data da Reunião</Label>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />

                          {meetingDate ? (
                            format(meetingDate, "dd/MM/yyyy", { locale: ptBR })
                          ) : (
                            <span className="text-muted-foreground">
                              Selecione uma data
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={meetingDate}
                          onSelect={setMeetingDate}
                          locale={ptBR}
                          timeZone={timeZone}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardContent>
              </Card>

              {/* Transcript Input */}
              <Card>
                <CardHeader>
                  <CardTitle>Transcrição</CardTitle>
                  <CardDescription>
                    Cole sua transcrição de reunião ou envie um arquivo de texto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* File Upload */}
                  <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 transition-colors hover:border-primary/50">
                    <div className="text-center">
                      <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="mt-2 font-medium">
                        Envie um arquivo de transcrição
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ou arraste e solte
                      </p>
                      <Input
                        type="file"
                        accept=".txt,.doc,.docx"
                        onChange={handleFileUpload}
                        className="mt-4 w-auto"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        Ou cole diretamente
                      </span>
                    </div>
                  </div>

                  {/* Text Area */}
                  <Textarea
                    placeholder="Cole sua transcrição de reunião aqui...

Exemplo:
João (Vendas): Obrigado por participar da chamada de hoje...
Maria (Cliente): Estamos avaliando várias soluções incluindo..."
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    className="min-h-75 font-mono text-sm"
                  />

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {transcript.length > 0
                        ? `${transcript.split(/\s+/).filter(Boolean).length} palavras`
                        : "Sem conteúdo ainda"}
                    </span>
                    <span>Mínimo de 100 palavras recomendado</span>
                  </div>
                </CardContent>
              </Card>

              {/* Analyze Button */}
              <Button
                size="lg"
                className="w-full gap-2"
                onClick={handleAnalyze}
                disabled={
                  !transcript.trim() ||
                  !clientName.trim() ||
                  !meetingTitle.trim() ||
                  transcript.split(/\s+/).filter(Boolean).length < 10
                }
              >
                <Sparkles className="h-5 w-5" />
                Analisar Transcrição
              </Button>
            </>
          )}

          {/* Analysis in Progress */}
          {analysisState === "analyzing" && (
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Spinner className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Analisando Transcrição</CardTitle>
                <CardDescription>
                  Nossa IA está processando sua transcrição de reunião
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progresso Geral</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="space-y-3">
                  {analysisSteps.map((step, idx) => (
                    <div
                      key={step.id}
                      className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${
                        idx < currentStep
                          ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                          : idx === currentStep
                            ? "border-primary bg-primary/5"
                            : "border-border bg-muted/30"
                      }`}
                    >
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                          idx < currentStep
                            ? "bg-green-500 text-white"
                            : idx === currentStep
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {idx < currentStep ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : idx === currentStep ? (
                          <Spinner className="h-3 w-3" />
                        ) : (
                          <span className="text-xs">{step.id}</span>
                        )}
                      </div>
                      <div>
                        <p
                          className={`font-medium ${
                            idx <= currentStep
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analysis Completed */}
          {analysisState === "completed" && (
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Análise Completa!</CardTitle>
                <CardDescription>
                  Redirecionando você para os detalhes da reunião...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress
                  value={100}
                  className="h-2"
                  indicatorClassName="bg-green-500"
                />
              </CardContent>
            </Card>
          )}

          {/* Failed State */}
          {analysisState === "failed" && (
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                  <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>Falha na Análise</CardTitle>
                <CardDescription>
                  Ocorreu um erro durante a análise. Tente Novamente.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
