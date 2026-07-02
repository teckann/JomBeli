'use client';

import { useState, useEffect, useRef } from 'react';

export function useThrottledValue(value, intervalMs = 15000) {
  const [throttled, setThrottled] = useState(value);
  const lastUpdateRef = useRef(Date.now());

  useEffect(() => {
    if (!value) return;

    const now = Date.now();
    const elapsed = now - lastUpdateRef.current;

    if (elapsed >= intervalMs) {
      setThrottled(value);
      lastUpdateRef.current = now;
    } else {
      const timeout = setTimeout(() => {
        setThrottled(value);
        lastUpdateRef.current = Date.now();
      }, intervalMs - elapsed);
      return () => clearTimeout(timeout);
    }
  }, [value, intervalMs]);

  return throttled;
}
