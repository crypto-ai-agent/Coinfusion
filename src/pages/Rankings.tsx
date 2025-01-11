import { Navigation } from "@/components/Navigation";
import { Rankings as RankingsSection } from "@/components/Rankings";

const RankingsPage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <RankingsSection />
      </div>
    </div>
  );
};

export default RankingsPage;