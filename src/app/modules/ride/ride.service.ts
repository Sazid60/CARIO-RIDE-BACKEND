
import { Ride } from "./ride.model";
import { IRide, RideStatus } from "./ride.interface";
import { calculateDistanceAndFare } from "../../utils/calculateDistanceAndFare";
import { IsActive, IUser, RiderStatus } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { Driver } from "../driver/driver.model";
import { DriverStatus, IDriver } from "../driver/driver.interface";
import haversine from 'haversine-distance';



const createRide = async (payload: IRide) => {
  const { pickupLocation, destination } = payload;

  const session = await Ride.startSession();
   session.startTransaction();
  try {
 

    const rider = await User.findById(payload.riderId).session(session);
    if (!rider) {
      throw new AppError(httpStatus.NOT_FOUND, "Rider not found.");
    }

    if (rider.isActive === IsActive.BLOCKED) {
      throw new AppError(httpStatus.BAD_REQUEST, "You are blocked. Contact admin.");
    }

    if (rider.riderStatus === RiderStatus.REQUESTED || rider.riderStatus === RiderStatus.ON_RIDE) {
      throw new AppError(httpStatus.BAD_REQUEST, "You already have a ride in progress or pending.");
    }

    const { distanceKm, fare } = calculateDistanceAndFare(
      pickupLocation.coordinates,
      destination.coordinates
    );

    const ride = await Ride.create([{ ...payload, travelDistance: distanceKm, fare }], { session });

    await User.findByIdAndUpdate(payload.riderId, { riderStatus: RiderStatus.REQUESTED }, { session });

    await session.commitTransaction();
    session.endSession();

    return { data: ride[0] };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getRidesNearMe = async (userId: string) => {
  const user: IUser | null = await User.findById(userId);

  if (user && user.isActive === IsActive.BLOCKED) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are blocked. Contact Admin.");
  }

  const driver: IDriver | null = await Driver.findOne({ userId });

  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not found.");
  }

  if (driver.driverStatus !== DriverStatus.APPROVED) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `Driver is not approved to accept rides. Your status is currently: ${driver.driverStatus}`
    );
  }

  if (!driver.currentLocation || !driver.currentLocation.coordinates) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver location is not set.");
  }

  const requestedRides: IRide[] = await Ride.find({
    rideStatus: RideStatus.REQUESTED,
  });

  const nearByRides = requestedRides.filter((ride) => {
    if (!ride.pickupLocation?.coordinates || !driver.currentLocation?.coordinates) return false;

    const [pickupLng, pickupLat] = ride.pickupLocation.coordinates;
    const [driverLng, driverLat] = driver.currentLocation.coordinates;

    const distanceInMeters = haversine(
      { lat: driverLat, lon: driverLng },
      { lat: pickupLat, lon: pickupLng }
    );
    return distanceInMeters <= 1000;
  });

  return {
    success: true,
    data: nearByRides,
  };
};
export const rideService = {
  createRide,
  getRidesNearMe
};

