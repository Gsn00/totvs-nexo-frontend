import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Reuniões", href: "/meetings", icon: Calendar },
  { name: "Nova Análise", href: "/new-analysis", icon: PlusCircle },
];

export default function MobileSidebar() {
  const { pathname } = useLocation();

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
        <img
          className="w-10 h-10 rounded-xl shadow-lg shadow-primary/30"
          src="/totvs.png"
          alt="Logo TOTVS"
        />
        <h1 className="font-bold text-xl font-display tracking-tight text-foreground">
          TOTVS
        </h1>
        <h1 className="font-light text-xl font-display tracking-tight text-primary">
          NEXO
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-sidebar-border p-2">
        <Link
          to="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <Settings className="h-5 w-5 shrink-0" />
          <span>Configurações</span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Sair</span>
        </Link>
      </div>
    </div>
  );
}
