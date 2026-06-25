// import { getDistance } from "./geometry";

// nearest neighbor algorithm to find the closest point to the current point
export function nearestNeighbor(stops, distanceMatrix = null){ 

    const start = stops[0];
    const stops_count = stops.length;

    let unvisited = [...stops];
    unvisited.splice(0, 1); //remove the first stop (assuming that the frist stop is the current location)
    
    let order = [start];
    
    if(stops_count > 2){ 

        while(unvisited.length > 0){

            let min_distance = Infinity;
            let nearest_neighbour = 0;
            const current = order[order.length - 1];

            for(let i = 0, j = unvisited.length; i < j; i++){

                const currentIndex = current.matrixIndex;
                const unvisitedIndex = unvisited[i].matrixIndex;

                // const distance = distanceMatrix
                //     ? distanceMatrix[currentIndex][unvisitedIndex]  // real road km from matrix
                //     : getDistance(current, unvisited[i]);           // Haversine fallback
                distanceMatrix[currentIndex][unvisitedIndex];      

                if(distance < min_distance){
                    min_distance = distance;
                    nearest_neighbour = i;
                }
            }

            order.push(unvisited[nearest_neighbour]);
            unvisited.splice(nearest_neighbour, 1);
        }

        return order;

    }
    else{
        return stops;
    }
}

// helper function for the two opt fliping
function twoOptSwap(route, i, k){
    const newRoute = route.slice(0, i); // Everything before index i
    const middleSection = route.slice(i, k + 1).reverse(); // The section to flip
    const endSection = route.slice(k + 1); // Everything after index k
    
    return [...newRoute, ...middleSection, ...endSection];
};

export function calculateTotalDistance(route, distanceMatrix = null){
    let totalDist = 0;
    
    for(let i = 0; i < route.length - 1; i++){

        totalDist += distanceMatrix[route[i].matrixIndex][route[i + 1].matrixIndex];

        // if (distanceMatrix) {
        // // matrixIndex is stable regardless of shuffle order
        // totalDist += distanceMatrix[route[i].matrixIndex][route[i + 1].matrixIndex];
        // } else {
        // totalDist += getDistance(route[i], route[i + 1]);
        // }

        totalDist += distanceMatrix[route[route.length - 1].matrixIndex][route[0].matrixIndex];

        // if (distanceMatrix) {
        //     totalDist += distanceMatrix[route[route.length - 1].matrixIndex][route[0].matrixIndex];
        // } else {
        //     totalDist += getDistance(route[route.length - 1], route[0]);
        // }
    }
    
    return totalDist;
}



export function twoOpt(stops, distanceMatrix = null) {
    let bestRoute = [...stops];
    let improved = true;

    while (improved) {
        improved = false;
        let bestDistance = calculateTotalDistance(bestRoute);
        // Loop through all possible pairs to swap
        for (let i = 1; i < bestRoute.length - 1; i++) { // Start i at 1 to keep the starting point fixed
            for (let k = i + 1; k < bestRoute.length; k++) {
                
                const newRoute = twoOptSwap(bestRoute, i, k);
                let newDistance = calculateTotalDistance(newRoute, distanceMatrix);
                

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