'use client';
import React from 'react';
import { useState } from 'react';
import { loginUser } from '../lib/api';
import styles from './LoginPage.module.css';

export default function LoginPage({ onLoginSuccess }) {
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await loginUser(nickname);
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
        <p className={styles.subtitle}>Anonim sohbete hoş geldiniz</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="nickname" className={styles.label}>
              Nickname Seç
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Örn: ArchaeologyFan123"
              className={styles.input}
              disabled={loading}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.button}
            disabled={loading || nickname.trim().length === 0}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p className={styles.info}>
          💡 Seçtiğin nickname, sohbetlerde kimlik olarak kullanılacak
        </p>
      </div>
    </div>
  );
}
