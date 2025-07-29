import { Types } from "mongoose";

export enum VehicleType {
  CAR = "CAR",
  BIKE = "BIKE",
}

export enum DriverOnlineStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

export enum DriverRidingStatus {
  IDLE = "IDLE",
  ACCEPTED = "ACCEPTED",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
}

export enum DriverStatus {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  SUSPENDED = "SUSPENDED",
}

export interface IVehicle {
  vehicleNumber: string;
  vehicleType: VehicleType;
}
export interface ICurrentLocation 
  {
    type: "Point";
    coordinates: [number, number];
  }


export interface IDriver {
  userId: Types.ObjectId;
  vehicle: IVehicle;
  onlineStatus: DriverOnlineStatus;
  currentLocation?: ICurrentLocation;
  ridingStatus: DriverRidingStatus;
  totalEarning?: number;
  nid: string;
  driverStatus: DriverStatus;
}
