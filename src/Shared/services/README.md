# Direktori Services

Direktori ini berisi logika bisnis utama dan layanan data untuk aplikasi.

## File-file Penting

- **`types.ts`**: Berisi definisi tipe TypeScript yang digunakan bersama oleh berbagai service dan provider (contoh: `TPriceBar` untuk data candle, `TRealtimePriceBar` untuk data realtime).
- **`ChartProviders.ts`**: Registry pusat untuk semua penyedia data grafik. Di sini Anda mendaftarkan provider baru agar muncul di dropdown UI tanpa perlu mengubah kode UI.
- **`ExampleDataProvider.ts`**: Kelas utilitas untuk menghasilkan data mock/acak untuk keperluan testing atau demo.

## Sub-direktori

- **`providers/`**: Berisi implementasi spesifik untuk setiap penyedia data (contoh: Binance, Kraken).

## Cara Maintenance

1.  **Menambah Provider Baru**:
    - Buat folder baru di dalam `providers/` (misal: `providers/coinbase/`).
    - Implementasikan client REST dan WebSocket di dalamnya.
    - Daftarkan object provider baru tersebut ke dalam `ChartProviders.ts`.
2.  **Mengubah Struktur Data**:
    - Jika Anda perlu mengubah bentuk data (misal menambah field baru di candle), update file `types.ts`.
    - Pastikan untuk mengupdate semua file di dalam folder `providers/` agar sesuai dengan tipe data yang baru.
