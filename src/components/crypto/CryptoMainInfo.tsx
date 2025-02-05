
import { CryptoHeader } from "./CryptoHeader";
import { CryptoMarketStats } from "./CryptoMarketStats";
import { CryptoAlerts } from "./CryptoAlerts";

interface CryptoMainInfoProps {
  name: string;
  symbol: string;
  logo: string;
  price_usd: number;
  percent_change_24h: number;
  market_cap_usd: number;
  volume_24h_usd: number;
  circulating_supply: number;
  max_supply: number;
  alerts?: string[];
  coin_id: string;  // Added this prop
}

export const CryptoMainInfo = ({
  name,
  symbol,
  logo,
  price_usd,
  percent_change_24h,
  market_cap_usd,
  volume_24h_usd,
  circulating_supply,
  max_supply,
  alerts,
  coin_id,  // Added this prop
}: CryptoMainInfoProps) => {
  return (
    <section className="bg-white rounded-lg shadow-lg p-6">
      <CryptoHeader
        name={name}
        symbol={symbol}
        logo={logo}
        price_usd={price_usd}
        percent_change_24h={percent_change_24h}
      />

      <CryptoMarketStats
        market_cap_usd={market_cap_usd}
        volume_24h_usd={volume_24h_usd}
        circulating_supply={circulating_supply}
        max_supply={max_supply}
        symbol={symbol}
      />

      <CryptoAlerts 
        alerts={alerts}
        coinId={coin_id}
        currentPrice={price_usd}
      />
    </section>
  );
};
