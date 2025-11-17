# 🚀 QR Menu Projesini Çalıştırma Rehberi

## 📋 Ön Gereksinimler

Bilgisayarınızda bunlar yüklü olmalı:
- **Node.js** v18 veya üzeri ([İndir](https://nodejs.org/))
- **Git** ([İndir](https://git-scm.com/))

## 📥 Adım 1: Projeyi Klonla

Terminal veya Command Prompt açın ve şu komutları çalıştırın:

```bash
# Projeyi klonla
git clone https://github.com/erdmncdr/QR-MENU.git

# Proje klasörüne gir
cd QR-MENU

# Geliştirme branch'ine geç
git checkout claude/analyze-improvement-points-01UqBwi9Mbwpsy8XvJ9WnLXu
```

## 📦 Adım 2: Bağımlılıkları Yükle

```bash
npm install
```

Bu işlem 1-2 dakika sürebilir. Tüm npm paketlerini indirir.

## ⚙️ Adım 3: Environment Ayarları

`.env` dosyası oluşturun:

```bash
# Windows için
copy .env.example .env

# Mac/Linux için
cp .env.example .env
```

`.env` dosyası şöyle görünmeli (varsayılan değerler):

```env
# Database
DATABASE_URL="file:./dev.db"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Node Environment
NODE_ENV="development"
```

**Not:** Varsayılan değerler local development için yeterli. Değiştirmeye gerek yok.

## 💾 Adım 4: Veritabanını Hazırla

Sırasıyla şu komutları çalıştırın:

### 4.1 Prisma Client Oluştur

```bash
npm run prisma:generate
```

Bu komut Prisma client'ı oluşturur (TypeScript type definitions ile).

### 4.2 Veritabanı Migration

```bash
npm run prisma:migrate
```

Bu komut SQLite veritabanını oluşturur ve tabloları ekler.

### 4.3 Demo Verileri Ekle

```bash
npm run prisma:seed
```

Bu komut:
- 1 demo restoran (Demo Bistro & Cafe)
- 12 kategori (Kahvaltılar, Taco'lar, Pizza'lar, vs.)
- 60+ menü ürünü (gerçek görsellerle)
ekler.

**Önemli:** Bu adımda hatalar alırsanız, [Sorun Giderme](#-sorun-giderme) bölümüne bakın.

## 🚀 Adım 5: Uygulamayı Başlat

```bash
npm run dev
```

Terminal'de şöyle bir mesaj göreceksiniz:

```
✓ Ready in 2.5s
○ Local:        http://localhost:3000
○ Network:      http://192.168.x.x:3000
```

## 🌐 Adım 6: Tarayıcıda Aç

Tarayıcınızda şu adreslere gidin:

### Ana Sayfa
```
http://localhost:3000
```

### Demo Menü (Public)
```
http://localhost:3000/menu/demo-bistro-cafe
```

### Admin Panel
```
http://localhost:3000/admin
```

**Admin Panel Özellikleri:**
- Dashboard: İstatistikler ve QR kod
- Menü Yönetimi: Kategoriler ve ürünler düzenle
- Ayarlar: Restoran bilgileri, renkler, WiFi

## 🎯 Kullanım Örnekleri

### 1. Menü Ürünlerini Düzenle

1. `http://localhost:3000/admin/menu` adresine git
2. Sol taraftan bir kategori seç
3. Ürünlerin yanındaki butonlarla:
   - 👁️ Görünürlük aç/kapat
   - ✏️ Düzenle
   - 🗑️ Sil

### 2. Restoran Ayarlarını Değiştir

1. `http://localhost:3000/admin/settings` adresine git
2. Restoran adı, telefon, adres düzenle
3. Tema renklerini değiştir (color picker ile)
4. QR kodu indir

### 3. QR Kod ile Test Et

1. Admin dashboard'dan QR kodu indir
2. Telefonunuzla QR kodu tara
3. Mobil menüyü görüntüle

## 📱 Mobil Test

Mobil görünümü test etmek için:

**Seçenek 1: Tarayıcı DevTools**
1. Chrome/Firefox açın
2. F12 basın (DevTools)
3. Device toolbar butonu (Ctrl+Shift+M)
4. iPhone veya Android seç

**Seçenek 2: Gerçek Telefon**
1. Bilgisayar ve telefon aynı WiFi ağında olmalı
2. Terminal'de gösterilen Network adresine git
   ```
   http://192.168.x.x:3000/menu/demo-bistro-cafe
   ```

## 🛑 Uygulamayı Durdurma

Terminal'de:
- **Windows:** Ctrl + C
- **Mac/Linux:** Ctrl + C

## 📂 Proje Yapısı

```
QR-MENU/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel sayfaları
│   ├── api/               # API endpoints
│   ├── menu/[slug]/       # Public menu sayfası
│   └── page.tsx           # Ana sayfa
├── components/            # React bileşenleri
│   ├── ui/               # UI components (Button, Card)
│   ├── ErrorBoundary.tsx
│   └── Toaster.tsx
├── lib/                   # Utility functions
│   ├── prisma.ts         # Database client
│   ├── validations.ts    # API validation schemas
│   ├── errors.ts         # Error classes
│   └── utils.ts          # Helper functions
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── seed.ts           # Demo data
│   └── dev.db            # SQLite database (oluşturulacak)
├── .env                  # Environment variables
└── package.json          # Dependencies

```

## 🔧 Sorun Giderme

### Problem: `npm install` hata veriyor

**Çözüm:**
```bash
# Cache temizle
npm cache clean --force

# Tekrar dene
npm install
```

### Problem: `prisma:generate` hata veriyor

**Çözüm:**
```bash
# Prisma'yı manuel güncelle
npx prisma generate --force
```

### Problem: Port 3000 zaten kullanımda

**Çözüm 1:** Farklı port kullan
```bash
PORT=3001 npm run dev
```

**Çözüm 2:** 3000 portunu kullanan uygulamayı kapat
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID_NUMARASI] /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Problem: Veritabanı oluşturulmadı

**Çözüm:**
```bash
# Eski veritabanını sil (varsa)
rm prisma/dev.db

# Migration ve seed tekrar çalıştır
npm run prisma:migrate
npm run prisma:seed
```

### Problem: Sayfa yüklenmiyor / Beyaz ekran

**Çözüm:**
1. Terminal'de hata mesajını kontrol edin
2. Tarayıcı Console'u açın (F12)
3. `.env` dosyasının doğru olduğundan emin olun
4. Sunucuyu yeniden başlatın (Ctrl+C, sonra npm run dev)

### Problem: Toast bildirimleri görünmüyor

**Kontrol:**
- `app/layout.tsx` dosyasında `<Toaster />` var mı?
- react-hot-toast yüklü mü? (`npm install react-hot-toast`)

### Problem: Validation hataları çok teknik

**Not:** Bu normal! Development modunda detaylı hatalar gösterilir. Production'da daha kullanıcı dostu olacak.

## 📚 Faydalı Komutlar

```bash
# Development sunucusu
npm run dev

# Production build
npm run build

# Production sunucusu
npm start

# Prisma Studio (Database GUI)
npm run prisma:studio

# Linting
npm run lint

# Veritabanını sıfırla
rm prisma/dev.db
npm run prisma:migrate
npm run prisma:seed
```

## 🎨 Özelleştirme

### Renkleri Değiştir

Admin panel → Settings → Tema Renkleri

veya

`prisma/seed.ts` dosyasında:
```typescript
primaryColor: '#DC2626',    // Ana renk
secondaryColor: '#991B1B',  // İkincil renk
accentColor: '#F87171',     // Vurgu renk
```

### Dil Ekle

Şu an TR ve EN destekleniyor. Yeni dil eklemek için:
1. Database'de `supportedLanguages` güncelleyin
2. Menü ürünlerine yeni dil alanları ekleyin (örn: `name_de`, `description_de`)

## 🐛 Hata Raporlama

Bir hata bulursanız:
1. Terminal çıktısını kopyalayın
2. Tarayıcı Console hatalarını kontrol edin (F12)
3. GitHub Issues'a rapor edin

## 📖 Dokümantasyon

Detaylı teknik dokümantasyon için:
- `IMPROVEMENTS.md` - Yapılan tüm iyileştirmeler
- `README.md` - Proje açıklaması

## ✅ Başarılı Kurulum Testi

Her şey doğru çalışıyorsa:

1. ✅ `http://localhost:3000` açılıyor
2. ✅ `http://localhost:3000/admin` dashboard gösteriyor
3. ✅ `http://localhost:3000/menu/demo-bistro-cafe` menü gösteriyor
4. ✅ Menü ürünleri ve kategoriler görünüyor
5. ✅ Admin'de ürün düzenleme çalışıyor

## 🎉 Tebrikler!

Projeniz başarıyla çalışıyor!

**Şimdi ne yapabilirsiniz?**
- ✏️ Demo verileri düzenleyin
- 🎨 Renkleri özelleştirin
- 📱 Mobil görünümü test edin
- 🔧 Yeni özellikler ekleyin

---

**İyi geliştirmeler! 🚀**
