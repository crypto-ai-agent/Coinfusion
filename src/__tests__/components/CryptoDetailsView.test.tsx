import { render, screen, waitFor } from '@testing-library/react';
import { CryptoDetailsView } from '@/components/CryptoDetailsView';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import * as api from '@/utils/api';

// Mock the API module
vi.mock('@/utils/api', () => ({
  fetchCryptoDetails: vi.fn(),
}));

const mockCryptoData = {
  name: 'Bitcoin',
  symbol: 'BTC',
  logo: 'bitcoin.png',
  price_usd: 48000,
  percent_change_24h: 2.5,
  market_cap_usd: 900000000000,
  volume_24h_usd: 30000000000,
  circulating_supply: 19000000,
  max_supply: 21000000,
  alerts: ['Price volatility alert'],
  description: 'Digital gold',
  category: 'Currency',
  launch_date: '2009-01-03',
  market_cap_dominance: 40,
  rank: 1,
  blockchain: 'Bitcoin',
  pros: ['Decentralized'],
  cons: ['Volatile'],
  high_24h: 50000,
  low_24h: 45000,
  price_history: [],
  investment_tips: ['DCA is recommended'],
  risk_level: 'medium' as const,
  volatility: 5,
  market_sentiment: 'neutral' as const,
  website: 'bitcoin.org',
  id: 'btc-bitcoin',
  is_stablecoin: false,
  type: 'cryptocurrency',
  contract_address: '',
  total_supply: 21000000,
};

describe('CryptoDetailsView', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  it('shows loading skeleton initially', () => {
    vi.mocked(api.fetchCryptoDetails).mockResolvedValue(mockCryptoData);

    render(
      <QueryClientProvider client={queryClient}>
        <CryptoDetailsView cryptoId="btc-bitcoin" />
      </QueryClientProvider>
    );

    expect(screen.getByTestId('crypto-details-skeleton')).toBeInTheDocument();
  });

  it('displays crypto information after loading', async () => {
    vi.mocked(api.fetchCryptoDetails).mockResolvedValue(mockCryptoData);

    render(
      <QueryClientProvider client={queryClient}>
        <CryptoDetailsView cryptoId="btc-bitcoin" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
      expect(screen.getByText('BTC')).toBeInTheDocument();
      expect(screen.getByText('$48,000.00')).toBeInTheDocument();
    });
  });

  it('shows error message when crypto is not found', async () => {
    vi.mocked(api.fetchCryptoDetails).mockResolvedValue(null);

    render(
      <QueryClientProvider client={queryClient}>
        <CryptoDetailsView cryptoId="invalid-id" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Crypto not found')).toBeInTheDocument();
    });
  });
});