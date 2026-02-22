# Direktori Providers

Direktori ini menampung implementasi spesifik untuk berbagai sumber data cryptocurrency.

## Struktur Data Provider

Setiap folder provider biasanya berisi dua file utama:

1.  **`[Provider]Rest.ts`**: Menangani pengambilan data historis (menggunakan HTTP Request biasa).
2.  **`[Provider]Socket.ts`**: Menangani streaming data real-time (menggunakan WebSocket).

## Provider yang Sudah Ada

- **`binance/`**: Integrasi dengan Binance Public Data API.
- **`kraken/`**: Integrasi dengan Kraken Public Data API.

## Panduan: Cara Menambah Provider Baru

Misalnya, kita ingin menambahkan provider "KuCoin".

### Langkah 1: Buat Folder

Buat folder baru: `src/services/providers/kucoin/`.

### Langkah 2: Implementasi REST Client (`KuCoinRest.ts`)

Buat file `KuCoinRest.ts` untuk mengambil data historis (History).
Fungsi utamanya adalah `getCandles` yang harus mengembalikan `Promise<TPriceBar[]>`.

```typescript
import { TPriceBar } from "../../types";

const getCandles = async (
  symbol: string,
  interval: string,
  start: Date,
  end: Date,
): Promise<TPriceBar[]> => {
  // 1. Panggil API KuCoin
  const url = `...`;
  const res = await fetch(url);
  const data = await res.json();

  // 2. Mapping data dari format KuCoin ke format TPriceBar aplikasi kita
  return data.map((item) => ({
    date: item[0],
    open: parseFloat(item[1]),
    // ... dst
  }));
};

export const kucoinRestClient = { getCandles };
```

### Langkah 3: Implementasi WebSocket Client (`KuCoinSocket.ts`)

Buat file `KuCoinSocket.ts` untuk data real-time.
Fungsi utamanya adalah `getRealtimeCandleStream` yang harus mengembalikan `Observable<TRealtimePriceBar>`.

```typescript
import { Observable } from "rxjs";
import { TRealtimePriceBar } from "../../types";

const getRealtimeCandleStream = (symbol: string, interval: string) => {
  return new Observable<TRealtimePriceBar>((subscriber) => {
    // 1. Konek ke WebSocket KuCoin
    const ws = new WebSocket("wss://...");

    ws.onmessage = (event) => {
      // 2. Parse data dan kirim ke subscriber
      const candle = parseKuCoinData(event.data);
      subscriber.next(candle);
    };

    return () => ws.close(); // Cleanup saat unsubscribe
  });
};

export const kucoinSocketClient = { getRealtimeCandleStream };
```

### Langkah 4: Registrasi Provider

Buka file `src/services/ChartProviders.ts` dan tambahkan entry baru:

```typescript
import { kucoinRestClient } from "./providers/kucoin/KuCoinRest";
import { kucoinSocketClient } from "./providers/kucoin/KuCoinSocket";

export const CHART_PROVIDERS = {
  // ... provider lain ...
  kucoin: {
    id: "kucoin",
    label: "KuCoin API", // Nama yang tampil di dropdown
    getHistory: kucoinRestClient.getCandles,
    getStream: kucoinSocketClient.getRealtimeCandleStream,
  },
};
```

Selesai! "KuCoin API" akan otomatis muncul di menu aplikasi.
