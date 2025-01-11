import { Navigation } from "@/components/Navigation";
import { News as NewsSection } from "@/components/News";

const NewsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20">
        <NewsSection />
      </div>
    </div>
  );
};

export default NewsPage;