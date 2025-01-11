/**
 * Component that displays detailed information about a cryptocurrency
 * @component
 */
import { useQuery } from "@tanstack/react-query";
import { fetchCryptoDetails } from "@/utils/api";
import { CryptoMainInfo } from "./crypto/CryptoMainInfo";
import { CryptoTabs } from "./crypto/CryptoTabs";
import { CryptoLinks } from "./crypto/CryptoLinks";
import { CryptoDetailsSkeleton } from "./shared/CryptoDetailsSkeleton";
import { useToast } from "@/components/ui/use-toast";
import { ErrorBoundary } from "@/utils/errors/ErrorBoundary";

interface CryptoDetailsViewProps {
  cryptoId: string;
}

export const CryptoDetailsView = ({ cryptoId }: CryptoDetailsViewProps) => {
  const { toast } = useToast();
  const { data: crypto, isLoading } = useQuery({
    queryKey: ['cryptoDetails', cryptoId],
    queryFn: () => fetchCryptoDetails(cryptoId),
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error fetching crypto details",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });

  if (isLoading) {
    return <CryptoDetailsSkeleton />;
  }

  if (!crypto) {
    return <div className="container mx-auto px-4 py-8">Crypto not found</div>;
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          <CryptoMainInfo
            name={crypto.name}
            symbol={crypto.symbol}
            logo={crypto.logo}
            price_usd={crypto.price_usd}
            percent_change_24h={crypto.percent_change_24h}
            market_cap_usd={crypto.market_cap_usd}
            volume_24h_usd={crypto.volume_24h_usd}
            circulating_supply={crypto.circulating_supply}
            max_supply={crypto.max_supply}
            alerts={crypto.alerts}
          />

          <CryptoTabs crypto={crypto} />

          <CryptoLinks
            website={crypto.website}
            twitter_handle={crypto.twitter_handle}
            github_repo={crypto.github_repo}
            whitepaper={crypto.whitepaper}
            contract_address={crypto.contract_address}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};