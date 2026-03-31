# API Dokümantasyonu

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### 1. Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "ok"
}
```

---

### 2. Login / Kullanıcı Oluştur
```
POST /auth/login
```

**Request Body:**
```json
{
  "nickname": "string (gerekli, 1-50 karakter)"
}
```

**Success Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "nickname": "string",
    "created_at": "2024-01-01T12:00:00Z"
  },
  "message": "Başarıyla giriş yapıldı"
}
```

**Error Response (400):**
```json
{
  "error": "Nickname gerekli"
}
```

**Error Response (409):**
```json
{
  "error": "Bu nickname zaten kullanılıyor"
}
```

---

### 3. Kullanıcı Listesi
```
GET /users
```

**Response:**
```json
[
  {
    "id": "uuid",
    "nickname": "string",
    "created_at": "2024-01-01T12:00:00Z"
  },
  ...
]
```

---

### 4. Mesaj Gönder
```
POST /messages
```

**Request Body:**
```json
{
  "user_id": "uuid (gerekli)",
  "content": "string (gerekli)"
}
```

**Success Response (200):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "content": "string",
  "created_at": "2024-01-01T12:00:00Z"
}
```

**Error Response (400):**
```json
{
  "error": "user_id ve content gerekli"
}
```

---

### 5. Mesaj Listesi
```
GET /messages?limit=50&offset=0
```

**Query Parameters:**
- `limit` (opsiyonel, default: 50) - Kaç mesaj getir
- `offset` (opsiyonel, default: 0) - Kaçıncı mesajdan başla

**Response:**
```json
[
  {
    "id": "uuid",
    "content": "string",
    "created_at": "2024-01-01T12:00:00Z",
    "users": {
      "id": "uuid",
      "nickname": "string"
    }
  },
  ...
]
```

---

## Hata Kodları

| Kod | Açıklama |
|-----|----------|
| 200 | Başarılı |
| 400 | Bad Request - Eksik veya geçersiz parametre |
| 409 | Conflict - Nickname zaten kullanımda |
| 500 | Server Error - Sunucu hatası |

---

## Örnek Kullanım (JavaScript/Fetch)

### Login
```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    nickname: 'MyNickname'
  })
});

const data = await response.json();
console.log(data.user);
```

### Mesaj Gönder
```javascript
const response = await fetch('http://localhost:5000/api/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    user_id: 'user-uuid',
    content: 'Merhaba!'
  })
});

const message = await response.json();
console.log(message);
```

### Mesajları Getir
```javascript
const response = await fetch('http://localhost:5000/api/messages?limit=20&offset=0');
const messages = await response.json();
console.log(messages);
```
