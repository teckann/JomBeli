'use server';

import { fetchRouteWithInstructions, fetchDistanceMatrix, fetchAddressLabel } from '@/app/_lib/ors/client';
import { nearestNeighbor, twoOpt, calculateTotalDistance } from '@/app/_lib/routing/algorithms';
import { getDistance } from '@/app/_lib/routing/geometry';


export async function getSingleRoute(courierPosition, destination) {
  try {
    const result = await fetchRouteWithInstructions([courierPosition, destination]);
    return { ...result, usedFallback: false };
  } catch (err) {
    console.error('ORS single route failed:', err.message);

    // Haversine straight-line fallback
    return {
      geometry: {
        type: 'LineString',
        coordinates: [
          [courierPosition.lng, courierPosition.lat],
          [destination.lng, destination.lat],
        ],
      },
      distanceKm: getDistance(courierPosition, destination).toFixed(2),
      durationMin: null,
      steps: [],
      usedFallback: true,
    };
  }
}

export async function getOptimizedBatchRoute(courierPosition, deliveryStops) {

  // Courier's current position is the starting point (index 0)
  const allPoints = [courierPosition, ...deliveryStops];

  // add index before fetching matrix — position in this array must match position in the ORS matrix
  const stopsWithIndex = allPoints.map((stop, i) => ({ ...stop, matrixIndex: i }));

  try {
    // get distance matrix between all points from ORS
    const distanceMatrix = await fetchDistanceMatrix(stopsWithIndex);

    // optimize with real road distances
    const baseline = nearestNeighbor(stopsWithIndex, distanceMatrix);
    const optimized = twoOpt(baseline, distanceMatrix);

    // courier position stays first (index 0 = current location)
    const optimizedDeliveryStops = optimized.filter(s => s.matrixIndex !== 0);
    const routePoints = [courierPosition, ...optimizedDeliveryStops];

    // fetch road geometry for the optimized sequence
    const routeResult = await fetchRouteWithInstructions(routePoints);

    // total road distance from optimizer (excludes return trip)
    const totalDistanceKm = optimizedDeliveryStops.reduce((sum, stop, i) => {
      const from = i === 0 ? stopsWithIndex[0] : optimizedDeliveryStops[i - 1];
      return sum + distanceMatrix[from.matrixIndex][stop.matrixIndex];
    }, 0);

    return {
      ...routeResult,
      optimizedStops: optimizedDeliveryStops,
      totalDistanceKm: totalDistanceKm.toFixed(2),
      usedFallback: false,
    };
  } catch (err) {
    console.error('ORS batch route failed, falling back to Haversine:', err.message);

    // Haversine fallback — still runs 2-Opt, just with straight-line distances
    const stopsHaversine = allPoints.map((stop, i) => ({ ...stop, matrixIndex: i }));
    const baseline = nearestNeighbor(stopsHaversine);
    const optimized = twoOpt(baseline);
    const optimizedDeliveryStops = optimized.filter(s => s.matrixIndex !== 0);

    // Build a straight-line GeoJSON fallback
    const allCoords = [courierPosition, ...optimizedDeliveryStops];
    const fallbackGeometry = {
      type: 'LineString',
      coordinates: allCoords.map(s => [s.lng, s.lat]),
    };

    return {
      optimizedStops: optimizedDeliveryStops,
      geometry: fallbackGeometry,
      distanceKm: calculateTotalDistance(optimized).toFixed(2),
      totalDistanceKm: calculateTotalDistance(optimized).toFixed(2),
      durationMin: null,
      steps: [],
      usedFallback: true,
    };
  }
}

/**
 * Reverse geocode a coordinate to a readable address.
 * Call once when the delivery is assigned — not on every GPS update.
 */
export async function getAddressLabel(lat, lng) {
  try {
    return await fetchAddressLabel(lat, lng);
  } catch {
    return null;
  }
}
