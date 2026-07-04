'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useBatchNavigation } from '@/app/_hooks/useBatchNavigation';
import StopSequenceList from './StopSequenceList';
import './CourierMapView.css';
import { fetchCourierStops, markOrderDelivered } from '@/app/_lib/courierStops';
const CourierMap = dynamic(() => import('./CourierMap'), {
  ssr: false,
});

export default function CourierMapView() {
  const [stops, setStops] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    async function fetchStops() {
      try {
        setIsFetching(true);
        const stops = await fetchCourierStops();
        setStops(stops);
      } catch (err) {
        console.log("Fetch Stops failed:", err.message);
        setStops([]);
      } finally {
        setIsFetching(false);
      }
    }

    fetchStops();
  }, []);

  async function handleDelivered(orderId) {
    try {
      await markOrderDelivered(orderId);
      setStops(prev => prev.filter(s => s.orderId !== orderId));
    } catch (err) {
      console.error('Failed to mark delivered:', err.message);
    }
  }

  const {
    courierPosition,
    gpsError,
    optimizedStops,
    routeGeometry,
    routeDetails,
    isLoading: isRoutingLoading,
    error: routingError,
    usedFallback,
  } = useBatchNavigation(stops);


  if (isFetching) {
    return (
      <div className="loadingScreen">
        <div className="courieSpinner" />
        <p>Retrieving Order Stops...</p>
      </div>
    );
  }

  if (gpsError) {
    return (
      <div className="errorScreen">
        <p>Location access is required for navigation</p>
        <p className="errorDetail">{gpsError}</p>
        <p className="errorDetail">
          Please enable location permissions in your browser settings and refresh
        </p>
      </div>
    );
  }

  if (!courierPosition) {
    return (
      <div className="loadingScreen">
        <div className="courieSpinner" />
        <p>Getting your live GPS location...</p>
      </div>
    );
  }

  return (
    <div className="courierNav">
      <CourierMap
        courierPosition={courierPosition}
        optimizedStops={optimizedStops}
        routeGeometry={routeGeometry}
      />

      <div className="sideBarContainer">
        <div className="sideBarHeader">
          <span className='sideBarHeaderTitle'>JOMBELI COURIER</span>
          <span className="stopCount">
            {optimizedStops?.length} stops
          </span>
        </div>

        {isRoutingLoading && (
          <div className="statusBanner">
            Optimizing route...
          </div>
        )}
        {routingError && (
          <div className="statusBanner">
            {routingError}
          </div>
        )}
        {usedFallback && !isRoutingLoading && (
          <div className="statusBanner">
            Road routing unavailable — showing straight-line estimate
          </div>
        )}

        {routeDetails && (
          <div className="routeStatContainer">
            <div className="routeStat">
              <span className="statLabel">Total Distance</span>
              <span className="statValue">
                {routeDetails.totalDistanceKm} km
              </span>
            </div>
            {routeDetails.durationMin && (
              <div className="routeStat">
                <span className="statLabel">Estimated Duration</span>
                <span className="statValue">
                  {routeDetails.durationMin} min
                </span>
              </div>
            )}
          </div>
        )}

        {/* {routeDetails?.steps?.[0] && (
          <div>
            <span>Next Step</span>
            <span>
              {routeDetails.steps[0].instruction}
            </span>
            <span>
              in {routeDetails.steps[0].distanceM}m
            </span>
          </div>
        )} */}

        <StopSequenceList stops={optimizedStops} isLoading={isRoutingLoading} onDelivered={handleDelivered}/>
      </div>
    </div>
  );
}
