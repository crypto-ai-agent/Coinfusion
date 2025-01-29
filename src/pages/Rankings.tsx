import { CryptoTable } from "@/components/rankings/CryptoTable";
import { CryptoTabs } from "@/components/rankings/CryptoTabs";
import { WatchlistSection } from "@/components/rankings/WatchlistSection";

export const Rankings = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Cryptocurrency Rankings</h1>
      <CryptoTabs />
      <CryptoTable />
      <WatchlistSection />
    </div>
  );
};