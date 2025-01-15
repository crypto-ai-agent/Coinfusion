import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Rankings } from "@/components/Rankings";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-primary/95">
      <Navigation />
      <Hero />
      <Rankings />
    </div>
  );
};

export default Index;