/**
 * Displays key market statistics for a cryptocurrency
 * @component
 */
import { MetricCard } from "@/components/shared/MetricCard";

interface MarketStatsProps {
  /** Market capitalization in USD */
  market_cap_usd: number;
  /** 24-hour trading volume in USD */
  volume_24h_usd: number;
  /** Current circulating supply of the cryptocurrency */
  circulating_supply: number;
  /** Maximum supply of the cryptocurrency (if applicable) */
  max_supply: number | null;
  /** Symbol of the cryptocurrency */
  symbol: string;
}

export const CryptoMarketStats = ({
  market_cap_usd = 0,
  volume_24h_usd = 0,
  circulating_supply = 0,
  max_supply,
  symbol = ''
}: MarketStatsProps) => {
  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return '0';
    return num.toLocaleString();
  };

  const calculateCirculatingPercent = () => {
    if (!max_supply || !circulating_supply) return null;
    return ((circulating_supply / max_supply) * 100).toFixed(2);
  };

  const circulatingPercent = calculateCirculatingPercent();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <MetricCard
        label="Market Cap"
        value={`$${formatNumber(market_cap_usd)}`}
      />
      <MetricCard
        label="Volume (24h)"
        value={`$${formatNumber(volume_24h_usd)}`}
      />
      <MetricCard
        label="Circulating Supply"
        value={`${formatNumber(circulating_supply)} ${symbol}`}
        subValue={circulatingPercent ? `${circulatingPercent}% of max supply` : undefined}
      />
      <MetricCard
        label="Max Supply"
        value={`${max_supply ? formatNumber(max_supply) : '∞'} ${symbol}`}
      />
    </div>
  );
};