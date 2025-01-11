import { render, screen, fireEvent } from '@testing-library/react';
import { CryptoTabs } from '@/components/crypto/CryptoTabs';
import { describe, it, expect } from 'vitest';

const mockCryptoData = {
  name: 'Bitcoin',
  description: 'Digital gold',
  category: 'Currency',
  launch_date: '2009-01-03',
  market_cap_dominance: 40,
  rank: 1,
  blockchain: 'Bitcoin',
  pros: ['Decentralized', 'Limited supply'],
  cons: ['High volatility', 'Energy consumption'],
  high_24h: 50000,
  low_24h: 45000,
  price_usd: 48000,
  price_history: [],
  investment_tips: ['DCA is recommended'],
  risk_level: 'medium' as const,
  volatility: 5,
  market_sentiment: 'neutral' as const,
  symbol: 'BTC',
  id: 'btc-bitcoin',
  volume_24h_usd: 30000000000,
  market_cap_usd: 900000000000,
  is_stablecoin: false,
  type: 'cryptocurrency',
  logo: 'bitcoin.png',
  contract_address: '',
  circulating_supply: 19000000,
  max_supply: 21000000,
  total_supply: 21000000,
  website: 'bitcoin.org',
  percent_change_24h: 2.5,
};

describe('CryptoTabs', () => {
  it('renders all tab triggers', () => {
    render(<CryptoTabs crypto={mockCryptoData} />);
    
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Analysis')).toBeInTheDocument();
    expect(screen.getByText('Investment Guide')).toBeInTheDocument();
  });

  it('shows overview content by default', () => {
    render(<CryptoTabs crypto={mockCryptoData} />);
    
    expect(screen.getByText('Digital gold')).toBeInTheDocument();
  });

  it('switches content when clicking different tabs', () => {
    render(<CryptoTabs crypto={mockCryptoData} />);
    
    // Click Analysis tab
    fireEvent.click(screen.getByText('Analysis'));
    expect(screen.getByText('24h Price Analysis')).toBeInTheDocument();

    // Click Investment Guide tab
    fireEvent.click(screen.getByText('Investment Guide'));
    expect(screen.getByText('Investment Tips')).toBeInTheDocument();
  });
});