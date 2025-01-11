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
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="tokens" className="relative group">
          <div className="flex flex-col items-center p-4">
            <h3 className="text-lg font-semibold">Cryptocurrencies & Tokens</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-md opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity">
              Digital assets representing value or utility in decentralized projects
            </p>
          </div>
        </TabsTrigger>
        <TabsTrigger value="stablecoins" className="relative group">
          <div className="flex flex-col items-center p-4">
            <h3 className="text-lg font-semibold">Stablecoins</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-md opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity">
              Digital assets designed to maintain a stable value
            </p>
          </div>
        </TabsTrigger>
      </TabsList>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">Loading crypto data...</div>
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