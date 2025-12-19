'use client';

import { useState, useEffect } from 'react';
import styles from './LandingScreen.module.css';

interface LandingScreenProps {
  onStart: () => void;
  candidateId: string | null;
  nonce: string | null;
}

export default function LandingScreen({ onStart, candidateId, nonce }: LandingScreenProps) {
  const [coolDownUntil, setCoolDownUntil] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if candidate is in cooldown
    // For MVP, we'll check this on the backend when submitting
    // For now, assume not in cooldown if we have valid params
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (coolDownUntil) {
    const cooldownDate = new Date(coolDownUntil);
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Application on Hold</h1>
          <p className={styles.message}>
            Thank you for your interest. You can re-apply after:
          </p>
          <p className={styles.cooldownDate}>
            {cooldownDate.toLocaleDateString()} at {cooldownDate.toLocaleTimeString()}
          </p>
        </div>
      </div>
    );
  }

  if (!candidateId || !nonce) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Invalid Link</h1>
          <p className={styles.message}>
            This assessment link is invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome to RetainAI</h1>
        <p className={styles.subtitle}>Virtual Job Tryout</p>
        
        <div className={styles.preview}>
          <h2 className={styles.previewTitle}>What to Expect</h2>
          <ul className={styles.previewList}>
            <li>60-second interactive assessment</li>
            <li>Drag and drop items into correct bins</li>
            <li>Score range: 0-1000 points</li>
            <li>Passing score: 600 or higher</li>
          </ul>
        </div>

        <button className={styles.startButton} onClick={onStart}>
          Start Assessment
        </button>

        <p className={styles.hint}>
          Make sure you have a stable internet connection
        </p>
      </div>
    </div>
  );
}

