import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Education } from "@/components/Education";
import { Rankings } from "@/components/Rankings";
import { News } from "@/components/News";
import { PopularGuides } from "@/components/PopularGuides";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Education />
      <PopularGuides />
      <Rankings />
      <News />
    </div>
  );
};

export default Index;