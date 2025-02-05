
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CryptoOverview } from "./CryptoOverview";
import { CryptoAnalysis } from "./CryptoAnalysis";
import { CryptoInvestmentTips } from "./CryptoInvestmentTips";
import type { CryptoDetails } from "@/utils/types/crypto";

interface CryptoTabsProps {
  crypto: CryptoDetails & { coin_id: string };
}

/**
 * Component that renders tabbed content for crypto details
 * @param {CryptoTabsProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
export const CryptoTabs = ({ crypto }: CryptoTabsProps) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analysis">Analysis</TabsTrigger>
        <TabsTrigger value="investment">Investment Guide</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <CryptoOverview 
          description={crypto.description}
          category={crypto.category}
          launch_date={crypto.launch_date}
          market_cap_dominance={crypto.market_cap_dominance}
          rank={crypto.rank}
          blockchain={crypto.blockchain}
        />
      </TabsContent>
      
      <TabsContent value="analysis">
        <CryptoAnalysis 
          name={crypto.name}
          pros={crypto.pros}
          cons={crypto.cons}
          high_24h={crypto.high_24h}
          low_24h={crypto.low_24h}
          price_usd={crypto.price_usd}
          price_history={crypto.price_history}
          coin_id={crypto.coin_id}
        />
      </TabsContent>
      
      <TabsContent value="investment">
        <CryptoInvestmentTips 
          name={crypto.name}
          tips={crypto.investment_tips}
          risk_level={crypto.risk_level}
          volatility={crypto.volatility}
          market_sentiment={crypto.market_sentiment}
        />
      </TabsContent>
    </Tabs>
  );
};
