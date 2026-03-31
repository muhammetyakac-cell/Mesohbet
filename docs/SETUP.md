# Kurulum Rehberi

## 1. Supabase Projesi Oluşturma

1. [Supabase.com](https://supabase.com) adresine gidin
2. Hesap oluşturun veya giriş yapın
3. "New Project" butonuna tıklayın
4. Proje adını girin ve region seçin
5. Proje oluşturulduktan sonra, **Settings > API** bölümünden:
   - `SUPABASE_URL` kopyalayın
   - `SUPABASE_ANON_KEY` kopyalayın

## 2. Database Şemasını Oluşturma

1. Supabase dashboard'da **SQL Editor**'a gidin
2. `docs/database.sql` dosyasının içeriğini kopyalayın
3. SQL Editor'a yapıştırın
4. "Run" butonuna tıklayın

## 3. Backend Kurulumu

```bash
cd backend

# .env dosyası oluşturun
cp .env.example .env

# .env dosyasını açın ve aşağıdaki bilgileri ekleyin:
# SUPABASE_URL=your_supabase_url
# SUPABASE_KEY=your_supabase_anon_key
# PORT=5000

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Backend `http://localhost:5000` adresinde çalışacak.

## 4. Frontend Kurulumu

```bash
cd frontend

# .env.local dosyası oluşturun
cp .env.local.example .env.local

# .env.local dosyasını açın ve aşağıdaki bilgileri ekleyin:
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
# NEXT_PUBLIC_API_URL=http://localhost:5000

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Frontend `http://localhost:3000` adresinde çalışacak.

## 5. Uygulamayı Test Etme

1. Tarayıcıda `http://localhost:3000` adresine gidin
2. Bir nickname girin ve "Giriş Yap" butonuna tıklayın
3. Chat sayfasında mesaj göndermeye başlayın

## API Endpoints

### Kimlik Doğrulama
- `POST /api/auth/login` - Nickname ile giriş yap
  ```json
  {
    "nickname": "string"
  }
  ```

### Kullanıcılar
- `GET /api/users` - Tüm kullanıcıları getir

### Mesajlar
- `GET /api/messages?limit=50&offset=0` - Mesajları getir
- `POST /api/messages` - Yeni mesaj gönder
  ```json
  {
    "user_id": "uuid",
    "content": "string"
  }
  ```

## Sorun Giderme

### Port zaten kullanımda
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### CORS hatası
- Backend'in `cors()` middleware'i doğru yapılandırıldığından emin olun
- Frontend `.env.local` dosyasında `NEXT_PUBLIC_API_URL` doğru ayarlandığından emin olun

### Supabase bağlantı hatası
- URL ve API key'in doğru olduğundan emin olun
- Supabase dashboard'da API status'u kontrol edin
