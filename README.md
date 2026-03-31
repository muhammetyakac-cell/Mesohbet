# Arkeoloji Öğrencileri İçin Anonim Chat Uygulaması

Arkeoloji öğrencilerinin nickname seçerek anonim olarak sohbet edebilecekleri bir chat uygulaması.

## Teknoloji Stack

- **Frontend**: Next.js + React
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime

## Proje Yapısı

```
├── frontend/        - Next.js uygulaması
├── backend/         - Node.js/Express API
└── docs/            - Dokümantasyon
```

## Başlangıç

### 1. Supabase Projesi Kurulumu
- Supabase.com'da hesap oluşturun
- Yeni bir proje oluşturun
- Database URL ve API key'i kopyalayın

### 2. Backend Kurulumu
```bash
cd backend
npm install
cp .env.example .env
# .env dosyasını Supabase bilgilerinizle doldurun
npm run dev
```

### 3. Frontend Kurulumu
```bash
cd frontend
npm install
cp .env.local.example .env.local
# .env.local dosyasını Supabase bilgilerinizle doldurun
npm run dev
```

## Features

- ✅ Nickname seçerek login
- ✅ Anonim chat sistemi
- ✅ Real-time mesaj gönderme/alma
- ✅ Kullanıcı listesi
- ✅ Mesaj geçmişi
