import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CryptoTable } from "./CryptoTable";
import type { CoinData } from "@/utils/types/crypto";

interface CryptoTabsProps {
  tokens: CoinData[];
  stablecoins: CoinData[];
  isLoading: boolean;
}

export const CryptoTabs = ({ tokens, stablecoins, isLoading }: CryptoTabsProps) => {
  return (
    <Tabs defaultValue="tokens" className="w-full">
      <TabsList className="w-full flex space-x-4 p-1 bg-white/10 backdrop-blur-lg rounded-xl mb-8">
        <TabsTrigger 
          value="tokens" 
          className="flex-1 py-3 rounded-lg data-[state=active]:bg-white/20 text-white hover:text-white/90"
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white">Cryptocurrencies</h3>
            <p className="text-sm text-gray-300 mt-1">
              Top performing digital assets
            </p>
          </div>
        </TabsTrigger>
        <TabsTrigger 
          value="stablecoins" 
          className="flex-1 py-3 rounded-lg data-[state=active]:bg-white/20 text-white hover:text-white/90"
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white">Stablecoins</h3>
            <p className="text-sm text-gray-300 mt-1">
              Price-stable cryptocurrencies
            </p>
          </div>
        </TabsTrigger>
      </TabsList>

      <div className="bg-white/95 backdrop-blur-lg rounded-xl p-6 shadow-lg">
        {isLoading ? (
          <div className="p-8 text-center text-gray-600">
            <div className="animate-pulse">Loading market data...</div>
          </div>
        ) : (
          <>
            <TabsContent value="tokens">
              <CryptoTable data={tokens} />
            </TabsContent>
            <TabsContent value="stablecoins">
              <CryptoTable data={stablecoins} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};