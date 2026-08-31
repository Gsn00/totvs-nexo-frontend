import { CompetitorAlerts } from "../../components/dashboard/CompetitorAlerts";
import Header from "../../components/dashboard/Header";
import { KPICards } from "../../components/dashboard/KPICards";
import { RecentMeetings } from "../../components/dashboard/RecentMeetings";
import { SentimentChart } from "../../components/dashboard/SentimentChart";
import { TalkListenChart } from "../../components/dashboard/TalkListenChart";
import { getCurrentUserFromToken } from "../../utils/auth";

export default function HomePage() {
  const user = getCurrentUserFromToken();
  const name = user?.name.split(" ")[0];

  return (
    <div className="flex flex-col">
      <Header
        title={"Dashboard"}
        subtitle={
          "Bem-vindo(a) de volta, " +
          name +
          ". Aqui está o que está acontecendo."
        }
      />

      <div className="flex-1 space-y-6 p-4 lg:p-6">
        {/* KPI Cards */}
        <KPICards />

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TalkListenChart />
          <SentimentChart />
        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentMeetings />
          </div>
          <CompetitorAlerts />
        </div>
      </div>
    </div>
  );
}
