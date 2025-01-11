import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchCryptoPrices, fetchCryptoDetails } from '../../utils/api';
import { retryWithBackoff } from '../../utils/helpers/retryLogic';
import type { CoinData } from '../../utils/types/crypto';

// Mock fetch
global.fetch = vi.fn();

describe('Crypto API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchCryptoPrices', () => {
    it('should return an array of crypto data', async () => {
      const mockCoins = [
        { id: 'btc-bitcoin', name: 'Bitcoin', symbol: 'BTC', rank: 1, is_active: true }
      ];
      
      const mockTickers = [{
        id: 'btc-bitcoin',
        quotes: {
          USD: {
            price: 50000,
            percent_change_24h: 5,
            market_cap: 1000000000000,
            volume_24h: 50000000000
          }
        }
      }];

      // Mock the API calls with proper Response objects
      vi.mocked(fetch)
        .mockImplementationOnce(() => Promise.resolve(new Response(
          JSON.stringify(mockCoins),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )))
        .mockImplementationOnce(() => Promise.resolve(new Response(
          JSON.stringify(mockTickers),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )));

      const result = await fetchCryptoPrices();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'btc-bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        price_usd: 50000,
      });
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(fetch).mockImplementationOnce(() => Promise.reject(new Error('API Error')));

      const result = await fetchCryptoPrices();
      expect(result).toEqual([]);
    });
  });

  describe('fetchCryptoDetails', () => {
    it('should fetch detailed crypto information', async () => {
      const mockCoin = {
        id: 'btc-bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        description: 'Digital gold',
        logo: 'bitcoin.png'
      };

      const mockTicker = {
        quotes: {
          USD: {
            price: 50000,
            percent_change_24h: 5,
            market_cap: 1000000000000,
            volume_24h: 50000000000,
            market_cap_dominance: 40
          }
        },
        circulating_supply: 19000000,
        max_supply: 21000000
      };

      vi.mocked(fetch)
        .mockImplementationOnce(() => Promise.resolve(new Response(
          JSON.stringify(mockCoin),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )))
        .mockImplementationOnce(() => Promise.resolve(new Response(
          JSON.stringify(mockTicker),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )));

      const result = await fetchCryptoDetails('btc-bitcoin');

      expect(result).toMatchObject({
        id: 'btc-bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        price_usd: 50000,
        circulating_supply: 19000000,
        max_supply: 21000000
      });
    });

    it('should retry failed requests', async () => {
      const mockError = new Error('API Error');
      const mockSuccess = {
        id: 'btc-bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC'
      };

      vi.mocked(fetch)
        .mockImplementationOnce(() => Promise.reject(mockError))
        .mockImplementationOnce(() => Promise.resolve(new Response(
          JSON.stringify(mockSuccess),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )));

      const result = await retryWithBackoff(() => fetch('test-url'));
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });
});