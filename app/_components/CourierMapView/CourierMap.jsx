'use client';

import { MapContainer, TileLayer, Marker, GeoJSON, Popup, useMap } from 'react-leaflet';
import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const courierIcon = L.divIcon({
  className: '',
  html: '<div class="courier-dot"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function PanToUser({ courierPosition }) {
  const map = useMap();

  useEffect(() => {
    if (!courierPosition) return;
    map.panTo([courierPosition.lat, courierPosition.lng], {
      animate: true,
      duration: 0.5,
    });
  }, [courierPosition]);

  return null;
}

export default function CourierMap({ courierPosition, optimizedStops, routeGeometry }) {
  const center = courierPosition ?? optimizedStops?.[0];

  const trimmedGeometry = useMemo(() => {
    if (!routeGeometry || !courierPosition) return routeGeometry;

    const coords = routeGeometry.coordinates;
    let closestIndex = 0;
    let minDist = Infinity; 

    coords.forEach(([lng, lat], i) => {
      // use Euclidean distance formula to find the closest coord to the courier
      const dist = Math.sqrt(
        Math.pow(lat - courierPosition.lat, 2) +
        Math.pow(lng - courierPosition.lng, 2)
      );
      if (dist < minDist) {
        minDist = dist;
        closestIndex = i;
      }
    });

    return {
      ...routeGeometry,
      coordinates: coords.slice(closestIndex),// slice the corrds before the closest coord
    };
  }, [routeGeometry, courierPosition]);

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={20}
      className="courierMap"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Courier Marker */}
      {courierPosition && (
        <Marker position={[courierPosition.lat, courierPosition.lng]} icon={courierIcon} />
      )}

      {/* Delivery stop markers*/}
      {optimizedStops?.map((stop, index) => (
        <Marker
          key={stop.orderId ?? index}
          position={[stop.lat, stop.lng]}
        >
          <Popup>
            <div className="map-popup">
              <span className="map-popup__index">Stop {index + 1}</span>
              {stop.label && <p className="map-popup__label">{stop.label}</p>}
              {stop.orderId && <p className="map-popup__order">Order #{stop.orderId}</p>}
              {stop.orderId && <p className="map-popup__order">Recipient: {stop.recipient_name}</p>}
              {stop.orderId && <p className="map-popup__order">Recipient Contact: {stop.recipient_contact}</p>}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* route polyline */}
      {trimmedGeometry && (
        <GeoJSON
          key={JSON.stringify(trimmedGeometry.coordinates[0])}
          data={trimmedGeometry}
          style={{ color: '#e86364', weight: 5, opacity: 0.85 }}
        />
      )}
      <PanToUser courierPosition={courierPosition}/>
    </MapContainer>
  );
}
