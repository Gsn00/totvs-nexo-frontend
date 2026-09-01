import { useState, useRef } from "react";
import { FileText, Upload, Sparkles, CheckCircle2, X } from "lucide-react";
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
import { format } from "date-fns";
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
  const [timeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [analysisState, setAnalysisState] = useState("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Controle de arquivo e modo de entrada
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputMode, setInputMode] = useState("none"); // "text" | "file" | "none"

  // Refs para manipular elementos do DOM
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const navigate = useNavigate();

  // Extrai o texto preservando as quebras de linha brutas (\n)
  const extractRawTranscript = (content) => {
    if (!content) return "";

    const trimmed = content.trim();

    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        const parsed = JSON.parse(trimmed);
        const possibleKeys = [
          "ANON_TRANSCRICAO",
          "transcricao",
          "transcript",
          "text",
          "content",
          "TRANSCRICAO",
        ];

        for (const key of possibleKeys) {
          if (parsed[key] && typeof parsed[key] === "string") {
            // Escape reverso para preservar as quebras de linha no formato bruto
            return parsed[key]
              .replace(/\r\n/g, "\\n")
              .replace(/\n/g, "\\n")
              .replace(/\r/g, "\\r");
          }
        }
      } catch (e) {
        // Se falhar o parse JSON, usa o conteúdo bruto original
      }
    }

    return content;
  };

  // Ajusta a altura da textarea até o limite max-h-450px
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        450,
      )}px`;
    }
  };

  // Digitado / colado pelo usuário diretamente na textarea
  const handleTextChange = (e) => {
    const rawVal = e.target.value;
    const extracted = extractRawTranscript(rawVal);

    setTranscript(extracted);
    setInputMode(extracted.trim().length > 0 ? "text" : "none");

    setTimeout(adjustTextareaHeight, 0);
  };

  // Seleção de arquivo (.txt, .json)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setInputMode("file");

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;
      const extracted = extractRawTranscript(fileContent);
      setTranscript(extracted);

      setTimeout(adjustTextareaHeight, 0);
    };

    reader.readAsText(file);
  };

  // Limpa o arquivo selecionado e reseta os inputs do DOM
  const handleClearFile = (e) => {
    e.stopPropagation(); // Impede de abrir a janela de arquivo ao clicar no fechar
    setSelectedFile(null);
    setTranscript("");
    setInputMode("none");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  // Dispara o clique no input oculto de arquivo
  const triggerFileInput = () => {
    if (inputMode !== "text" && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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
      return;
    }

    for (let i = 0; i < analysisSteps.length; i++) {
      setCurrentStep(i);
      const stepProgress = ((i + 1) / analysisSteps.length) * 100;

      if (i !== analysisSteps.length - 1) {
        for (let p = progress; p <= stepProgress; p += 2) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          setProgress(p);
        }
      } else {
        setProgress(0);
      }
    }

    async function checkStatus() {
      try {
        const status = await apiFetch(`/meetings/${meetingId}/status`);

        if (!status || !status.ok) {
          setAnalysisState("failed");
          return;
        }

        const data = await status.json();

        if (data.status === "completed") {
          setProgress((prev) => {
            let current = prev;
            const interval = setInterval(() => {
              current += 2;
              if (current >= 100) {
                setProgress(100);
                clearInterval(interval);
              } else {
                setProgress(current);
              }
            }, 30);
            return prev;
          });

          await new Promise((resolve) => setTimeout(resolve, 800));
          setAnalysisState("completed");
          await new Promise((resolve) => setTimeout(resolve, 600));
          navigate(`/meetings/${meetingId}`);
        } else if (data.status === "failed") {
          setAnalysisState("failed");
        } else {
          setProgress((prev) => (prev < 99 ? prev + 1 : 99));
          setTimeout(checkStatus, 3000);
        }
      } catch (error) {
        console.error("Erro na conexão com o servidor:", error);
        setAnalysisState("failed");
      }
    }
    checkStatus();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header
        title="Nova Análise"
        subtitle="Analise uma transcrição de reunião com IA"
      />

      <div className="flex-1 p-4 lg:p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {analysisState === "idle" && (
            <>
              {/* Detalhes da Reunião */}
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

              {/* Transcrição Input */}
              <Card>
                <CardHeader>
                  <CardTitle>Transcrição</CardTitle>
                  <CardDescription>
                    Cole sua transcrição de reunião ou selecione um arquivo de
                    texto/json
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Container de Upload Customizado (Sem botão nativo duplicado) */}
                  <div
                    onClick={triggerFileInput}
                    className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all duration-200 ${
                      inputMode === "text"
                        ? "opacity-40 cursor-not-allowed border-border bg-muted/20"
                        : "border-border bg-muted/40 hover:border-primary/60 hover:bg-muted/70 cursor-pointer"
                    }`}
                  >
                    {/* Input nativo OCULTO para eliminar o botão "Escolher arquivo" duplicado */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.json,.doc,.docx"
                      onChange={handleFileUpload}
                      disabled={inputMode === "text"}
                      className="hidden"
                    />

                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />

                    {selectedFile ? (
                      <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg border border-primary/20 shadow-xs">
                        <span className="font-semibold text-xs truncate max-w-[280px]">
                          {selectedFile.name}
                        </span>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={handleClearFile}
                          className="h-5 w-5 text-muted-foreground hover:text-destructive hover:bg-transparent"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <p className="font-medium text-sm text-foreground">
                        {inputMode === "text"
                          ? "Upload desabilitado (texto colado no campo abaixo)"
                          : "Clique para selecionar um arquivo (.txt, .json)"}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/60" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground font-medium">
                        Ou cole diretamente
                      </span>
                    </div>
                  </div>

                  {/* Textarea com altura limite (max-h-[450px]) para não crescer infinitamente */}
                  <Textarea
                    ref={textareaRef}
                    placeholder={
                      inputMode === "file"
                        ? "Campo desabilitado porque um arquivo foi selecionado no topo."
                        : "Cole sua transcrição de reunião aqui...\n\nExemplo:\nJoão (Vendas): Obrigado por participar da chamada de hoje...\nMaria (Cliente): Estamos avaliando várias soluções incluindo..."
                    }
                    value={transcript}
                    onChange={handleTextChange}
                    disabled={inputMode === "file"}
                    className={`min-h-[180px] max-h-[450px] overflow-y-auto font-mono text-sm leading-relaxed resize-none transition-all duration-200 ${
                      inputMode === "file"
                        ? "opacity-50 cursor-not-allowed bg-muted/30"
                        : ""
                    }`}
                  />

                  <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5" />
                      {transcript.length > 0
                        ? `${transcript.split(/\s+/).filter(Boolean).length} palavras`
                        : "Sem conteúdo ainda"}
                    </span>
                    <span>Mínimo de 100 palavras recomendado</span>
                  </div>
                </CardContent>
              </Card>

              {/* Botão de Envio */}
              <Button
                size="lg"
                className="w-full gap-2 shadow-sm font-semibold"
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

          {/* Estado: Em Análise */}
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

          {/* Estado: Concluído */}
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

          {/* Estado: Erro */}
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
