import { render, screen } from '@testing-library/react';
import { CryptoMarketStats } from '@/components/crypto/CryptoMarketStats';
import { describe, it, expect } from 'vitest';

describe('CryptoMarketStats', () => {
  const defaultProps = {
    market_cap_usd: 1000000000000,
    volume_24h_usd: 50000000000,
    circulating_supply: 19000000,
    max_supply: 21000000,
    symbol: 'BTC'
  };

  it('renders all market statistics correctly', () => {
    render(<CryptoMarketStats {...defaultProps} />);
    
    expect(screen.getByText('Market Cap')).toBeInTheDocument();
    expect(screen.getByText('$1,000,000,000,000')).toBeInTheDocument();
    expect(screen.getByText('Volume (24h)')).toBeInTheDocument();
    expect(screen.getByText('$50,000,000,000')).toBeInTheDocument();
  });

  it('displays circulating supply with percentage when max supply exists', () => {
    render(<CryptoMarketStats {...defaultProps} />);
    
    expect(screen.getByText('19,000,000 BTC')).toBeInTheDocument();
    expect(screen.getByText('90.48% of max supply')).toBeInTheDocument();
  });

  it('handles null max supply correctly', () => {
    render(<CryptoMarketStats {...defaultProps} max_supply={null} />);
    
    expect(screen.getByText('∞ BTC')).toBeInTheDocument();
  });
});