import { getDistance } from './geometry';

const DEVIATION_THRESHOLD_KM = 0.15; 

export function hasDeviated(courierPosition, routeGeometry) {
  if (!routeGeometry?.coordinates?.length) return false;

  const distances = routeGeometry.coordinates.map(([lng, lat]) =>
    getDistance(courierPosition, { lat, lng })
  );

  const closestPointDistance = Math.min(...distances);
  return closestPointDistance > DEVIATION_THRESHOLD_KM;
}
