import { useQuery } from "@tanstack/react-query";
import { fetchCryptoPrices } from "@/utils/api";
import { CryptoTabs } from "./rankings/CryptoTabs";
import { useToast } from "@/components/ui/use-toast";
import { Database, Signal } from "lucide-react";

export const Rankings = () => {
  const { toast } = useToast();
  
  const { data: cryptos = [], isLoading, error } = useQuery({
    queryKey: ['cryptoPrices'],
    queryFn: fetchCryptoPrices,
    refetchInterval: 300000, // Refetch every 5 minutes
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error fetching crypto data",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });

  const tokens = cryptos.filter(crypto => !crypto.is_stablecoin);
  const stablecoins = cryptos.filter(crypto => crypto.is_stablecoin);

  return (
    <section id="rankings" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <div className="flex justify-center gap-4 mb-6">
            <Database className="h-12 w-12 text-secondary" />
            <Signal className="h-12 w-12 text-secondary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Live Market Data
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Real-time cryptocurrency prices and market statistics powered by advanced analytics
          </p>
        </div>

        <CryptoTabs 
          tokens={tokens} 
          stablecoins={stablecoins} 
          isLoading={isLoading} 
        />
      </div>
    </section>
  );
};