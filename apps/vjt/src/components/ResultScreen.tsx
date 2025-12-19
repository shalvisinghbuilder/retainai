'use client';

import styles from './ResultScreen.module.css';

interface ResultScreenProps {
  result: {
    passed: boolean;
    coolDownUntil: string | null;
  };
}

export default function ResultScreen({ result }: ResultScreenProps) {
  const cooldownDate = result.coolDownUntil
    ? new Date(result.coolDownUntil)
    : null;

  if (result.passed) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.title}>Congratulations!</h1>
          <p className={styles.message}>
            You passed the assessment. Your application will be reviewed.
          </p>
          <p className={styles.submessage}>
            You will be contacted soon with next steps.
          </p>
          <div className={styles.completeMessage}>
            <p>Assessment complete. Thank you for your time!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.failIcon}>✗</div>
        <h1 className={styles.title}>Not Eligible Right Now</h1>
        <p className={styles.message}>
          Thank you for your interest. Unfortunately, you did not meet the
          minimum score requirement at this time.
        </p>
        {cooldownDate && (
          <div className={styles.cooldown}>
            <p className={styles.cooldownLabel}>You can re-apply after:</p>
            <p className={styles.cooldownDate}>
              {cooldownDate.toLocaleDateString()} at{' '}
              {cooldownDate.toLocaleTimeString()}
            </p>
          </div>
        )}
        <div className={styles.completeMessage}>
          <p>Assessment complete. Thank you for your time!</p>
        </div>
      </div>
    </div>
  );
}

