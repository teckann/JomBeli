export default async function getLatLng(fullAddress) {
  const GEO_API_KEY = "6a48cd490717e052701223gcd20c354";

  const geoRes = await fetch(
    `https://geocode.maps.co/search?q=${encodeURIComponent(fullAddress)}` +
      `&api_key=${GEO_API_KEY}`,
  );

  const geoData = await geoRes.json();

  console.log(geoData);

  let lat = null;
  let lng = null;

  if (Array.isArray(geoData) && geoData.length > 0) {
    lat = geoData[0].lat;
    lng = geoData[0].lon;
  }

  return { lat, lng };
}
