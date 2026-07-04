// Ported from Sonar
// distanceMatrix = null → falls back to Haversine automatically

import { getDistance } from './geometry';

function twoOptSwap(route, i, k) {
  const newRoute = route.slice(0, i);
  const middle = route.slice(i, k + 1).reverse();
  const end = route.slice(k + 1);
  return [...newRoute, ...middle, ...end];
}

export function calculateTotalDistance(route, distanceMatrix = null) {
  let total = 0;

  for (let i = 0; i < route.length - 1; i++) {
    if (distanceMatrix) {
      total += distanceMatrix[route[i].matrixIndex][route[i + 1].matrixIndex];
    } else {
      total += getDistance(route[i], route[i + 1]);
    }
  }

  // Round trip — last stop back to first
  // if (distanceMatrix) {
  //   total += distanceMatrix[route[route.length - 1].matrixIndex][route[0].matrixIndex];
  // } else {
  //   total += getDistance(route[route.length - 1], route[0]);
  // }

  // return total;
}

export function nearestNeighbor(stops, distanceMatrix = null) {
  if (stops.length < 2) return stops;

  const start = stops[0];
  let unvisited = [...stops];
  unvisited.splice(0, 1);
  let order = [start];

  while (unvisited.length > 0) {
    let minDistance = Infinity;
    let nearestIndex = 0;
    const current = order[order.length - 1];

    for (let i = 0; i < unvisited.length; i++) {
      const distance = distanceMatrix
        ? distanceMatrix[current.matrixIndex][unvisited[i].matrixIndex]
        : getDistance(current, unvisited[i]);

      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = i;
      }
    }

    order.push(unvisited[nearestIndex]);
    unvisited.splice(nearestIndex, 1);
  }

  return order;
}

export function twoOpt(stops, distanceMatrix = null) {
  if (stops.length < 3) return stops;

  let bestRoute = [...stops];
  let improved = true;
  let bestDistance = calculateTotalDistance(bestRoute, distanceMatrix);

  while (improved) {
    improved = false;
    for (let i = 1; i < bestRoute.length - 1; i++) {
      for (let k = i + 1; k < bestRoute.length; k++) {
        const newRoute = twoOptSwap(bestRoute, i, k);
        const newDistance = calculateTotalDistance(newRoute, distanceMatrix);

        if (newDistance < bestDistance) {
          bestRoute = newRoute;
          bestDistance = newDistance;
          improved = true;
        }
      }
    }
  }

  return bestRoute;
}
