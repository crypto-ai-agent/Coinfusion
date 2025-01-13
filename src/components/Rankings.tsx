import { useQuery } from "@tanstack/react-query";
import { fetchCryptoPrices } from "@/utils/api";
import { CryptoTabs } from "./rankings/CryptoTabs";
import { useToast } from "@/components/ui/use-toast";

export const Rankings = () => {
  const { toast } = useToast();
  
  const { data: cryptos = [], isLoading, error } = useQuery({
    queryKey: ['cryptoPrices'],
    queryFn: fetchCryptoPrices,
    refetchInterval: 300000, // Refetch every 5 minutes
    onError: (error) => {
      toast({
        title: "Error fetching crypto data",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const tokens = cryptos.filter(crypto => !crypto.is_stablecoin);
  const stablecoins = cryptos.filter(crypto => crypto.is_stablecoin);

  return (
    <section id="rankings" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Crypto Rankings
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track the performance of top cryptocurrencies and stablecoins
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