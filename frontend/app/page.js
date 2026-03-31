'use client';

import { useState } from 'react';
import LoginPage from '../components/LoginPage';
import ChatPage from '../components/ChatPage';
import styles from './page.module.css';

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <main className={styles.main}>
      {!currentUser ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <ChatPage user={currentUser} onLogout={handleLogout} />
      )}
    </main>
  );
}
