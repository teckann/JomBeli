const API_KEY = process.env.ORS_API_KEY;
const BASE_URL = 'https://api.heigit.org/openrouteservice/v2';
const GEOCODE_URL = 'https://api.heigit.org/pelias/v1';

// ORS expects [lng, lat] — opposite of Leaflet [lat, lng]
const toCoords = (points) => points.map(p => [p.lng, p.lat]);

/**
 * Fetches a road-following route between multiple stops,
 * including road geometry and turn-by-turn instructions.
 */
export async function fetchRouteWithInstructions(stops) {
  const res = await fetch(`${BASE_URL}/directions/driving-car/geojson`, {
    method: 'POST',
    headers: { 'Authorization': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      coordinates: toCoords(stops),
      instructions: true,
    }),
  });

  if (!res.ok) throw new Error(`ORS Directions ${res.status}: ${await res.text()}`);

  const data = await res.json();
  const feature = data.features[0];

  return {
    geometry: feature.geometry,
    distanceKm: (feature.properties.summary.distance / 1000).toFixed(2),
    durationMin: Math.round(feature.properties.summary.duration / 60),
    steps: feature.properties.segments.flatMap(seg =>
      seg.steps.map(step => ({
        instruction: step.instruction,
        distanceM: Math.round(step.distance),
        durationSec: Math.round(step.duration),
      }))
    ),
  };
}

/**
 * Fetches a real road distance matrix between all stop pairs.
 * Used to feed the 2-Opt optimizer 
 */
export async function fetchDistanceMatrix(stops) {
  const res = await fetch(`${BASE_URL}/matrix/driving-car`, {
    method: 'POST',
    headers: { 'Authorization': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      locations: toCoords(stops),
      metrics: ['distance'],
      units: 'km',
    }),
  });

  if (!res.ok) throw new Error(`ORS Matrix ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.distances; 
  // 2D array: distances[i][j] = road km from stop i to stop j
}

/**
 * Reverse geocodes a coordinate into a human-readable address label.
 */
export async function fetchAddressLabel(lat, lng) {
  const res = await fetch(
    `${GEOCODE_URL}/reverse?api_key=${API_KEY}&point.lon=${lng}&point.lat=${lat}&size=1`
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.features?.[0]?.properties?.label ?? null;
}
