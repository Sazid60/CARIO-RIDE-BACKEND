
import { Request, Response } from "express";
import { rideService } from "./ride.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { RideStatus } from "./ride.interface";

const createRide = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const userId = user.userId;



  const payload = {
    ...req.body,
    riderId: userId,
    rideStatus: RideStatus.REQUESTED,
    timestamps: {
      requestedAt: new Date(),
    },
  };

  const result = await rideService.createRide(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Ride requested successfully",
    data: result.data,
  });
});

const getRidesNearMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const userId = user.userId;

  const result = await rideService.getRidesNearMe(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Ride Retrieved successfully",
    data: result.data,
  });
});

const acceptRide = catchAsync(async (req: Request, res: Response) => {
  const driver = req.user as JwtPayload;
  const driverId = driver.userId;
  const rideId = req.params.id


  const acceptedRide = await rideService.acceptRide(driverId, rideId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Ride Accepted successfully",
    data: acceptedRide.data
  });
});
const rejectRide = catchAsync(async (req: Request, res: Response) => {
  const driver = req.user as JwtPayload;
  const driverId = driver.userId;
  const rideId = req.params.id


  const acceptedRide = await rideService.rejectRide(driverId, rideId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Ride Rejected successfully",
    data: acceptedRide.data
  });
});

const pickupRider = catchAsync(async (req: Request, res: Response) => {
  const driver = req.user as JwtPayload;
  const driverId = driver.userId;
  const rideId = req.params.id

  const pickedUpRider = await rideService.pickupRider(driverId, rideId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rider PickedUp successfully",
    data: pickedUpRider.data
  });
});

const startRide = catchAsync(async (req: Request, res: Response) => {
  const driver = req.user as JwtPayload;
  const driverId = driver.userId;
  const rideId = req.params.id

  const rideInfo = await rideService.startRide(driverId, rideId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Ride Has Been Started !",
    data: rideInfo.data
  });
});

const arrived = catchAsync(async (req: Request, res: Response) => {
  const driver = req.user as JwtPayload;
  const driverId = driver.userId;
  const rideId = req.params.id

  const rideInfo = await rideService.arrivedDestination(driverId, rideId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Arrived In The Destination!",
    data: rideInfo.data
  });

});
const payOffline = catchAsync(async (req: Request, res: Response) => {
  const driver = req.user as JwtPayload;
  const driverId = driver.userId;
  const rideId = req.params.id

  const rideInfo = await rideService.payOffline(driverId, rideId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Payment Completed!",
    data: rideInfo.data
  });

});


const payOnline = catchAsync(async (req: Request, res: Response) => {
  const rider = req.user as JwtPayload;
  const riderId = rider.userId;
  const rideId = req.params.id

  const rideInfo = await rideService.payOnline(riderId, rideId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: " Online Payment Initiated!",
    data: rideInfo
  });

});


const getAllRidesForAdmin = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const rideInfo = await rideService.getAllRidesForAdmin(query as Record<string, string>)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "All Rides Retrieved For Admin !",
    data: rideInfo
  });

});

const getAllRidesForRider = catchAsync(async (req: Request, res: Response) => {

  const rider = req.user as JwtPayload
  const riderId = rider.userId
  const query = req.query;

  const rideInfo = await rideService.getAllRidesForRider(riderId, query as Record<string, string>)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rides Made By You are Retrieved!",
    data: rideInfo
  });

});

const getAllRidesForDriver = catchAsync(async (req: Request, res: Response) => {

  const user = req.user as JwtPayload
  const userId = user.userId
  const query = req.query;

  const rideInfo = await rideService.getAllRidesForDriver(userId, query as Record<string, string>)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rides Made By You are Retrieved!",
    data: rideInfo
  });

});
const getSingleRideForRider = catchAsync(async (req: Request, res: Response) => {
  const rideId = req.params.id
  const riderInfo = req.user as JwtPayload

  const riderId = riderInfo.userId

  const result = await rideService.getSingleRideForRider(rideId, riderId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Your Ride Information Retrieved!",
    data: result.data
  });

});
const getSingleRideForAdmin = catchAsync(async (req: Request, res: Response) => {
  const rideId = req.params.id


  const result = await rideService.getSingleRideForAdmin(rideId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Single Ride Information Retrieved!",
    data: result.data
  });

});
const getSingleRideForDriver = catchAsync(async (req: Request, res: Response) => {
  const rideId = req.params.id
  const driverInfo = req.user as JwtPayload

  const driverId = driverInfo.userId

  const result = await rideService.getSingleRideForDriver(rideId, driverId)

  console.log("dri", result)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Your Ride Information Retrieved!",
    data: result.data
  });

});

const getLatestAcceptedRideForDriver = catchAsync(async (req: Request, res: Response) => {
  const driverInfo = req.user as JwtPayload

  const driverId = driverInfo.userId

  const result = await rideService.getLatestAcceptedRideForDriver(driverId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Your Accepted Ride Information Retrieved!",
    data: result.data
  });

});

const getRequestedRideForRider = catchAsync(async (req: Request, res: Response) => {

  const rider = req.user as JwtPayload
  const riderId = rider.userId

  const rideInfo = await rideService.getRequestedRideForRider(riderId)

  console.log(rideInfo)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rides Made By You are Retrieved!",
    data: rideInfo
  });

});


const getDriversNearMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const userId = user.userId;

  const result = await rideService.getDriversNearMe(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message:
      result.count === 0
        ? "Please wait. For now, there is no driver available near you."
        : "Available Drivers Retrieved Successfully!",
    data: result.data,
  });
});


const cancelRideByRider = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const userId = user.userId;

  const rideId = req.params.id

  const result = await rideService.cancelRideByRider(userId, rideId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Your Ride Has Been Cancelled!",
    data: result.data,
  });
});


const giveFeedback = catchAsync(async (req: Request, res: Response) => {
  const { rideId } = req.params;
  const { feedback, rating } = req.body;
  const user = req.user as JwtPayload
  const userId = user.userId


  const result = await rideService.giveFeedbackAndRateDriver(rideId, userId, feedback, rating);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Feedback submitted successfully",
    data: result,
  });
});
const getFeedbacks = catchAsync(async (req: Request, res: Response) => {
  const result = await rideService.getFeedbacks();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Feedback Retrieved successfully",
    data: result,
  });
});

const updateRideLocation = catchAsync(async (req: Request, res: Response) => {
  const rideId = req.params.id
  const currentLocation = req.body;
  const result = await rideService.updateRideLocation(rideId, currentLocation)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Ride Location Updated!",
    data: result.data
  })
});

export const rideController = {
  getSingleRideForAdmin,
  updateRideLocation,
  createRide,
  getFeedbacks,
  getRidesNearMe,
  acceptRide,
  pickupRider,
  startRide,
  payOnline,
  payOffline,
  getAllRidesForAdmin,
  getAllRidesForRider,
  getAllRidesForDriver,
  getSingleRideForRider,
  getDriversNearMe,
  rejectRide,
  cancelRideByRider,
  giveFeedback,
  arrived,
  getLatestAcceptedRideForDriver,
  getSingleRideForDriver,
  getRequestedRideForRider
};
