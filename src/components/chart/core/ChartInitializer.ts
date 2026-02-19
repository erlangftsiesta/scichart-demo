import { TResolvedReturnType } from "scichart-react";
import { createCandlestickChart } from "./ChartBuilder";
import { CHART_PROVIDERS } from "../../../services/ChartProviders";

export const createChartInitializer =
  (providerId: string, period: string) =>
  async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, controls } =
      await createCandlestickChart(rootElement);

    const provider = CHART_PROVIDERS[providerId] || CHART_PROVIDERS["random"];

    const endDate = new Date();
    const startDate = new Date();
    let interval = "1h";

    switch (period) {
      case "1D":
        interval = "5m";
        startDate.setDate(endDate.getDate() - 1);
        break;
      case "5D":
        interval = "15m";
        startDate.setDate(endDate.getDate() - 5);
        break;
      case "1M":
        interval = "1h";
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case "3M":
        interval = "4h";
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case "6M":
        interval = "12h";
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case "YTD":
        interval = "1d";
        startDate.setFullYear(endDate.getFullYear(), 0, 1);
        break;
      case "1Y":
        interval = "1d";
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      case "5Y":
        interval = "1w";
        startDate.setFullYear(endDate.getFullYear() - 5);
        break;
      case "All":
        interval = "1M";
        startDate.setFullYear(2017); // Reasonable start for crypto
        break;
      default:
        interval = "1h";
        startDate.setDate(endDate.getDate() - 1);
        break;
    }

    const priceBars = await provider.getHistory(
      "BTCUSDT",
      interval,
      startDate,
      endDate,
    );

    controls.setData(
      providerId === "random" ? "Random" : "BTC/USDT",
      priceBars,
    );

    // Set XRange to show the data.
    // For larger datasets, we might want to zoom in to the end?
    // User requested "1D: Last 24 hours", so we show everything we fetched.
    controls.setXRange(startDate, endDate);

    const lastBar = priceBars[priceBars.length - 1];
    if (lastBar) {
      const obs = provider.getStream("BTCUSDT", interval, lastBar);

      const subscription = obs.subscribe((pb) => {
        const priceBar = {
          date: pb.openTime,
          open: pb.open,
          high: pb.high,
          low: pb.low,
          close: pb.close,
          volume: pb.volume,
        };
        controls.onNewTrade(priceBar, pb.lastTradeSize, pb.lastTradeBuyOrSell);
      });
      return { sciChartSurface, subscription, controls };
    }

    return {
      sciChartSurface,
      subscription: { unsubscribe: () => {} },
      controls,
    };
  };
