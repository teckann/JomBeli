'use client';

export default function StopSequenceList({ stops, isLoading, onDelivered}) {
  if (isLoading && !stops?.length) {
    return (
      <div className="stopList stopListLoading">
        <p>Optimizing route...</p>
      </div>
    );
  }

  return (
    <div className="stopList">
      <p className="stopListHeader">Delivery Sequence</p>
      {stops?.map((stop, index) => (
        <div key={stop.orderId ?? index}>
          <div className="stopListItem">
            <div className="stopListNumber">{index + 1}</div>
            <div className="stopListInfo">
              {stop.label ? (
                <p className="stopListLabel">{stop.label}</p>
              ) : (
                <p className="stopListCoords">
                  {stop.lat.toFixed(5)}, {stop.lng.toFixed(5)}
                </p>
              )}
              {stop.orderId && (
                <p className="stopListOrderId">Order #{stop.orderId}</p>
              )}
            </div>
            <button
              className="deliveredButton"
              onClick={() => onDelivered(stop.orderId)}
            >
              Delivered
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
