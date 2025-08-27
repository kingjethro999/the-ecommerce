import { StatsCards } from "@/components/stats-cards";
import { DashboardMetrics } from "../components/dashboard-metrics";
import { DashboardOverview } from "../components/dashboard-overview";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your store performance.
        </p>
      </div>
      {/* <StatsCards /> */}
      <DashboardMetrics />
      {/* <ChartAreaInteractive /> */}

      {/* Recent Orders Section */}
      <DashboardOverview />
    </div>
  );
}
