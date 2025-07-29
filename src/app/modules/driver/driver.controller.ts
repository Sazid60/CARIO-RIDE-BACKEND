/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status-codes"


import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { IDriver } from "./driver.interface";
import { driverServices } from "./driver.service";
import { JwtPayload } from "jsonwebtoken";


const createDriver = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload
    const userId = user.userId

    const payload: IDriver = {
        ...req.body,
        userId,
        nid: req.file?.path
    }
    const driver = await driverServices.createDriver(payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Driver Created Successfully",
        data: driver
    })
})

const updateDriverStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { driverStatus } = req.body;

  const result = await driverServices.updateDriverStatus(id, driverStatus);

  res.status(httpStatus.OK).json({
    success: true,
    message: `Driver status updated to ${driverStatus}`,
    data: result,
  });
});


export const driverControllers = {
    createDriver,
    updateDriverStatus

}