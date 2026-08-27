import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Sparkles,
  User,
  RefreshCw,
  Loader2,
  SendHorizonal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const quickPrompts = [
  "Quais são os principais riscos desta conta?",
  "Resuma os próximos passos",
  "Como está o sentimento do cliente?",
];

const initialMessages = [
  {
    role: "assistant",
    content:
      "Olá! Sou o seu assistente de IA. Posso responder perguntas sobre esta reunião, os insights identificados e o sentimento do cliente.",
  },
];

export function MeetingChatbot() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  function answerQuestion(question) {
    const normalized = question.toLowerCase();
    if (normalized.includes("risco")) {
      return "Os principais riscos são a preocupação com a performance do módulo de relatórios e as menções a SAP e Senior como alternativas consideradas.";
    }
    if (normalized.includes("próxim") || normalized.includes("passo")) {
      return "Os próximos passos recomendados são acompanhar a atualização de performance do Q1, agendar uma demonstração para Financeiro e RH e enviar a documentação aprimorada.";
    }
    if (normalized.includes("sentimento")) {
      return "O sentimento geral foi positivo, com satisfação com a plataforma e a integração com o ERP, apesar da preocupação pontual com performance.";
    }
    return "Com base nesta reunião, o cliente demonstra boa satisfação e potencial de expansão. Também vale acompanhar a performance dos relatórios e os concorrentes mencionados.";
  }

  function handleSendQuestion(questionText) {
    if (!questionText.trim() || isTyping) return;

    const userMsg = { role: "user", content: questionText.trim() };
    setMessages((current) => [...current, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = answerQuestion(questionText);
      setMessages((current) => [
        ...current,
        { role: "assistant", content: botResponse },
      ]);
      setIsTyping(false);
    }, 3000);
  }

  function submitMessage(event) {
    event.preventDefault();
    handleSendQuestion(input);
  }

  function handleReset() {
    setMessages(initialMessages);
  }

  return (
    <Card className="border-border/80 bg-gradient-to-b from-card to-card/50 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
      {/* Header com destaque em degradê */}
      <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 ring-2 ring-primary/20">
              <Bot className="h-5 w-5" />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 border-2 border-background"></span>
              </span>
            </div>
            <div>
              <CardTitle className="text-base font-semibold tracking-tight">
                Assistente de IA da Reunião
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Análise de dados e insights em tempo real
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Reiniciar conversa"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 p-4 sm:p-6">
        {/* Prompts Rápidos */}
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <Button
              key={prompt}
              type="button"
              variant="outline"
              size="sm"
              className="h-auto py-0.5 border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 text-xs font-medium transition-all duration-200 whitespace-normal text-left shadow-xs"
              onClick={() => handleSendQuestion(prompt)}
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary shrink-0" />
              {prompt}
            </Button>
          ))}
        </div>

        {/* Timeline / Area de Chat */}
        <div className="relative flex h-[380px] flex-col gap-4 overflow-y-auto rounded-2xl border border-border/40 bg-background/50 p-4 shadow-inner">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex gap-3 transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-2 ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold shadow-xs ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                    : "bg-muted text-foreground ring-1 ring-border"
                }`}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4 text-primary" />
                )}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-xs"
                    : "bg-card border border-border/60 text-card-foreground rounded-tl-xs"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-center text-muted-foreground animate-pulse">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted ring-1 ring-border">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-card border border-border/60 px-4 py-3 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                Analisando reunião...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={submitMessage} className="flex items-center gap-2 pt-1">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Pergunte qualquer detalhe sobre a reunião..."
            aria-label="Pergunte sobre esta reunião"
            className="h-11 rounded-xl border-border/80 bg-background/80 focus-visible:ring-2 focus-visible:ring-primary shadow-xs"
          />
          <Button
            type="submit"
            size="icon"
            className="h-11 w-11 rounded-xl shadow-md shadow-primary/20 hover:scale-105 transition-all duration-200 shrink-0"
            disabled={!input.trim() || isTyping}
            aria-label="Enviar pergunta"
          >
            <SendHorizonal className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default MeetingChatbot;
