import { Document, Types } from "mongoose";

export interface ILocation {
    type: "Point";
    coordinates: [number, number];
}

export enum RideStatus {
    REQUESTED = "REQUESTED",
    ACCEPTED = "ACCEPTED",
    PICKED_UP = "PICKED_UP",
    IN_TRANSIT = "IN_TRANSIT",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export interface IRide extends Document {
  riderId: Types.ObjectId;
  driverId?: Types.ObjectId;
  pickupLocation: ILocation;
  destination: ILocation;
  travelDistance?: number; 
  fare?: number; 
  rideStatus: RideStatus;
  timestamps: {
    requestedAt: Date;
    acceptedAt?: Date;
    pickedUpAt?: Date;
    startedAt? : Date;
    completedAt?: Date;
    cancelledAt?: Date;
  };
  rejectedBy?: Types.ObjectId[];
}
