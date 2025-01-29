import { useQuery } from "@tanstack/react-query";
import { fetchCryptoPrices } from "@/utils/api";
import { CryptoTable } from "@/components/rankings/CryptoTable";
import { CryptoTabs } from "@/components/rankings/CryptoTabs";
import { WatchlistSection } from "@/components/rankings/WatchlistSection";
import { useToast } from "@/hooks/use-toast";

const Rankings = () => {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Cryptocurrency Rankings</h1>
      <CryptoTabs 
        tokens={tokens} 
        stablecoins={stablecoins} 
        isLoading={isLoading} 
      />
      <CryptoTable data={cryptos} />
      <WatchlistSection allTokens={cryptos} />
    </div>
  );
};

export default Rankings;