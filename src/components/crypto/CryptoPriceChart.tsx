
import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Bar, ComposedChart } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

interface PriceHistoryData {
  date: string;
  price: number;
  volume: number;
}

interface CryptoPriceChartProps {
  price_history: PriceHistoryData[];
  coin_id: string;
}

type TimeframeInterval = {
  value: number;
  unit: 'hours' | 'days';
};

export const CryptoPriceChart = ({ price_history, coin_id }: CryptoPriceChartProps) => {
  const [timeframe, setTimeframe] = useState("24h");
  const [historicalData, setHistoricalData] = useState<PriceHistoryData[]>(price_history);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      const intervalMap: Record<string, TimeframeInterval> = {
        "24h": { value: 24, unit: 'hours' },
        "7d": { value: 7, unit: 'days' },
        "1m": { value: 30, unit: 'days' },
        "1y": { value: 365, unit: 'days' },
      };

      const interval = intervalMap[timeframe];
      const timeAgo = new Date();
      if (interval.unit === 'hours') {
        timeAgo.setHours(timeAgo.getHours() - interval.value);
      } else {
        timeAgo.setDate(timeAgo.getDate() - interval.value);
      }

      const { data, error } = await supabase
        .from('price_history')
        .select('price_usd, volume_24h_usd, timestamp')
        .eq('coin_id', coin_id)
        .gte('timestamp', timeAgo.toISOString())
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Error fetching historical data:', error);
        return;
      }

      const formattedData = data.map(item => ({
        date: item.timestamp,
        price: item.price_usd,
        volume: item.volume_24h_usd || 0
      }));

      setHistoricalData(formattedData);
    };

    fetchHistoricalData();
  }, [timeframe, coin_id]);

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <Tabs defaultValue="24h" onValueChange={setTimeframe}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white">Price Chart</h2>
          <TabsList>
            <TabsTrigger value="24h">24h</TabsTrigger>
            <TabsTrigger value="7d">7d</TabsTrigger>
            <TabsTrigger value="1m">1m</TabsTrigger>
            <TabsTrigger value="1y">1y</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={timeframe} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={historicalData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a365d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1a365d" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => {
                  const d = new Date(date);
                  switch(timeframe) {
                    case '24h':
                      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    case '7d':
                    case '1m':
                      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
                    default:
                      return d.toLocaleDateString([], { month: 'short', year: '2-digit' });
                  }
                }}
              />
              <YAxis 
                yAxisId="left"
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const price = Number(payload[0].value);
                    const volume = Number(payload[1].value);
                    return (
                      <div className="bg-white dark:bg-gray-800 p-4 border rounded shadow-lg">
                        <p className="font-bold">${price.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(payload[0].payload.date).toLocaleString()}
                        </p>
                        <p className="text-sm">
                          Volume: ${volume.toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="price"
                stroke="#1a365d"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
              <Bar
                yAxisId="right"
                dataKey="volume"
                fill="#f6ad55"
                opacity={0.5}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </section>
  );
};
