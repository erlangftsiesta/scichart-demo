import { TPriceBar } from "../../../types/types";

/**
 * Parses Kraken JSON candles into TPriceBar array
 * Kraken Response: [ [time, open, high, low, close, vwap, volume, count], ... ]
 */
const parseKrakenCandles = (candles: any[]): TPriceBar[] => {
  const priceBars: TPriceBar[] = [];

  candles.forEach((candle: any) => {
    const [timestamp, open, high, low, close, _, volume] = candle;

    priceBars.push({
      date: timestamp,
      open: parseFloat(open),
      high: parseFloat(high),
      low: parseFloat(low),
      close: parseFloat(close),
      volume: parseFloat(volume),
    });
  });

  return priceBars;
};

/**
 * Fetches candles from Kraken Rest API
 * Endpoint: https://api.kraken.com/0/public/OHLC
 */
const getCandles = async (
  symbol: string,
  interval: string,
  startTime?: Date,
  endTime?: Date,
): Promise<TPriceBar[]> => {
  const intervalMap: Record<string, number> = {
    "1m": 1,
    "5m": 5,
    "1h": 60,
    "1d": 1440,
  };
  const krakenInterval = intervalMap[interval] || 60;

  const krakenSymbol = symbol === "BTCUSDT" ? "XBTUSD" : symbol;

  let url = `https://api.kraken.com/0/public/OHLC?pair=${krakenSymbol}&interval=${krakenInterval}`;
  if (startTime) {
    url += `&since=${Math.floor(startTime.getTime() / 1000)}`;
  }

  try {
    console.log(`KrakenClient: Fetching ${krakenSymbol} ${interval}`);
    const response = await fetch(url);
    const data = await response.json();

    if (data.error && data.error.length > 0) {
      console.error("Kraken API Error:", data.error);
      return [];
    }

    const pairName = Object.keys(data.result).find((key) => key !== "last");
    if (pairName) {
      return parseKrakenCandles(data.result[pairName]);
    }
    return [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const krakenRestClient = {
  getCandles,
};
