// Used as fallback when ORS is unavailable, and for deviation detection.

export function getDistance(coordA, coordB) {
  const radius = 6371;

  const dLat = (coordB.lat - coordA.lat) * Math.PI / 180;
  const dLng = (coordB.lng - coordA.lng) * Math.PI / 180;

  const rLatA = coordA.lat * Math.PI / 180;
  const rLatB = coordB.lat * Math.PI / 180;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rLatA) * Math.cos(rLatB) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return radius * c;
}
