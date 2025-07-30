
import { Ride } from "./ride.model";
import { IRide, RideStatus } from "./ride.interface";
import { calculateDistanceAndFare } from "../../utils/calculateDistanceAndFare";
import { IsActive, IUser, RiderStatus } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { Driver } from "../driver/driver.model";
import { DriverOnlineStatus, DriverRidingStatus, DriverStatus, IDriver } from "../driver/driver.interface";
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
      throw new AppError(httpStatus.BAD_REQUEST, `You already have a ride in ${rider.riderStatus} State.`);
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

const getRidesNearMe = async (userId: string) => {
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

  if (driver.onlineStatus === DriverOnlineStatus.OFFLINE) {
    throw new AppError(httpStatus.BAD_REQUEST, "Go Online To See The Rides Around You!");
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

export const acceptRide = async (driverUserId: string, rideId: string) => {
  const session = await Ride.startSession();
  session.startTransaction();

  try {
    const driver = await Driver.findOne({ userId: driverUserId }).session(session);
    if (!driver) {
      throw new AppError(httpStatus.NOT_FOUND, "Driver not found.");
    }

    if (driver.driverStatus === DriverStatus.SUSPENDED) {
      throw new AppError(httpStatus.BAD_REQUEST, "You are suspended. Cannot accept rides.");
    }
    if (driver.onlineStatus === DriverOnlineStatus.OFFLINE) {
      throw new AppError(httpStatus.BAD_REQUEST, "First go Online Then Try To Accept!");
    }

    if (driver.ridingStatus !== DriverRidingStatus.IDLE) {
      throw new AppError(httpStatus.BAD_REQUEST, "You can Not Accept another Ride While In a Trip");
    }

    const ride = await Ride.findById(rideId).session(session);
    if (!ride) {
      throw new AppError(httpStatus.NOT_FOUND, "Ride not found.");
    }

    if (ride.rideStatus !== RideStatus.REQUESTED) {
      throw new AppError(httpStatus.BAD_REQUEST, `Ride is Already ${ride.rideStatus}`);
    }


    if (String(driver.userId) === String(ride.riderId)) {
      throw new AppError(httpStatus.BAD_REQUEST, "You cannot accept your own ride.");
    }

    const rider = await User.findById(ride.riderId).session(session);
    if (!rider) {
      throw new AppError(httpStatus.NOT_FOUND, "Rider not found.");
    }

    ride.driverId = driver._id;
    ride.rideStatus = RideStatus.ACCEPTED;
    ride.timestamps = {
      ...ride.timestamps,
      acceptedAt: new Date(),
    };
    await ride.save({ session });

    driver.ridingStatus = DriverRidingStatus.ACCEPTED;
    await driver.save({ session });

    rider.riderStatus = RiderStatus.WAITING;
    await rider.save({ session });


    const data = {
      riderName: rider.name,
      riderPhone: rider.phone
    }

    await session.commitTransaction();
    session.endSession();

    return {
      data: data
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const pickupRider = async (driverUserId: string, rideId: string) => {
  const session = await Ride.startSession();
  session.startTransaction();

  try {
    const driver = await Driver.findOne({ userId: driverUserId }).session(session);
    if (!driver) {
      throw new AppError(httpStatus.NOT_FOUND, "Driver not found.");
    }

    if (driver.driverStatus === DriverStatus.SUSPENDED) {
      throw new AppError(httpStatus.BAD_REQUEST, "You are suspended. Cannot complete.");
    }


    if (driver.onlineStatus === DriverOnlineStatus.OFFLINE) {
      throw new AppError(httpStatus.BAD_REQUEST, "Go Online To Pickup The Rider!");
    }

    const ride = await Ride.findById(rideId).session(session);
    if (!ride) {
      throw new AppError(httpStatus.NOT_FOUND, "Ride not found.");
    }

    if (!ride.driverId) {
      throw new AppError(httpStatus.BAD_REQUEST, "You Have Not Accepted This Ride Yet! Accept First!");
    }

    if (String(driver._id) !== String(ride.driverId)) {
      throw new AppError(httpStatus.BAD_REQUEST, "You cannot pick up another driver's rider!");
    }

    if ([RideStatus.PICKED_UP, RideStatus.IN_TRANSIT, RideStatus.COMPLETED].includes(ride.rideStatus)) {
      throw new AppError(httpStatus.BAD_REQUEST, `This ride is already in ${ride.rideStatus} State.`);
    }

    if (ride.rideStatus === RideStatus.CANCELLED) {
      throw new AppError(httpStatus.BAD_REQUEST, "This ride was cancelled.");
    }

    if (ride.rideStatus !== RideStatus.ACCEPTED) {
      throw new AppError(httpStatus.BAD_REQUEST, "You must accept the ride first.");
    }

    if (String(driver.userId) === String(ride.riderId)) {
      throw new AppError(httpStatus.BAD_REQUEST, "You cannot pick up your own ride.");
    }

    const rider = await User.findById(ride.riderId).session(session);
    if (!rider) {
      throw new AppError(httpStatus.NOT_FOUND, "Rider not found.");
    }

    ride.rideStatus = RideStatus.PICKED_UP;
    ride.timestamps = {
      ...ride.timestamps,
      pickedUpAt: new Date(),
    };
    await ride.save({ session });

    driver.ridingStatus = DriverRidingStatus.RIDING;
    await driver.save({ session });

    rider.riderStatus = RiderStatus.PICKED_UP;
    await rider.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      data: {
        riderDestination: ride.destination,
        totalFare: ride.fare,
      },
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const startRide = async (driverUserId: string, rideId: string) => {
  const session = await Ride.startSession();
  session.startTransaction();

  try {
    const driver = await Driver.findOne({ userId: driverUserId }).session(session);
    if (!driver) {
      throw new AppError(httpStatus.NOT_FOUND, "Driver not found.");
    }

    if (driver.driverStatus === DriverStatus.SUSPENDED) {
      throw new AppError(httpStatus.BAD_REQUEST, "You are suspended. Cannot complete.");
    }


    if (driver.onlineStatus === DriverOnlineStatus.OFFLINE) {
      throw new AppError(httpStatus.BAD_REQUEST, "Go Online To start The Ride!");
    }

    const ride = await Ride.findById(rideId).session(session);
    if (!ride) {
      throw new AppError(httpStatus.NOT_FOUND, "Ride not found.");
    }

    if (!ride.driverId) {
      throw new AppError(httpStatus.BAD_REQUEST, "You Have Not Accepted This Ride Yet! Accept First!");
    }

    if (String(driver._id) !== String(ride.driverId)) {
      throw new AppError(httpStatus.BAD_REQUEST, "You cannot Start Riding with another driver's rider!");
    }

    if (ride.rideStatus === RideStatus.CANCELLED) {
      throw new AppError(httpStatus.BAD_REQUEST, "This ride was cancelled.");
    }

    if ([RideStatus.IN_TRANSIT, RideStatus.COMPLETED].includes(ride.rideStatus)) {
      throw new AppError(httpStatus.BAD_REQUEST, `This ride is already in ${ride.rideStatus} State.`);
    }

    if (ride.rideStatus !== RideStatus.PICKED_UP) {
      throw new AppError(httpStatus.BAD_REQUEST, "You must Pickup Rider To Start The Ride.");
    }

    if (String(driver.userId) === String(ride.riderId)) {
      throw new AppError(httpStatus.BAD_REQUEST, "You cannot Run your ride with Your Owns.");
    }

    const rider = await User.findById(ride.riderId).session(session);
    if (!rider) {
      throw new AppError(httpStatus.NOT_FOUND, "Rider not found.");
    }

    ride.rideStatus = RideStatus.IN_TRANSIT;
    ride.timestamps = {
      ...ride.timestamps,
      startedAt: new Date(),
    };
    await ride.save({ session });

    driver.ridingStatus = DriverRidingStatus.RIDING;
    await driver.save({ session });

    rider.riderStatus = RiderStatus.ON_RIDE;
    await rider.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      data: {
        riderDestination: ride.destination,
        totalFare: ride.fare,
      },
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const completeRide = async (driverUserId: string, rideId: string) => {
  const session = await Ride.startSession();
  session.startTransaction();

  try {
    const driver = await Driver.findOne({ userId: driverUserId }).session(session);
    if (!driver) {
      throw new AppError(httpStatus.NOT_FOUND, "Driver not found.");
    }

    if (driver.driverStatus === DriverStatus.SUSPENDED) {
      throw new AppError(httpStatus.BAD_REQUEST, "You are suspended. Cannot complete.");
    }


    if (driver.onlineStatus === DriverOnlineStatus.OFFLINE) {
      throw new AppError(httpStatus.BAD_REQUEST, "Go Online To Pickup The Rider!");
    }

    const ride = await Ride.findById(rideId).session(session);
    if (!ride) {
      throw new AppError(httpStatus.NOT_FOUND, "Ride not found.");
    }

    if (!ride.driverId) {
      throw new AppError(httpStatus.BAD_REQUEST, "You Have Not Accepted This Ride Yet! Accept First!");
    }

    if (String(driver._id) !== String(ride.driverId)) {
      throw new AppError(httpStatus.BAD_REQUEST, "You cannot Start Riding with another driver's rider!");
    }

    if (ride.rideStatus === RideStatus.CANCELLED) {
      throw new AppError(httpStatus.BAD_REQUEST, "This ride was cancelled.");
    }

    if ([RideStatus.COMPLETED].includes(ride.rideStatus)) {
      throw new AppError(httpStatus.BAD_REQUEST, `This ride is already in ${ride.rideStatus} State.`);
    }

    if (ride.rideStatus !== RideStatus.IN_TRANSIT) {
      throw new AppError(httpStatus.BAD_REQUEST, "You must Start Ride To Finish The Ride!.");
    }

    if (String(driver.userId) === String(ride.riderId)) {
      throw new AppError(httpStatus.BAD_REQUEST, "You cannot Run your ride with Your Owns.");
    }

    const rider = await User.findById(ride.riderId).session(session);
    if (!rider) {
      throw new AppError(httpStatus.NOT_FOUND, "Rider not found.");
    }

    ride.rideStatus = RideStatus.COMPLETED;
    ride.timestamps = {
      ...ride.timestamps,
      completedAt: new Date(),
    };
    await ride.save({ session });

    driver.ridingStatus = DriverRidingStatus.IDLE;
    driver.totalEarning = Number(driver.totalEarning || 0) + Number(ride.fare || 0);
    driver.totalRides = Number(driver.totalRides || 0) + 1;
    driver.currentLocation = ride.destination;
    await driver.save({ session });

    rider.riderStatus = RiderStatus.IDLE;
    await rider.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      data: {
        totalIncome: ride.fare,
      },
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllRidesForAdmin = async() =>{
  const allRides = await Ride.find({})

  return {
    allRides
  }
}
const getAllRidesForRider = async(riderId : string) =>{

  const allRides = await Ride.find({ riderId : {$eq :riderId}})
  return {
    allRides
  }
}
const getAllRidesForDriver = async(userId : string) =>{
  const driver = await Driver.findOne({userId}) 

  if(!driver){
    throw new AppError(httpStatus.BAD_REQUEST, "Driver InFormation Not Found !")
  }
  
  const driverId= driver._id

  const allRides = await Ride.find({ driverId : {$eq : driverId}})
  return {
    allRides
  }
}

export const rideService = {
  createRide,
  getRidesNearMe,
  acceptRide,
  pickupRider,
  startRide,
  completeRide,
  getAllRidesForAdmin,
  getAllRidesForRider,
  getAllRidesForDriver 
};

