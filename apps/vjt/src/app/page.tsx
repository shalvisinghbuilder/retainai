'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import LandingScreen from '@/components/LandingScreen';
import GameScreen from '@/components/GameScreen';
import ResultScreen from '@/components/ResultScreen';

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [screen, setScreen] = useState<'landing' | 'game' | 'result'>('landing');
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [nonce, setNonce] = useState<string | null>(null);
  const [result, setResult] = useState<{
    passed: boolean;
    coolDownUntil: string | null;
  } | null>(null);

  useEffect(() => {
    const candidate = searchParams.get('candidate');
    const nonceParam = searchParams.get('nonce');

    if (candidate && nonceParam) {
      setCandidateId(candidate);
      setNonce(nonceParam);
    } else {
      // Missing required params, show error
      setScreen('landing');
    }
  }, [searchParams]);

  const handleStart = () => {
    if (candidateId && nonce) {
      setScreen('game');
    }
  };

  const handleGameComplete = (score: number) => {
    // Submit score
    if (candidateId && nonce) {
      submitScore(score);
    }
  };

  const submitScore = async (score: number) => {
    if (!candidateId || !nonce) return;

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateId,
          nonce,
          skillScore: score,
        }),
      });

      const data = await response.json();
      setResult({
        passed: data.passed,
        coolDownUntil: data.coolDownUntil,
      });
      setScreen('result');
    } catch (error) {
      console.error('Failed to submit score:', error);
      // Show error, but still show result
      setResult({
        passed: score >= 600,
        coolDownUntil: score < 600 ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() : null,
      });
      setScreen('result');
    }
  };

  if (screen === 'landing') {
    return <LandingScreen onStart={handleStart} candidateId={candidateId} nonce={nonce} />;
  }

  if (screen === 'game') {
    return <GameScreen onComplete={handleGameComplete} />;
  }

  if (screen === 'result' && result) {
    return <ResultScreen result={result} />;
  }

  return <LandingScreen onStart={handleStart} candidateId={candidateId} nonce={nonce} />;
}

export default function Home() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}

