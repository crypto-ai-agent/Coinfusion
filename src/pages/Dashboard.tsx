import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { LearningProgress } from "@/components/dashboard/LearningProgress";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { WatchlistDashboard } from "@/components/dashboard/WatchlistDashboard";

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardStats />
        <WatchlistDashboard />
        <LearningProgress />
        <RecentActivity />
      </div>
    </div>
  );
};

export default Dashboard;