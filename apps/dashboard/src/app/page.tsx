'use client';

import { useState, useEffect } from 'react';
import LoginScreen from '@/components/LoginScreen';
import MapScreen from '@/components/MapScreen';
import QueueScreen from '@/components/QueueScreen';
import { User } from '@/types';

export default function Home() {
  const [screen, setScreen] = useState<'login' | 'map' | 'queue'>('login');
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored token
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setScreen('map');
    }
  }, []);

  const handleLoginSuccess = (accessToken: string, employee: any) => {
    setToken(accessToken);
    setUser(employee);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(employee));
    setScreen('map');
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setScreen('login');
  };

  if (screen === 'login') {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  if (!token || !user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div>
      {screen === 'map' && (
        <MapScreen
          token={token}
          onNavigate={(s) => setScreen(s as 'map' | 'queue')}
        />
      )}
      {screen === 'queue' && (
        <QueueScreen
          token={token}
          onNavigate={(s) => setScreen(s as 'map' | 'queue')}
        />
      )}
      <div style={{
        position: 'fixed',
        top: 10,
        right: 10,
        padding: '10px 20px',
        background: 'white',
        borderRadius: '6px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 1000,
      }}>
        <span style={{ marginRight: '10px' }}>{user.badgeId}</span>
        <button
          onClick={handleLogout}
          style={{
            padding: '5px 10px',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

