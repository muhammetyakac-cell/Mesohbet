'use client';
import React from 'react';
import { useState } from 'react';
import { loginUser } from '../lib/api';
import styles from './LoginPage.module.css';

export default function LoginPage({ onLoginSuccess }) {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const userData = await loginUser(nickname, password);
      setSuccessMessage(
        userData.isNewUser
          ? 'Yeni hesap oluşturuldu. Odaya yönlendiriliyorsun...'
          : 'Tekrar hoş geldin!'
      );
      onLoginSuccess(userData.user);
    } catch (err) {
      setError(
        err.response?.data?.error || 'Giriş başarısız oldu. Tekrar deneyin.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Arkeoloji Chat</h1>
        <p className={styles.subtitle}>
          Nickname + şifre ile giriş yap. Nickname yoksa otomatik kayıt olunur.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="nickname" className={styles.label}>
              Nickname
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Örn: ArchaeologyFan123"
              className={styles.input}
              disabled={loading}
              minLength={3}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="En az 4 karakter"
              className={styles.input}
              disabled={loading}
              minLength={4}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {successMessage && <div className={styles.success}>{successMessage}</div>}

          <button
            type="submit"
            className={styles.button}
            disabled={loading || nickname.trim().length < 3 || password.length < 4}
          >
            {loading ? 'Kontrol ediliyor...' : 'Giriş / Kayıt Ol'}
          </button>
        </form>

        <p className={styles.info}>
          💡 Online listesinde sadece son 5 dakikada mesaj atanlar görünür.
        </p>
      </div>
    </div>
  );
}
