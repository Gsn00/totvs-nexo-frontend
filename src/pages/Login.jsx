import AnimatedPolygons from "../components/animated-polygons";

export default function Login() {
  return (
    <section className="flex w-full h-full">
      <div className="relative hidden w-1/2 flex-col justify-between bg-[#0a0f1a] lg:flex overflow-hidden p-12">
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

      <div className="flex w-full flex-col items-center justify-center bg-white p-12 lg:w-1/2">
        <h1 className="text-3xl font-bold mb-6">Bem-vindo de volta!</h1>
        <p className="text-gray-600 mb-8">Faça login para acessar sua conta</p>
      </div>
    </section>
  );
}
