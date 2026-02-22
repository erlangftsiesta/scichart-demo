# Direktori Chart Utils

Direktori ini berisi fungsi-fungsi pembantu (helper) untuk memisahkan logika rumit dari file utama grafik.

## Penjelasan Fungsi

### `ChartData.ts`

Mengurus segala hal tentang **DATA**.

- `setData`: Fungsi ini dipanggil saat pertama kali load history. Ia me-reset series dan mengisi data baru.
- `onNewTrade`: Fungsi ini dipanggil setiap ada data realtime (WebSocket). **Penting:** Fungsi ini sangat efisien, dia tidak me-render ulang seluruh grafik, tapi hanya menambah/mengupdate candle terakhir.

### `ChartControls.ts`

Mengumpulkan semua fungsi kontrol menjadi satu objek.
Objek inilah yang nantinya dikirim ke React (`App.tsx`) lewat `ref`. Jadi `App.tsx` bisa memanggil `chartControlsRef.current.setTool(...)` tanpa tahu detail implementasi SciChart.

### `TooltipBehavior.ts`

Berisi logika **Custom Tooltip** untuk anotasi Box.

- Fungsi `attachStatsTooltip`: Menempelkan elemen SVG ke sebuah anotasi.
- Fungsi ini juga mengatur logika klik tombol minimize/maximize pada tooltip tersebut.
- Setiap tooltip diberi ID unik agar tidak bentrok jika ada banyak box.
