import { Outlet } from "react-router";
import Sidebar from "../components/dashboard/Sidebar";

export default function Dashboard() {
  return (
    <section className="flex w-full h-full">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </section>
  );
}
