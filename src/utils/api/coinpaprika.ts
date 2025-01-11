import { CoinData, CryptoDetails } from '../types/crypto';
import { generateMockAnalysis } from '../mockAnalysisData';

export const fetchFromCoinpaprika = async (): Promise<CoinData[]> => {
  try {
    const coinsResponse = await fetch('https://api.coinpaprika.com/v1/coins');
    if (!coinsResponse.ok) throw new Error('Failed to fetch coins');
    
    const coins = await coinsResponse.json();
    const topCoins = coins
      .filter((coin: any) => coin.is_active && coin.rank > 0)
      .slice(0, 20);
    
    const tickersResponse = await fetch('https://api.coinpaprika.com/v1/tickers');
    if (!tickersResponse.ok) throw new Error('Failed to fetch tickers');
    
    const tickers = await tickersResponse.json();
    
    return topCoins.map((coin: any) => {
      const ticker = tickers.find((t: any) => t.id === coin.id);
      const isStablecoin = 
        coin.name.toLowerCase().includes('usd') || 
        coin.name.toLowerCase().includes('stable') ||
        coin.symbol.toLowerCase() === 'usdt' ||
        coin.type === 'stablecoin';
      
      return {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        price_usd: ticker?.quotes?.USD?.price || 0,
        percent_change_24h: ticker?.quotes?.USD?.percent_change_24h || 0,
        market_cap_usd: ticker?.quotes?.USD?.market_cap || 0,
        volume_24h_usd: ticker?.quotes?.USD?.volume_24h || 0,
        is_stablecoin: isStablecoin,
        type: isStablecoin ? 'stablecoin' : 'cryptocurrency',
      };
    });
  } catch (error) {
    console.error('Error fetching from Coinpaprika:', error);
    throw error;
  }
};

export const fetchCryptoDetailsCoinpaprika = async (id: string): Promise<CryptoDetails> => {
  const [coinResponse, tickerResponse] = await Promise.all([
    fetch(`https://api.coinpaprika.com/v1/coins/${id}`),
    fetch(`https://api.coinpaprika.com/v1/tickers/${id}`)
  ]);

  if (!coinResponse.ok || !tickerResponse.ok) {
    throw new Error('Coinpaprika API failed');
  }

  const coin = await coinResponse.json();
  const ticker = await tickerResponse.json();

  // Fetch historical data
  const now = new Date();
  const start = new Date(now.getTime() - (24 * 60 * 60 * 1000));
  const historicalResponse = await fetch(
    `https://api.coinpaprika.com/v1/coins/${id}/ohlcv/historical?start=${start.toISOString()}&end=${now.toISOString()}`
  );
  
  if (!historicalResponse.ok) {
    throw new Error('Historical data fetch failed');
  }

  const historical = await historicalResponse.json();
  const priceHistory = historical.map((h: any) => ({
    date: h.time_close,
    price: h.close,
    volume: h.volume,
  }));

  const isStablecoin = 
    coin.name.toLowerCase().includes('usd') || 
    coin.name.toLowerCase().includes('stable') ||
    coin.symbol.toLowerCase() === 'usdt';

  const mockAnalysis = generateMockAnalysis(
    ticker.quotes.USD.price,
    ticker.quotes.USD.percent_change_24h,
    ticker.quotes.USD.market_cap,
    ticker.quotes.USD.volume_24h,
    coin.name
  );

  return {
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    logo: coin.logo,
    description: coin.description,
    price_usd: ticker.quotes.USD.price,
    percent_change_24h: ticker.quotes.USD.percent_change_24h,
    market_cap_usd: ticker.quotes.USD.market_cap,
    volume_24h_usd: ticker.quotes.USD.volume_24h,
    is_stablecoin: isStablecoin,
    type: isStablecoin ? 'stablecoin' : 'cryptocurrency',
    contract_address: coin.contract_address || '',
    blockchain: coin.blockchain || 'N/A',
    price_history: priceHistory,
    circulating_supply: ticker.circulating_supply,
    max_supply: ticker.max_supply,
    total_supply: ticker.total_supply,
    high_24h: ticker.quotes.USD.high_24h || ticker.quotes.USD.price,
    low_24h: ticker.quotes.USD.low_24h || ticker.quotes.USD.price,
    rank: ticker.rank,
    market_cap_dominance: (ticker.quotes.USD.market_cap / 1e12) * 100,
    category: coin.type,
    launch_date: coin.started_at || '2009-01-03',
    website: coin.links?.website?.[0] || '#',
    twitter_handle: coin.links?.twitter?.[0]?.replace('https://twitter.com/', ''),
    github_repo: coin.links?.github?.[0] || '',
    whitepaper: coin.whitepaper?.link || '',
    alerts: [],
    ...mockAnalysis,
  };
};