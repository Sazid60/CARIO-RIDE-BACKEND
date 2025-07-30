import { Types } from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  RIDER = "RIDER",
  DRIVER = "DRIVER",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED"
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export enum RiderStatus {
  IDLE = "IDLE",
  REQUESTED = "REQUESTED",
  ON_RIDE = "ON_RIDE"
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  
  location?: {
    type: "Point";
    coordinates: [number, number]; 
  };

  isActive?: IsActive;
  isVerified?: boolean;
  role: Role;
  auths: IAuthProvider[];
  riderStatus  : RiderStatus,

  createdAt?: Date;
  updatedAt?: Date;
}
