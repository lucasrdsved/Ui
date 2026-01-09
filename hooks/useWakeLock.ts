import { useState, useEffect, useRef } from 'react';

export function useWakeLock() {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const requestWakeLock = async () => {
    if (!('wakeLock' in navigator)) {
      setError('Wake Lock not supported');
      return;
    }

    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen');
      setIsActive(true);
      
      wakeLockRef.current.addEventListener('release', () => {
        setIsActive(false);
      });
    } catch (err: any) {
      setError(err.message);
      setIsActive(false);
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
      setIsActive(false);
    }
  };

  // Re-acquire on visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isActive && wakeLockRef.current === null) {
        // Optional: Auto re-acquire if expected to be active? 
        // For now we assume manual re-trigger or sticky state management outside
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseWakeLock();
    };
  }, [isActive]);

  return { requestWakeLock, releaseWakeLock, isActive, error };
}