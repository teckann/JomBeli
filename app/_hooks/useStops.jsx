import { useState } from 'react';
import { fetchAddressLabel } from '@/app/_lib/ors';

export function useStops() {
  const [stops, setStops] = useState([]);

  const addStop = async (lat, lng) => {
    const streetName = await fetchAddressLabel(lat,lng);
    const stop = {
                id: Math.random().toString(36).slice(2, 9),
                lat: lat, 
                lng: lng,
                name: streetName,
               };

    setStops(prevStops => [...prevStops, stop]);
  };

  const removeStop = (id) => {
    setStops(prevStops => prevStops.filter(stop => stop.id !== id));
  };

  const clearStops = () => {
    setStops([]);
  };

  return { stops, addStop, removeStop, clearStops };
}