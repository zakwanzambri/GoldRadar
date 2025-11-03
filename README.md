# Gold Breakout Scanner 🥇

Sistem pemindaian breakout automatik untuk XAU/USD dengan analisis teknikal masa nyata dan pengesanan corak AI.

## ✨ Ciri-ciri Utama

### 📊 Paparan Chart Live
- Chart XAU/USD masa nyata menggunakan TradingView Lightweight Charts
- Indikator support/resistance automatik
- Timeframe berbeza: M15, H1, H4, Daily
- Kawalan zoom dan auto-scale

### 🔍 Algoritma Pengesanan Breakout
- **High/Low Range Breakout**: Kesan pecahan tahap tinggi/rendah
- **Trendline Breakout**: Analisis pecahan garis trend naik/turun
- **Consolidation Zone Breakout**: Pengesanan pecahan zon konsolidasi
- **Volume Spike Confirmation**: Pengesahan dengan lonjakan volum

### 🚨 Sistem Alert & Signal
- Alert automatik bila breakout dikesan
- Notifikasi browser dan bunyi
- Skor keyakinan berdasarkan analisis teknikal
- Paparan signal terkini dengan masa dan jenis breakout

### 📈 Pengesanan Corak AI
- **Ascending Triangle**: Segi tiga menaik
- **Double Top/Bottom**: Puncak/dasar berganda
- **Head & Shoulders**: Kepala dan bahu
- Skor keyakinan untuk setiap corak

### 📊 Dashboard Komprehensif
- Status pasaran masa nyata (harga, spread, volum, ATR)
- Indikator status breakout
- Kawalan timeframe
- Statistik prestasi

### 🔄 Backtesting
- Analisis sejarah breakout
- Kadar kejayaan dan pulangan purata
- Pilihan tarikh mula dan akhir

## 🚀 Cara Menggunakan (Quick Start)

### 1. Setup Projek
```bash
# Clone atau download projek
cd GoldRadar

# Install dependencies (opsional untuk development server)
npm install

# Jalankan SPA server (Python)
python server.py

# Alternatif: server development (Node)
npm run dev
```

### 2. Buka Browser
- Buka `index.html` terus dalam browser, atau
- Gunakan `npm run dev` untuk server development
- Akses di `http://localhost:8000` (Python SPA)
- Alternatif Node dev server: `http://localhost:3000`

### 3. Konfigurasi Alert
1. Aktifkan/nyahaktif alert menggunakan toggle
2. Pilih jenis notifikasi (browser/bunyi)
3. Berikan kebenaran notifikasi browser jika diminta

### 4. Analisis Chart
1. Pilih timeframe yang dikehendaki (M15, H1, H4, Daily)
2. Pantau status breakout di panel kiri
3. Lihat signal terkini di panel kanan
4. Gunakan kawalan chart untuk zoom dan auto-scale

## 🛠️ Struktur Projek & Routes

```
GoldRadar/
├── index.html          # Fail HTML utama
├── styles.css          # Styling CSS
├── script.js           # Logik JavaScript utama
├── package.json        # Dependencies dan scripts
├── styles/             # Styling tambahan (navigation.css)
├── components/         # Komponen UI (navigation, loading)
├── pages/              # Halaman: dashboard, scanner, alerts, backtest, about
├── router.js           # Routing SPA
├── server.py           # Server SPA Python (port 8000)
└── README.md           # Dokumentasi projek

### Routes Utama
- `#/dashboard` — Dashboard ringkas
- `#/scanner` — Status pemindaian dan metrik
- `#/alerts` — Senarai alert
- `#/backtest` — Analisis sejarah
- `#/about` — Maklumat projek
```

## 🔧 Teknologi Digunakan & Tema

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Chart Library**: TradingView Lightweight Charts
- **Icons**: Font Awesome 6
- **Styling**: CSS Grid, Flexbox, Backdrop Filter
- **Tema**: Light/Dark — toggle di header; warna accent `--accent-color` (emas, #ffd700)
- **Notifications**: Web Notifications API
- **Audio**: Web Audio API

## 📊 Algoritma Breakout

### 1. Resistance Breakout
```javascript
if (currentPrice > resistanceLevel && previousPrice <= resistanceLevel) {
    // Breakout atas - Signal BUY
    confidence = calculateConfidence(priceChange, volume);
}
```

### 2. Support Breakout
```javascript
if (currentPrice < supportLevel && previousPrice >= supportLevel) {
    // Breakout bawah - Signal SELL
    confidence = calculateConfidence(priceChange, volume);
}
```

### 3. Volatility Breakout
```javascript
if (priceChange > breakoutThreshold) {
    // Breakout berdasarkan volatility
    type = currentPrice > previousPrice ? 'bullish' : 'bearish';
}
```

## 🎯 Skor Keyakinan

Skor keyakinan dikira berdasarkan:
- **Saiz pergerakan harga** (60% berat)
- **Volum dagangan** (20% berat)
- **Tahap support/resistance** (20% berat)

Formula:
```
Confidence = Base(60) + PriceMove(×10000) + VolumeBonus(10) + LevelBonus(10)
Maximum: 95%
```

## 🔮 Ciri-ciri Masa Depan

### Fasa 2: Integrasi Data Live
- [ ] API Finnhub untuk data masa nyata
- [ ] API Alpha Vantage sebagai backup
- [ ] Bridge MT5 untuk data broker

### Fasa 3: AI/ML Lanjutan
- [ ] Model TensorFlow untuk pattern recognition
- [ ] Training data sejarah XAU/USD
- [ ] Prediction confidence scoring

### Fasa 4: Notifikasi Lanjutan
- [ ] Integrasi Telegram Bot
- [ ] Email notifications
- [ ] SMS alerts (Twilio)

### Fasa 5: Analisis Lanjutan
- [ ] Multiple timeframe analysis
- [ ] Correlation dengan indeks lain
- [ ] Sentiment analysis dari berita

## 🐛 Troubleshooting

### Chart tidak muncul
1. Pastikan JavaScript diaktifkan
2. Periksa console browser untuk error
3. Pastikan sambungan internet stabil

### Notifikasi tidak berfungsi
1. Berikan kebenaran notifikasi browser
2. Periksa setting browser untuk notifications
3. Pastikan audio tidak di-mute

### Data tidak update
1. Refresh halaman
2. Periksa status sambungan (dot hijau/merah)
3. Tunggu beberapa saat untuk simulasi data

## 📝 Nota Penting

⚠️ **Disclaimer**: Sistem ini menggunakan data simulasi untuk demonstrasi. Untuk trading sebenar, gunakan data live dari broker atau penyedia data yang sah.

🔒 **Keselamatan**: Jangan kongsi API keys atau maklumat sensitif dalam kod. Gunakan environment variables untuk production.

📊 **Prestasi**: Sistem dioptimumkan untuk SPA statik; data simulasi digunakan untuk demo. 
Untuk production, tambah backend/API dan proses build.

## 🗒️ Release Info
- Versi: `0.1.0`
- Ringkasan: Penambahbaikan keterbacaan nav (light mode), penjajaran teks status di scanner, dan polish mudah alih (saiz sentuhan, kontras).

## 🤝 Sumbangan

Selamat datang untuk menyumbang kepada projek ini:
1. Fork repository
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## 📄 Lesen

Projek ini dilesen di bawah MIT License - lihat fail [LICENSE](LICENSE) untuk butiran.

## 📞 Sokongan

Jika ada masalah atau soalan:
- Buka issue di GitHub
- Email: support@goldradar.com
- Telegram: @goldradar_support

---

**Dibuat dengan ❤️ untuk komuniti trading Malaysia** 🇲🇾