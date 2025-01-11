import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Bar, ComposedChart } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PriceHistoryData {
  date: string;
  price: number;
  volume: number;
}

interface CryptoPriceChartProps {
  price_history: PriceHistoryData[];
}

export const CryptoPriceChart = ({ price_history }: CryptoPriceChartProps) => {
  const [timeframe, setTimeframe] = useState("24h");

  return (
    <section className="bg-white rounded-lg shadow-lg p-6">
      <Tabs defaultValue="24h" onValueChange={setTimeframe}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Price Chart</h2>
          <TabsList>
            <TabsTrigger value="24h">24h</TabsTrigger>
            <TabsTrigger value="7d">7d</TabsTrigger>
            <TabsTrigger value="1m">1m</TabsTrigger>
            <TabsTrigger value="1y">1y</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={timeframe} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={price_history}>
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
                      <div className="bg-white p-4 border rounded shadow-lg">
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