import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary to-blue-900 text-white py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Ultimate Guide to the Crypto World
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
            Learn, analyze, and make informed decisions in the cryptocurrency market
          </p>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="group"
              onClick={() => document.getElementById("education")?.scrollIntoView({ behavior: "smooth" })}
            >
              Start Learning
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
              onClick={() => document.getElementById("rankings")?.scrollIntoView({ behavior: "smooth" })}
            >
              View Rankings
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJWMTBoMnYyMHptLTIgMGgtMlYxMGgydjIwem0tMiAwaC0yVjEwaDJ2MjB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10" />
    </div>
  );
};