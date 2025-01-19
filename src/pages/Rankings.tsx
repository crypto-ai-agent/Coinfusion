import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Rankings as RankingsSection } from "@/components/Rankings";

const RankingsPage = () => {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const tab = searchParams.get("tab");
    const listId = searchParams.get("list");
    const action = searchParams.get("action");
    
    if (tab === "watchlists") {
      // The WatchlistSection component will handle these parameters
      document.getElementById("rankings")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [searchParams]);

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