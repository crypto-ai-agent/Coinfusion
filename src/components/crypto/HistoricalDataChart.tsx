
import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice, formatMarketCap } from "@/utils/formatters";
import { Skeleton } from "@/components/ui/skeleton";

interface HistoricalDataChartProps {
  coinId: string;
}

interface PriceData {
  timestamp: string;
  price_usd: number;
  volume_24h_usd: number;
}

export const HistoricalDataChart = ({ coinId }: HistoricalDataChartProps) => {
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d" | "1y">("24h");
  const [data, setData] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setIsLoading(true);
      try {
        const intervalMap = {
          "24h": "1 day",
          "7d": "7 days",
          "30d": "30 days",
          "1y": "365 days"
        };

        const { data: historyData, error } = await supabase
          .from("price_history")
          .select("timestamp, price_usd, volume_24h_usd")
          .eq("coin_id", coinId)
          .gte("timestamp", `now() - interval '${intervalMap[timeframe]}'`)
          .order("timestamp", { ascending: true });

        if (error) throw error;
        setData(historyData || []);
      } catch (error) {
        console.error("Error fetching historical data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoricalData();
  }, [coinId, timeframe]);

  if (isLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <div className="space-y-4">
      <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as typeof timeframe)}>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Price History</h3>
          <TabsList>
            <TabsTrigger value="24h">24h</TabsTrigger>
            <TabsTrigger value="7d">7d</TabsTrigger>
            <TabsTrigger value="30d">30d</TabsTrigger>
            <TabsTrigger value="1y">1y</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={timeframe}>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(timestamp) => {
                    const date = new Date(timestamp);
                    return timeframe === "24h"
                      ? date.toLocaleTimeString()
                      : date.toLocaleDateString();
                  }}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => formatPrice(value)}
                />
                <Tooltip
                  labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
                  formatter={(value: number) => [formatPrice(value), "Price"]}
                />
                <Area
                  type="monotone"
                  dataKey="price_usd"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
