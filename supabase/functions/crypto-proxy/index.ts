import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { endpoint } = await req.json()
    const apiKey = Deno.env.get('CMC_API_KEY')
    
    if (!apiKey) {
      throw new Error('CMC_API_KEY not found')
    }

    console.log('Fetching from CoinMarketCap:', endpoint)
    
    const url = `https://pro-api.coinmarketcap.com/v1/${endpoint}`
    const response = await fetch(url, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`CoinMarketCap API responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in crypto-proxy:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})