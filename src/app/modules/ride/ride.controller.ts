// import { Request, Response } from "express";
// import { rideService } from "./ride.service";
// import { catchAsync } from "../../utils/catchAsync";
// import { sendResponse } from "../../utils/sendResponse";
// import httpStatus from "http-status-codes";
// import { JwtPayload } from "jsonwebtoken";
// import { User } from "../user/user.model";
// import { IsActive } from "../user/user.interface";
// import AppError from "../../errorHelpers/AppError";
// import { IRide, IRideStatus } from "./ride.interface";

// // const createRide = catchAsync(async (req: Request, res: Response) => {
// //   const user = req.user as JwtPayload;
// //   const userId = user.userId;

// //   const rider = await User.findById(userId)

// //   if(rider && rider.isActive === IsActive.BLOCKED){
// //     throw new AppError(httpStatus.BAD_REQUEST, "You Are Blocked Please Contact Office!")
// //   }


// //   const payload = {
// //     ...req.body,
// //     riderId: userId,
// //     rideStatus: "REQUESTED",
// //     timestamps: {
// //       requestedAt: new Date()
// //     }
// //   };

// //   const result = await rideService.createRide(payload);

// //   sendResponse(res, {
// //     success: true,
// //     statusCode: httpStatus.CREATED,
// //     message: "Ride requested successfully",
// //     data: result.data,
// //   });
// // });

// const createRide = catchAsync(async (req: Request, res: Response) => {
//   const user = req.user as JwtPayload;
//   const userId = user.userId;

//   const rider = await User.findById(userId);
//   if (rider?.isActive === IsActive.BLOCKED) {
//     throw new AppError(httpStatus.BAD_REQUEST, "You Are Blocked. Contact Admin.");
//   }

//   const payload = {
//     ...req.body,
//     riderId: userId,
//     rideStatus: IRideStatus.REQUESTED,
//     timestamps: { requestedAt: new Date() },
//   } as IRide;

//   const result = await rideService.createRide(payload);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.CREATED,
//     message: "Ride requested successfully",
//     data: result.data,
//   });
// });

// export const rideController = {
//   createRide,
// };


import { Request, Response } from "express";
import { rideService } from "./ride.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";
import { IsActive } from "../user/user.interface";
import AppError from "../../errorHelpers/AppError";
import { IRideStatus } from "./ride.interface";

const createRide = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const userId = user.userId;

  const rider = await User.findById(userId);


  if (rider && rider?.isActive === IsActive.BLOCKED) {
    throw new AppError(httpStatus.BAD_REQUEST, "You Are Blocked. Contact Admin.");
  }

  const payload = {
    ...req.body,
    riderId: userId,
    rideStatus: IRideStatus.REQUESTED,
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

export const rideController = {
  createRide,
};
