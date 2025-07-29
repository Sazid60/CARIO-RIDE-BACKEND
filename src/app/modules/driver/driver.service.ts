import AppError from "../../errorHelpers/AppError";
import { DriverStatus, IDriver } from "./driver.interface";
import { Driver } from "./driver.model";
import httpStatus from 'http-status-codes';
import { User } from "../user/user.model"; // adjust path if needed

const createDriver = async (payload: IDriver) => {
  const user = await User.findById(payload.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  if (user.isActive === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "Your account is blocked. Contact support.");
  }

  if (!user.phone) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please update your phone number before applying.");
  }

  if (!user.location || !user.location.coordinates || user.location.coordinates.length !== 2) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please update your current location before applying.");
  }

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

const updateDriverStatus = async (id: string, driverStatus: DriverStatus) => {
  const driver = await Driver.findById(id);

  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
  }
  
  if (driver.driverStatus === DriverStatus.APPROVED) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver is already approved");
  }

  if (driver.driverStatus === DriverStatus.SUSPENDED) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver is suspended");
  }


  driver.driverStatus = driverStatus;
  await driver.save();

  return driver;
};

export const driverServices = {
  createDriver,
  updateDriverStatus
};
