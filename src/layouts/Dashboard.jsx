import Header from "../components/dashboard/Header";
import Sidebar from "../components/dashboard/Sidebar";

export default function Dashboard() {
  return (
    <section className="flex w-full h-full">
      <Sidebar />

      <main className="flex-1">
        <Header
          title={"Dashboard"}
          subtitle={
            "Bem-vindo de volta, João. Aqui está o que está acontecendo."
          }
        />
        <div className="p-6">
          {/* Placeholder for main dashboard content */}
          <h2 className="text-2xl font-bold text-foreground">
            Bem-vindo ao Dashboard
          </h2>
          <p className="mt-2 text-muted-foreground">
            Aqui você pode acessar suas análises, reuniões e muito mais.
          </p>
        </div>
      </main>
    </section>
  );
}
