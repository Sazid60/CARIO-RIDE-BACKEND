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


export const driverControllers = {
    createDriver,

}