import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface HistoricalDataParams {
  id: string;
  interval?: string;
  count?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, params } = await req.json()
    const apiKey = Deno.env.get('CMC_API_KEY')
    
    if (!apiKey) {
      throw new Error('CMC_API_KEY not found')
    }

    let endpoint = '';
    let data;

    switch (action) {
      case 'historical':
        const { id, interval = 'daily', count = 30 } = params as HistoricalDataParams;
        endpoint = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/ohlcv/historical?id=${id}&interval=${interval}&count=${count}`;
        break;
      
      case 'realtime':
        endpoint = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest';
        if (params?.ids) {
          endpoint += `?id=${params.ids.join(',')}`;
        }
        break;

      default:
        throw new Error('Invalid action specified');
    }

    console.log(`Fetching from CoinMarketCap: ${endpoint}`);
    
    const response = await fetch(endpoint, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`CoinMarketCap API responded with status: ${response.status}`);
    }

    data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in crypto-data:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})