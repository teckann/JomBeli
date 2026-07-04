'use client';

import { useState, useEffect, useRef } from 'react';
import { useCourierPosition } from './useCourierPosition';
import { useThrottledValue } from './useThrottledValue';
import { getOptimizedBatchRoute } from '@/app/_lib/courier-route';
import { hasDeviated } from '@/app/_lib/routing/deviation';

export function useBatchNavigation(deliveryStops) {
  const { position: courierPosition, error: gpsError } = useCourierPosition();
  const throttledPosition = useThrottledValue(courierPosition, 7000);

  const [optimizedStops, setOptimizedStops] = useState(deliveryStops);
  const [routeGeometry, setRouteGeometry] = useState(null);
  const [routeDetails, setRouteDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usedFallback, setUsedFallback] = useState(false);

  const currentGeometryRef = useRef(null);
  const isFirstRouteRef = useRef(true);
  const previousStopsRef = useRef(deliveryStops);

  useEffect(() => {
    if (!throttledPosition) return;


    if (!deliveryStops.length) {
      setOptimizedStops([]);
      setRouteGeometry(null);
      setRouteDetails(null);
      return;
    }    


    let cancelled = false;

    const fetchRoute = async () => {
      setIsLoading(true);
      setError(null);

      const stopsChanged = previousStopsRef.current !== deliveryStops;
      previousStopsRef.current = deliveryStops;

      if (
        !stopsChanged &&
        !isFirstRouteRef.current &&
        currentGeometryRef.current
      ) {
        const deviated = hasDeviated(throttledPosition, currentGeometryRef.current);

        if (!deviated) return;
      }

      try {
        const result = await getOptimizedBatchRoute(throttledPosition, deliveryStops);

        if (!cancelled) {
          setOptimizedStops(result.optimizedStops);
          setRouteGeometry(result.geometry);
          setRouteDetails({
            distanceKm: result.distanceKm,
            totalDistanceKm: result.totalDistanceKm,
            durationMin: result.durationMin,
            steps: result.steps,
          });
          setUsedFallback(result.usedFallback);
          currentGeometryRef.current = result.geometry;
          isFirstRouteRef.current = false;
        }
      } catch (err) {
        if (!cancelled) {
          setError('Could not calculate route. Will retry shortly.');
          console.error(err);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchRoute();
    return () => { cancelled = true; };
  }, [throttledPosition, deliveryStops]);

  return {
    courierPosition,
    gpsError,
    optimizedStops,
    routeGeometry,
    routeDetails,
    isLoading,
    error,
    usedFallback,
  };
}
