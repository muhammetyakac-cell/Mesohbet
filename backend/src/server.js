const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();

const CHAT_ROOMS = [
  { slug: 'kazma-kurek-kahvesi', name: 'Kazma Kürek Kahvesi ☕' },
  { slug: 'hitit-hikaye-kulubu', name: 'Hitit Hikâye Kulübü 📜' },
  { slug: 'mozaik-muhabbet', name: 'Mozaik Muhabbet 🧩' },
  { slug: 'lahit-lobi', name: 'Lahit Lobisi 🪦' },
  { slug: 'tablet-takimi', name: 'Kil Tablet Takımı 🧱' },
];

// Middleware
app.use(cors());
app.use(express.json());

// Supabase İstemcisi
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

const verifyPassword = (password, storedHash) => {
  const [salt, originalHash] = (storedHash || '').split(':');

  if (!salt || !originalHash) return false;

  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(originalHash));
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/rooms', (req, res) => {
  res.json(CHAT_ROOMS);
});

// Kullanıcı oluştur / Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { nickname, password } = req.body;

    if (!nickname || nickname.trim().length < 3) {
      return res.status(400).json({ error: 'Nickname en az 3 karakter olmalı' });
    }

    if (!password || password.length < 4) {
      return res.status(400).json({ error: 'Şifre en az 4 karakter olmalı' });
    }

    const normalizedNickname = nickname.trim();

    const { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('id, nickname, password_hash, created_at')
      .eq('nickname', normalizedNickname)
      .maybeSingle();

    if (findError) throw findError;

    if (!existingUser) {
      const passwordHash = hashPassword(password);

      const { data: newUser, error } = await supabase
        .from('users')
        .insert([
          {
            nickname: normalizedNickname,
            password_hash: passwordHash,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select('id, nickname, created_at')
        .single();

      if (error) throw error;

      return res.json({
        user: newUser,
        isNewUser: true,
        message: 'Hesap oluşturuldu ve giriş yapıldı',
      });
    }

    if (!verifyPassword(password, existingUser.password_hash)) {
      return res.status(401).json({ error: 'Nickname veya şifre hatalı' });
    }

    res.json({
      user: {
        id: existingUser.id,
        nickname: existingUser.nickname,
        created_at: existingUser.created_at,
      },
      isNewUser: false,
      message: 'Başarıyla giriş yapıldı',
    });
  } catch (error) {
    console.error('Login hatası:', error);
    res.status(500).json({ error: 'Giriş başarısız oldu' });
  }
});

// Son 5 dakikada mesaj atan kullanıcılar
app.get('/api/users', async (req, res) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    const { data: activeMessages, error } = await supabase
      .from('messages')
      .select('created_at, users:user_id(id, nickname)')
      .gte('created_at', fiveMinutesAgo)
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) throw error;

    const uniqueUsers = [];
    const seenUserIds = new Set();

    (activeMessages || []).forEach((message) => {
      const user = message.users;

      if (user?.id && !seenUserIds.has(user.id)) {
        seenUserIds.add(user.id);
        uniqueUsers.push({
          id: user.id,
          nickname: user.nickname,
          last_message_at: message.created_at,
        });
      }
    });

    res.json(uniqueUsers);
  } catch (error) {
    console.error('Kullanıcı getirme hatası:', error);
    res.status(500).json({ error: 'Kullanıcılar getirilemedi' });
  }
});

// Mesaj gönder
app.post('/api/messages', async (req, res) => {
  try {
    const { user_id: userId, content, room_slug: roomSlug } = req.body;

    if (!userId || !content || !roomSlug) {
      return res.status(400).json({ error: 'user_id, content ve room_slug gerekli' });
    }

    const validRoom = CHAT_ROOMS.some((room) => room.slug === roomSlug);

    if (!validRoom) {
      return res.status(400).json({ error: 'Geçersiz oda' });
    }

    const { data: message, error } = await supabase
      .from('messages')
      .insert([
        {
          user_id: userId,
          content,
          room_slug: roomSlug,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.json(message);
  } catch (error) {
    console.error('Mesaj gönderme hatası:', error);
    res.status(500).json({ error: 'Mesaj gönderilemedi' });
  }
});

// Son mesajları getir (pagination)
app.get('/api/messages', async (req, res) => {
  try {
    const limit = Number(req.query.limit || 50);
    const offset = Number(req.query.offset || 0);
    const roomSlug = req.query.room_slug || CHAT_ROOMS[0].slug;

    const validRoom = CHAT_ROOMS.some((room) => room.slug === roomSlug);

    if (!validRoom) {
      return res.status(400).json({ error: 'Geçersiz oda' });
    }

    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        created_at,
        room_slug,
        users:user_id(id, nickname)
      `)
      .eq('room_slug', roomSlug)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json((messages || []).reverse());
  } catch (error) {
    console.error('Mesaj getirme hatası:', error);
    res.status(500).json({ error: 'Mesajlar getirilemedi' });
  }
});

// Hata yakalama
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Sunucu hatası' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend çalışıyor: http://localhost:${PORT}`);
});
