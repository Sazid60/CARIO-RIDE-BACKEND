// import { Ride } from "./ride.model";
// import { IRide } from "./ride.interface";

// const createRide = async (payload: IRide) => {
//   const ride = await Ride.create(payload);
//   return { data: ride };
// };

// export const rideService = {
//   createRide
// };

import { Ride } from "./ride.model";
import { IRide } from "./ride.interface";
import { calculateDistanceAndFare } from "../../utils/calculateDistanceAndFare";


const createRide = async (payload: IRide) => {
  const { pickupLocation, destination } = payload;

  const { distanceKm, fare } = calculateDistanceAndFare(
    pickupLocation.coordinates,
    destination.coordinates
  );

  const ride = await Ride.create({
    ...payload,
    travelDistance: distanceKm,
    fare,
  });

  return { data: ride };
};

export const rideService = {
  createRide,
};

