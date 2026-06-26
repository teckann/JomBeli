const API_KEY = process.env.NEXT_PUBLIC_ORS_API_KEY;
const BASE_URL = 'https://api.openrouteservice.org/v2';

// ORS expects [lng, lat] — opposite of Leaflet's [lat, lng]
const toORSCoords = (stops) => stops.map(s => [s.lng, s.lat]);

export async function fetchDistanceMatrix(stops) {
  const response = await fetch(`${BASE_URL}/matrix/driving-car`, {
    method: 'POST',
    headers: {
      'Authorization': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      locations: toORSCoords(stops),
      metrics: ['distance'],
      units: 'km',
    }),
  });

  if (!response.ok) throw new Error(`ORS Matrix failed: ${response.status}`);
  const data = await response.json();
  return data.distances; // 2D array: distances[i][j] = road km from stop i to stop j
}

export async function fetchRouteGeometry(stops) {
  const response = await fetch(`${BASE_URL}/directions/driving-car/geojson`, {
    method: 'POST',
    headers: {
      'Authorization': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      coordinates: toORSCoords(stops),
    }),
  });

  if (!response.ok) throw new Error(`ORS Directions failed: ${response.status}`);
  const data = await response.json();
  return data.features[0].geometry; // GeoJSON LineString — Leaflet draws this directly
}

export async function fetchAddressLabel(lat, lng) {
  const response = await fetch(`https://api.openrouteservice.org/geocode/reverse?api_key=${API_KEY}&point.lon=${lng}&point.lat=${lat}&size=1`);
  if (!response.ok) return null;
  const data = await response.json();
  return data.features?.[0]?.properties?.label ?? null;
}