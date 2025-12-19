'use client';

import { useState } from 'react';
import styles from './LoginScreen.module.css';

interface LoginScreenProps {
  onLoginSuccess: (token: string, user: any) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [badgeId, setBadgeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeId.trim()) {
      setError('Please enter your badge ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ badgeId: badgeId.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Check if user is Manager or Admin
      if (data.employee.role !== 'MANAGER' && data.employee.role !== 'ADMIN') {
        throw new Error('Access denied. Manager or Admin role required.');
      }

      onLoginSuccess(data.accessToken, data.employee);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>RetainAI Manager Dashboard</h1>
        <p className={styles.subtitle}>Enter your badge ID to continue</p>

        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="text"
            className={styles.input}
            placeholder="Badge ID"
            value={badgeId}
            onChange={(e) => setBadgeId(e.target.value)}
            disabled={loading}
            autoFocus
          />

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.button}
            disabled={loading || !badgeId.trim()}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

