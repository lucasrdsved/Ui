import { useState, useEffect, useRef, useCallback } from 'react';
import { playSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

const workerScript = `
let interval = null;
self.onmessage = function(e) {
  if (e.data === 'start') {
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      self.postMessage('tick');
    }, 1000);
  } else if (e.data === 'stop') {
    if (interval) clearInterval(interval);
  }
};
`;

export function useTimer(initialSeconds: number = 0, onComplete?: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Create worker from blob
    const blob = new Blob([workerScript], { type: 'application/javascript' });
    workerRef.current = new Worker(URL.createObjectURL(blob));

    workerRef.current.onmessage = (e) => {
      if (e.data === 'tick') {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer finished
            workerRef.current?.postMessage('stop');
            triggerHaptic('success'); // Vibrate on finish
            if (onComplete) onComplete();
            return 0;
          }
           
          // Audio & Haptic feedback
          const nextTime = prev - 1;
          if (nextTime <= 5) {
            playSound('warning');
            triggerHaptic('warning'); // Stronger vibration for countdown
          } else {
            playSound('tick');
            triggerHaptic('tick'); // Subtle tick for normal counting
          }

          return nextTime;
        });
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [onComplete]);

  const startTimer = useCallback((seconds?: number) => {
    if (seconds !== undefined) setTimeLeft(seconds);
    setIsRunning(true);
    workerRef.current?.postMessage('start');
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    workerRef.current?.postMessage('stop');
  }, []);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(0);
    workerRef.current?.postMessage('stop');
  }, []);

  return { timeLeft, isRunning, startTimer, pauseTimer, stopTimer };
}