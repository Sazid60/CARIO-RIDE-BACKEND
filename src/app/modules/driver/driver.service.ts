import AppError from "../../errorHelpers/AppError";
import { DriverStatus, IDriver } from "./driver.interface";
import { Driver } from "./driver.model";
import httpStatus from 'http-status-codes';

const createDriver = async (payload: IDriver) => {
  
  const existingDriver = await Driver.findOne({ userId: payload.userId });

  if (existingDriver) {
    if (existingDriver.driverStatus === DriverStatus.PENDING) {
      throw new AppError(httpStatus.BAD_REQUEST, "Please wait for admin approval!");
    }
    if (existingDriver.driverStatus === DriverStatus.SUSPENDED) {
      throw new AppError(httpStatus.BAD_REQUEST, "You are suspended. Please contact the office!");
    }
    throw new AppError(httpStatus.BAD_REQUEST, "Driver profile already exists.");
  }

  const driver = await Driver.create(payload);
  return driver;
};

export const driverServices = {
  createDriver,
};
