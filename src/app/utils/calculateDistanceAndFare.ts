/* eslint-disable no-console */
// import haversine from "haversine-distance";

// export const calculateDistanceAndFare = (
//   pickup: [number, number],
//   destination: [number, number],
//   baseFarePerKm = 100
// ) => {
//   const [pickupLng, pickupLat] = pickup;
//   const [destLng, destLat] = destination;

//   const distanceInMeters = haversine(
//     { lat: pickupLat, lon: pickupLng },
//     { lat: destLat, lon: destLng }
//   );

//   const distanceKm = parseFloat((distanceInMeters / 1000).toFixed(2));
//   const fare = parseFloat((distanceKm * baseFarePerKm).toFixed(2));

//   return { distanceKm, fare };
// };


import axios from "axios";
import { envVars } from "../config/env";

export const calculateDistanceAndFare = async (
  pickup: [number, number],
  destination: [number, number],
  baseFarePerKm = 100
) => {
  try {
    const res = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        coordinates: [
          [pickup[0], pickup[1]],        
          [destination[0], destination[1]] 
        ],
      },
      {
        headers: {
          Authorization: envVars.ORS_API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    const route = res.data.features[0];
    const distanceInMeters = route.properties.summary.distance; 
    const distanceKm = parseFloat((distanceInMeters / 1000).toFixed(2));
    const fare = parseFloat((distanceKm * baseFarePerKm).toFixed(2));

    return {
      distanceKm,
      fare,
    };
  } catch (err) {
    console.error("Error calculating distance and fare:", err);
    return { distanceKm: 0, fare: 0 };
  }
};

