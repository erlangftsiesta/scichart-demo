import { WebsocketBuilder } from "websocket-ts";
import { Observable } from "rxjs";
import { TRealtimePriceBar } from "../../../types/types";

// Kraken WebSocket URL
const WSS_URL = "wss://ws.kraken.com";

/**
 * Parses Kraken OHLC Websocket Message
 * Format: [channelID, [time, etime, open, high, low, close, vwap, volume, count], channelName, pair]
 */
const parseObsevableMessage = (data: any): TRealtimePriceBar | null => {
  if (!Array.isArray(data)) return null;

  const [_, ohlcData, channelName, pair] = data;

  const [time, etime, open, high, low, close, vwap, volume, count] = ohlcData;

  const pb: TRealtimePriceBar = {
    symbol: pair,
    eventTime: Date.now(),
    openTime: parseFloat(time) * 1000,
    interval: "1h",
    open: parseFloat(open),
    high: parseFloat(high),
    low: parseFloat(low),
    close: parseFloat(close),
    volume: parseFloat(volume),
    closeTime: parseFloat(etime) * 1000,
    lastTradeSize: 0,
    lastTradeBuyOrSell: false,
  };
  return pb;
};

const getRealtimeCandleStream = (symbol: string, interval: string) => {
  const obs = new Observable<TRealtimePriceBar>((subscriber) => {
    const intervalMap: Record<string, number> = {
      "1m": 1,
      "5m": 5,
      "1h": 60,
      "1d": 1440,
    };
    const krakenInterval = intervalMap[interval] || 60;
    const krakenSymbol = symbol === "BTCUSDT" ? "XBT/USD" : symbol;

    console.log("Connecting to Kraken WS for", krakenSymbol);

    const ws = new WebsocketBuilder(WSS_URL)
      .onOpen((i, ev) => {
        console.log("Kraken WS Connected");
        i.send(
          JSON.stringify({
            event: "subscribe",
            pair: [krakenSymbol],
            subscription: {
              name: "ohlc",
              interval: krakenInterval,
            },
          }),
        );
      })
      .onMessage((i, ev) => {
        const data = JSON.parse(ev.data);
        if (data.event === "heartbeat") return;
        if (data.event === "systemStatus") return;
        if (data.event === "subscriptionStatus") {
          console.log("Kraken Subscription:", data);
          return;
        }

        const candle = parseObsevableMessage(data);
        if (candle) {
          subscriber.next(candle);
        }
      })
      .build();

    return () => ws.close();
  });

  return obs;
};

export const krakenSocketClient = {
  getRealtimeCandleStream,
};
