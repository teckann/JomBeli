"use client"
import { useEffect, useRef } from 'react';
import L, { bounds } from 'leaflet';
import { useStopContext } from '@/app/_context/StopContext';
import Styles from './CourierMapView.module.css';
import 'leaflet/dist/leaflet.css'

export default function CourierMapView() {
  const MAP_BOUNDS = [ [-90, -180], [90, 180] ]; 
  const { stops, addStop, routeGeometry } = useStopContext();
  const mapContainerRef = useRef(null); //container of the map display
  const mapRef = useRef(null); //map instance
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  // Initialize map once on mount
  useEffect(() => {
    if (mapRef.current) return; // guard against double init (React Strict Mode)

    mapRef.current = L.map(mapContainerRef.current, {
      center: [3.056069, 101.700466], // APU Coord
      zoom: 20,
      maxBounds: MAP_BOUNDS,
      maxBoundsViscosity: 1.0
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);

    mapRef.current.on('click', (e) => {
      addStop(e.latlng.lat, e.latlng.lng);
    });

  }, []);

  // Sync markers whenever stops change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Draw new markers
    stops.forEach((stop, index) => {
      const marker = L.marker([stop.lat, stop.lng])
        .addTo(map)
        .bindPopup(`Stop ${index + 1}`); //update pin label
      markersRef.current.push(marker);
    });

    // Clear old polyline
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    if (stops.length >= 2) {
      if (routeGeometry) {
        // ORS road-following geometry
        polylineRef.current = L.geoJSON(routeGeometry, {
          style: { color: '#00E5FF', weight: 3, opacity: 0.9 }
        }).addTo(map);
      } else {
        // Haversine fallback — straight lines
        const coords = stops.map(s => [s.lat, s.lng]);
        polylineRef.current = L.polyline(coords, {
          color: '#00E5FF', weight: 3, opacity: 0.9
        }).addTo(map);
      }

      map.fitBounds(
        stops.map(s => [s.lat, s.lng]),
        { padding: [40, 40] }
      );
    }
  }, [stops, routeGeometry]);

  return (
    <div ref={mapContainerRef} className={Styles.mapContainer}/>
  );
}