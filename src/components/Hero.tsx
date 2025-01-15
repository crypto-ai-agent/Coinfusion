import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <div className="relative min-h-[56vh]"> {/* Reduced from 80vh to 56vh (30% reduction) */}
      {/* Background with gradient and 3D effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F2C] to-[#2C1F3B] z-0">
        {/* Animated particles/dots effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
            animation: 'moveBackground 20s linear infinite',
            transform: 'perspective(1000px) rotateX(30deg)',
            transformOrigin: 'center center'
          }} />
        </div>
      </div>
      
      {/* Animated grid with 3D perspective */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(to right, #80808012 1px, transparent 1px),
                    linear-gradient(to bottom, #80808012 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
        transform: 'perspective(1000px) rotateX(30deg)',
        transformOrigin: 'center center',
      }} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12"> {/* Reduced padding */}
        <div className="text-center space-y-4"> {/* Reduced spacing */}
          <div className="space-y-3"> {/* Reduced spacing */}
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] animate-fade-in">
              CoinFusion
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto animate-fade-in delay-200">
              AI-Powered Crypto Analytics for the Future of Finance
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in delay-300">
            <Button
              size="lg"
              className="bg-[#8B5CF6] text-white hover:bg-[#7C3AED] transition-all duration-300 transform hover:scale-105"
              onClick={() => document.getElementById("rankings")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore Markets
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#D946EF] text-[#D946EF] hover:bg-[#D946EF]/10"
            >
              Watch Demo
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8 text-white/90 animate-fade-in delay-400"> {/* Reduced gap and margin */}
            {[
              { label: "Active Users", value: "100K+" },
              { label: "Daily Transactions", value: "$2.5M" },
              { label: "Supported Coins", value: "500+" },
              { label: "Market Updates", value: "24/7" },
            ].map((stat, index) => (
              <div key={index} className="space-y-2 bg-white/5 backdrop-blur-sm rounded-lg p-4 hover:bg-white/10 transition-colors">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJWMTBoMnYyMHptLTIgMGgtMlYxMGgydjIwem0tMiAwaC0yVjEwaDJ2MjB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-5 z-0" />
    </div>
  );
};