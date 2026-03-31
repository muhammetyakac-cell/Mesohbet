-- Arkeoloji Chat Uygulaması Database Şeması

-- Kullanıcılar tablosu
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mesajlar tablosu
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  room_slug VARCHAR(80) NOT NULL DEFAULT 'kazma-kurek-kahvesi',
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Eski kurulumlar için migration notları
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS room_slug VARCHAR(80) DEFAULT 'kazma-kurek-kahvesi';

-- İndeksler (performans için)
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_room_slug ON messages(room_slug);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- RLS (Row Level Security) Politikaları
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Herkese okuma izni (password_hash hariç projection uygulama katmanında yapılır)
CREATE POLICY "Users are publicly readable" ON users FOR SELECT USING (true);
CREATE POLICY "Messages are publicly readable" ON messages FOR SELECT USING (true);

-- Herkes yeni kullanıcı oluşturabilir
CREATE POLICY "Anyone can insert users" ON users FOR INSERT WITH CHECK (true);

-- Herkes yeni mesaj oluşturabilir
CREATE POLICY "Anyone can insert messages" ON messages FOR INSERT WITH CHECK (true);
