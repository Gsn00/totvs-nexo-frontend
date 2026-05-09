import { Eye, EyeOff } from "lucide-react";
import AnimatedPolygons from "../components/animated-polygons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    navigate("/dashboard");
  };

  return (
    <section className="flex w-full h-full">
      <div className="relative hidden w-4/7 flex-col justify-between bg-[#0a0f1a] lg:flex overflow-hidden p-12">
        <div className="absolute inset-0">
          <AnimatedPolygons />
        </div>
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-primary/10 blur-[100px]" />

        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-700">
          <img
            className="w-12 h-12 rounded-xl shadow-lg shadow-primary/30"
            src="totvs.png"
            alt="Logo TOTVS"
          />
          <h1 className="font-bold text-2xl font-display tracking-tight text-white">
            TOTVS
          </h1>
          <h1 className="text-2xl font-display tracking-tight text-primary">
            NEXO
          </h1>
        </div>

        <div className="relative z-10">
          <h1
            className="mb-6 font-display text-5xl font-bold leading-tight tracking-tight text-white animate-in fade-in slide-in-from-left-8 duration-700 delay-150"
            style={{ animationFillMode: "backwards" }}
          >
            Inteligência
            <br />
            Conversacional
            <br />
            <span className="text-primary">para seu Negócio</span>
          </h1>
          <p
            className="max-w-md text-lg leading-relaxed text-slate-400 animate-in fade-in slide-in-from-left-8 duration-700 delay-300"
            style={{ animationFillMode: "backwards" }}
          >
            Transforme transcrições de reuniões em insights acionáveis. Detecte
            riscos de churn, identifique oportunidades de crescimento e entenda
            o sentimento do cliente em tempo real.
          </p>

          {/* Feature Pills - Animated */}
          <div
            className="mt-10 flex flex-wrap gap-3 animate-in fade-in slide-in-from-left-8 duration-700 delay-500"
            style={{ animationFillMode: "backwards" }}
          >
            <span className="rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary backdrop-blur-sm transition-all hover:bg-primary/20 hover:scale-105">
              Detecção de Churn
            </span>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary backdrop-blur-sm transition-all hover:bg-primary/20 hover:scale-105">
              Análise de Sentimento
            </span>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary backdrop-blur-sm transition-all hover:bg-primary/20 hover:scale-105">
              Rastreio de Concorrentes
            </span>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary backdrop-blur-sm transition-all hover:bg-primary/20 hover:scale-105">
              Insights com IA
            </span>
          </div>
        </div>

        <div
          className="relative z-10 text-sm text-slate-500 animate-in fade-in duration-700 delay-700"
          style={{ animationFillMode: "backwards" }}
        >
          &copy; {new Date().getFullYear()} TOTVS S.A. Todos os direitos
          reservados.
        </div>
      </div>

      <div className="relative flex w-full flex-col justify-center px-8 lg:w-3/7 lg:px-16 bg-background">
        {/* Content */}
        <div className="relative z-10">
          {/* Mobile Logo - Animated */}
          <div className="mb-8 flex items-center gap-2 lg:hidden animate-in fade-in slide-in-from-top-4 duration-500">
            <img
              className="w-10 h-10 rounded-xl shadow-lg shadow-primary/30"
              src="totvs.png"
              alt="Logo TOTVS"
            />
            <h1 className="font-bold text-xl font-display tracking-tight text-white">
              TOTVS
            </h1>
            <h1 className="text-xl font-display tracking-tight text-primary">
              NEXO
            </h1>
          </div>

          <div className="mx-auto w-full max-w-md">
            {/* Glass Card - Animated */}
            <div
              className="rounded-2xl border border-border/50 bg-card p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200"
              style={{ animationFillMode: "backwards" }}
            >
              <div className="mb-8">
                <h2
                  className="font-display text-2xl font-bold tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300"
                  style={{ animationFillMode: "backwards" }}
                >
                  Bem-vindo de volta
                </h2>
                <p
                  className="mt-2 text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-500 delay-400"
                  style={{ animationFillMode: "backwards" }}
                >
                  Entre na sua conta para continuar
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div
                  className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-500"
                  style={{ animationFillMode: "backwards" }}
                >
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nome@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <div
                  className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-[550ms]"
                  style={{ animationFillMode: "backwards" }}
                >
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-primary hover:text-primary/90 transition-colors"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div
                  className="flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-[600ms]"
                  style={{ animationFillMode: "backwards" }}
                >
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Lembrar por 30 dias
                  </label>
                </div>

                <Button
                  type="submit"
                  className="h-12 w-full text-base font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-[650ms]"
                  style={{ animationFillMode: "backwards" }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner className="mr-2 h-5 w-5" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>

              <p
                className="mt-6 text-center text-sm text-muted-foreground animate-in fade-in duration-500 delay-700"
                style={{ animationFillMode: "backwards" }}
              >
                {"Não tem uma conta? "}
                <Link
                  href="/signup"
                  className="font-medium text-primary hover:text-primary/90 transition-colors"
                >
                  Contate seu administrador
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
