import { useState, useEffect, useCallback } from 'react';
import type { MarketTelemetry } from '../types/portfolio';

const INITIAL_TELEMETRY: MarketTelemetry = {
  usdIdr: 15845,
  ihsg: 7342.10,
  ihsgDeltaPercent: 0.42,
  btcUsd: 76210,
  timestamp: new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' }),
  isMarketOpen: true,
};

export function useMarketTelemetry(pollIntervalMs = 60000): {
  telemetry: MarketTelemetry;
  refresh: () => Promise<void>;
  isLive: boolean;
} {
  const [telemetry, setTelemetry] = useState<MarketTelemetry>(INITIAL_TELEMETRY);
  const [isLive, setIsLive] = useState<boolean>(true);

  const fetchRates = useCallback(async () => {
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!response.ok) throw new Error('Network response not ok');

      const data = await response.json();
      const idrRate = data?.rates?.IDR ? Math.round(data.rates.IDR) : 15845;

      setTelemetry(prev => ({
        ...prev,
        usdIdr: idrRate,
        timestamp: new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB',
      }));
      setIsLive(true);
    } catch {
      setIsLive(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, pollIntervalMs);
    return () => clearInterval(interval);
  }, [fetchRates, pollIntervalMs]);

  return { telemetry, refresh: fetchRates, isLive };
}
