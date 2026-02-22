# Binance Provider

This folder contains the implementation for fetching data from Binance.

## Files

- **`BinanceRest.ts`**: Handles fetching historical candlestick data via the Binance Public REST API.
- **`BinanceSocket.ts`**: Handles subscribing to real-time candlestick data via the Binance WebSocket API.

## API References

- **REST API**: `https://api.binance.com/api/v3/klines`
- **WebSocket API**: `wss://stream.binance.com:9443/ws`

## Key Implementation Details

- **`getCandles`**: Fetches historical klines.
- **`tradeToCandle`**: A helper function to aggregate individual trades into a candlestick, used for real-time updates.
