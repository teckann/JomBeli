'use client';

import { useState, useEffect, useRef } from 'react';

const DEBUG_GPS = true; //debug mode: true = controll courier with W A S D
const STEP = 0.00005; // ~5.5m per keystroke

export function useCourierPosition() {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation not supported on this device.');
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition(prev => {
          // When debugging, only use the first GPS fix.
          if (DEBUG_GPS && prev) return prev;

          return {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            heading: pos.coords.heading,
            speed: pos.coords.speed,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp,
          };
        });

        setError(null);
      },
      (err) => setError(err.message),
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);
  
  //script to capture keyboard action to move courier
  useEffect(() => {
    if (!DEBUG_GPS) return;

    const handleKeyDown = (e) => {
      setPosition(prev => {
        if (!prev) return prev;

        switch (e.key.toLowerCase()) {
          case 'w':
          case 'arrowup':
            return { ...prev, lat: prev.lat + STEP };

          case 's':
          case 'arrowdown':
            return { ...prev, lat: prev.lat - STEP };

          case 'a':
          case 'arrowleft':
            return { ...prev, lng: prev.lng - STEP };

          case 'd':
          case 'arrowright':
            return { ...prev, lng: prev.lng + STEP };

          default:
            return prev;
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { position, error };
}