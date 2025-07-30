
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

export const rideController = {
  createRide,
  getRidesNearMe
};
