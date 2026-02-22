import { Observable } from "rxjs";
import { simpleBinanceRestClient } from "./providers/binance/BinanceRest";
import { binanceSocketClient } from "./providers/binance/BinanceSocket";
import { krakenRestClient } from "./providers/kraken/KrakenRest";
import { krakenSocketClient } from "./providers/kraken/KrakenSocket";
import { ExampleDataProvider } from "./ExampleDataProvider";
import { TPriceBar, TRealtimePriceBar } from "../types/types";

export interface IChartDataProvider {
  id: string;
  label: string;
  getHistory: (
    symbol: string,
    interval: string,
    start: Date,
    end: Date,
  ) => Promise<TPriceBar[]>;
  getStream: (
    symbol: string,
    interval: string,
    lastBar: TPriceBar,
  ) => Observable<TRealtimePriceBar>;
}

export const CHART_PROVIDERS: Record<string, IChartDataProvider> = {
  binance: {
    id: "binance",
    label: "Binance.com",
    getHistory: async (symbol, interval, start, end) => {
      return await simpleBinanceRestClient.getCandles(
        symbol,
        interval,
        start,
        end,
        1000,
        "com",
      );
    },
    getStream: (symbol, interval) => {
      return binanceSocketClient.getRealtimeCandleStream(symbol, interval);
    },
  },

  kraken: {
    id: "kraken",
    label: "Kraken API",
    getHistory: async (symbol, interval, start, end) => {
      // For this demo, we map BTCUSDT to Kraken's XBTUSD
      return await krakenRestClient.getCandles(symbol, interval, start, end);
    },
    getStream: (symbol, interval) => {
      return krakenSocketClient.getRealtimeCandleStream(symbol, interval);
    },
  },

  random: {
    id: "random",
    label: "Random Generator",
    getHistory: async (symbol, interval, start, end) => {
      // Assuming 1h = 3600 seconds
      return ExampleDataProvider.getRandomCandles(350, 60000, start, 3600);
    },
    getStream: (symbol, interval, lastBar) => {
      const startBar: TRealtimePriceBar = {
        symbol: "Random",
        close: lastBar.close,
        high: lastBar.high,
        low: lastBar.low,
        volume: lastBar.volume,
        eventTime: new Date().getTime(),
        open: lastBar.open,
        openTime: lastBar.date * 1000,
        closeTime: (lastBar.date + 3600) * 1000, // + 1 hour
        interval: "1h",
        lastTradeSize: 0,
        lastTradeBuyOrSell: false,
      };
      return binanceSocketClient.getRandomCandleStream(startBar, 3600000);
    },
  },
};
