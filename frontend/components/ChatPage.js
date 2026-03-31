'use client';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage, getUsers } from '../lib/api';
import styles from './ChatPage.module.css';

export default function ChatPage({ user, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
    loadUsers();
    const interval = setInterval(loadMessages, 2000);
    const usersInterval = setInterval(loadUsers, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(usersInterval);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      const data = await getMessages(50);
      setMessages(data);
    } catch (error) {
      console.error('Mesajlar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Kullanıcılar yüklenemedi:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      await sendMessage(user.id, newMessage);
      setNewMessage('');
      loadMessages();
    } catch (error) {
      console.error('Mesaj gönderilemedi:', error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Yükleniyor...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.userInfo}>
          <h2>Merhaba!</h2>
          <p className={styles.nickname}>{user.nickname}</p>
          <button onClick={onLogout} className={styles.logoutBtn}>
            Çıkış Yap
          </button>
        </div>

        <div className={styles.usersList}>
          <h3>Çevrimiçi Kullanıcılar ({users.length})</h3>
          <div className={styles.users}>
            {users.map((u) => (
              <div key={u.id} className={styles.userItem}>
                <span className={styles.onlineIndicator}></span>
                {u.nickname}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.chatArea}>
        <div className={styles.messagesContainer}>
          {messages.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Henüz mesaj yok</p>
              <p>Sohbete başlayın! 👋</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${
                  msg.users?.nickname === user.nickname ? styles.own : ''
                }`}
              >
                <div className={styles.messageHeader}>
                  <span className={styles.nickname}>
                    {msg.users?.nickname || 'Bilinmiyor'}
                  </span>
                  <span className={styles.time}>
                    {new Date(msg.created_at).toLocaleTimeString('tr-TR')}
                  </span>
                </div>
                <p className={styles.content}>{msg.content}</p>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className={styles.inputForm}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mesaj yaz..."
            className={styles.input}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={styles.sendBtn}
          >
            Gönder
          </button>
        </form>
      </div>
    </div>
  );
}
