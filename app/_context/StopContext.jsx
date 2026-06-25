"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useStops } from '@/app/_hooks/useStops';
import { nearestNeighbor, twoOpt, calculateTotalDistance } from '@/app/_lib/route-algorithms';
import { fetchDistanceMatrix, fetchRouteGeometry } from '@/app/_lib/ors';

const StopContext = createContext();

export function StopProvider({ children }) {
  const { stops, addStop, removeStop, clearStops } = useStops();

  const [optimizedRoute, setOptimizedRoute] = useState([]);
  const [routeGeometry, setRouteGeometry] = useState(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (stops.length < 2) {
      setOptimizedRoute(stops);
      setRouteGeometry(null);
      setTotalDistance(0);
      return;
    }

    const optimize = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const stopsWithIndex = stops.map((stop, i) => ({ ...stop, matrixIndex: i }));

        const distanceMatrix = await fetchDistanceMatrix(stopsWithIndex);

        const baseline = nearestNeighbor(stopsWithIndex, distanceMatrix);
        const optimized = twoOpt(baseline, distanceMatrix);
        setOptimizedRoute(optimized);

        const geometry = await fetchRouteGeometry(optimized);
        setRouteGeometry(geometry);

        const dist = calculateTotalDistance(optimized, distanceMatrix);
        setTotalDistance(dist.toFixed(2));

      } catch (err) {
        console.error('ORS error:', err);
        setError('Routing failed — falling back to straight-line');

        // Haversine fallback — app never crashes
        const baseline = nearestNeighbor(stops);
        const optimized = twoOpt(baseline);
        setOptimizedRoute(optimized);
        setRouteGeometry(null);
        setTotalDistance(calculateTotalDistance(optimized).toFixed(2));
      } finally {
        setIsLoading(false);
      }
    };

    optimize();
  }, [stops]);

  const value = {
    stops: optimizedRoute,
    routeGeometry,
    totalDistance,
    isLoading,
    error,
    addStop,
    removeStop,
    clearStops,
  };

  return (
    <StopContext.Provider value={value}>
      {children}
    </StopContext.Provider>
  );
}

export const useStopContext = () => useContext(StopContext);