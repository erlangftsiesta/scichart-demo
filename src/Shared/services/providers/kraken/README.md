# Kraken Provider

This folder contains the implementation for fetching data from Kraken.

## Files

- **`KrakenRest.ts`**: Handles fetching historical candlestick data via the Kraken Public REST API.
- **`KrakenSocket.ts`**: Handles subscribing to real-time candlestick data via the Kraken WebSocket API.

## API References

- **REST API**: `https://api.kraken.com/0/public/OHLC`
- **WebSocket API**: `wss://ws.kraken.com`

## Key Implementation Details

- **Interval Mapping**: Kraken uses minutes (1, 5, 60, 1440) for intervals, so we map our app's string intervals ("1h", "1d") to these integers.
- **Symbol Mapping**: Kraken uses specific pair names (e.g., `XBT/USD` for Bitcoin). We handle this mapping internally in the provider.
