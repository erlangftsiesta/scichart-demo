import { WebsocketBuilder } from "websocket-ts";
import { combineLatest, Observable, scan, skipWhile, take } from "rxjs";
import { TRealtimePriceBar, TTrade } from "../../../types/types";

const binanceDomain = "com";
const WSS_URL = `wss://stream.binance.${binanceDomain}:9443`;

export const tradeToCandle = (
  candle: TRealtimePriceBar,
  curr: { trade: TTrade; firstCandle: TRealtimePriceBar },
): TRealtimePriceBar => {
  candle = candle ?? curr.firstCandle;
  const trade = curr.trade;
  const price = trade.price;
  candle.lastTradeSize = trade.quantity;
  candle.lastTradeBuyOrSell = trade.isBuyerMaker;
  if (candle.closeTime > trade.eventTime) {
    // update existing candle
    candle.close = price;
    candle.volume += candle.lastTradeSize;
    if (price > candle.high) {
      candle.high = price;
    }
    if (price < candle.low) {
      candle.low = price;
    }
  } else {
    // new candle
    const candleSpan = candle.closeTime - candle.openTime;
    candle = {
      symbol: candle.symbol,
      interval: candle.interval,
      eventTime: trade.eventTime,
      openTime: candle.closeTime + 1,
      closeTime: candle.closeTime + 1 + candleSpan,
      open: price,
      high: price,
      low: price,
      close: price,
      volume: candle.lastTradeSize,
      lastTradeSize: candle.lastTradeSize,
      lastTradeBuyOrSell: candle.lastTradeBuyOrSell,
    };
  }
  return candle;
};

export const parseTrade = (trade: any) => {
  const t: TTrade = {
    symbol: trade.s,
    eventTime: trade.E,
    price: parseFloat(trade.p),
    quantity: parseFloat(trade.q),
    maker: false,
    isBuyerMaker: trade.m,
    tradeId: trade.a,
  };
  return t;
};

const parseKline = (kline: any) => {
  const pb: TRealtimePriceBar = {
    symbol: kline.s,
    eventTime: kline.E,
    openTime: kline.k.t,
    interval: kline.k.i,
    open: parseFloat(kline.k.o),
    high: parseFloat(kline.k.h),
    low: parseFloat(kline.k.l),
    close: parseFloat(kline.k.c),
    volume: parseFloat(kline.k.v),
    closeTime: kline.k.T,
    lastTradeSize: parseFloat(kline.k.v),
    lastTradeBuyOrSell: undefined,
  };
  return pb;
};

/**
 * Super simple binance websocket client.
 */
const getCandleStream = (symbol: string, interval: string) => {
  const obs = new Observable<TRealtimePriceBar>((subscriber) => {
    console.log("Connecting to binance klines for ", symbol, interval);
    const ws = new WebsocketBuilder(
      `${WSS_URL}/ws/${symbol.toLowerCase()}@kline_${interval}`,
    )
      .onMessage((i, ev) => {
        subscriber.next(parseKline(JSON.parse(ev.data)));
      })
      .build();

    return () => ws.close();
  });
  return obs;
};

const getTradeStream = (symbol: string) => {
  const obs = new Observable<TTrade>((subscriber) => {
    console.log("Connecting to binance trades for ", symbol);
    const ws = new WebsocketBuilder(
      `${WSS_URL}/ws/${symbol.toLowerCase()}@aggTrade`,
    )
      .onMessage((i, ev) => {
        subscriber.next(parseTrade(JSON.parse(ev.data)));
      })
      .build();

    return () => ws.close();
  });
  return obs;
};

const getRealtimeCandleStream = (symbol: string, interval: string) => {
  const trade$ = getTradeStream(symbol);
  const latestCandle$ = getCandleStream(symbol, interval).pipe(take(1));
  return combineLatest([trade$, latestCandle$]).pipe(
    skipWhile(([trade, candle]) => trade.eventTime < candle.eventTime),
    scan(
      (acc: TRealtimePriceBar, cur: [TTrade, TRealtimePriceBar]) =>
        tradeToCandle(acc, { trade: cur[0], firstCandle: cur[1] }),
      null,
    ),
  );
};

const getRandomCandleStream = (
  startBar: TRealtimePriceBar,
  interval: number,
) => {
  let p: TRealtimePriceBar = startBar;
  const rate = 300;
  const observable = new Observable<TRealtimePriceBar>(function subscribe(
    subscriber,
  ) {
    const intervalId = setInterval(() => {
      let r = Math.random() - 0.5;
      const close = p.close + p.close * (r / 3000);
      const size = Math.abs(r);
      const eventTime = p.eventTime + rate;
      const lastTradeSize = 10000 * Math.pow(size, 14);
      if (p.closeTime > eventTime) {
        p = {
          symbol: startBar.symbol,
          close,
          high: Math.max(p.high, close),
          low: Math.min(p.low, close),
          volume: p.volume + size,
          eventTime,
          open: p.open,
          openTime: p.openTime,
          closeTime: p.closeTime,
          interval: p.interval,
          lastTradeSize,
          lastTradeBuyOrSell: r > 0,
        };
      } else {
        p = {
          symbol: startBar.symbol,
          close,
          high: close,
          low: close,
          volume: size,
          eventTime,
          open: close,
          openTime: p.closeTime,
          closeTime: p.closeTime + interval,
          interval: p.interval,
          lastTradeSize,
          lastTradeBuyOrSell: r > 0,
        };
      }
      subscriber.next(p);
    }, rate);

    return function unsubscribe() {
      clearInterval(intervalId);
    };
  });
  return observable;
};

export const binanceSocketClient = {
  getCandleStream,
  getTradeStream,
  getRealtimeCandleStream,
  getRandomCandleStream,
};
