import z from "zod";
import { DriverOnlineStatus, DriverRidingStatus, DriverStatus, VehicleType } from "./driver.interface";

export const createDriverZodSchema = z.object({
  userId: z.string({ required_error: "User ID is required" }).optional(),

  vehicle: z.object({
    vehicleNumber: z
      .string({ required_error: "Vehicle Number is required" }),
    vehicleType: z.enum(Object.values(VehicleType) as [string]),
  }),

  currentLocation: z
    .object({
      type: z.literal("Point"),
      coordinates: z
        .tuple([z.number(), z.number()])
        .refine((coords) => coords.length === 2, {
          message: "Coordinates must be [longitude, latitude]",
        }),
    })
    .optional(),

  totalEarning: z.number().min(0).optional(),

  nid: z
    .string().optional()

});


export const updateDriverZodSchema = z.object({
  userId: z.string().optional(),

  vehicle: z
    .object({
      vehicleNumber: z.string().min(4).optional(),
      vehicleType: z.enum(Object.values(VehicleType) as [string]).optional(),
    })
    .optional(),

  onlineStatus: z.enum(Object.values(DriverOnlineStatus) as [string]).optional(),

  ridingStatus: z.enum(Object.values(DriverRidingStatus) as [string]).optional(),

  currentLocation: z
    .object({
      type: z.literal("Point"),
      coordinates: z
        .tuple([z.number(), z.number()])
        .refine((coords) => coords.length === 2),
    })
    .optional(),

  totalEarning: z.number().min(0).optional(),

  nid: z.string().url({ message: "NID must be a valid URL" }).optional(),

  driverStatus: z.enum(Object.values(DriverStatus) as [string]).optional(),
})


export const updateDriverProfileZodSchema = z.object({
  name: z.string().optional(),
  vehicle: z
    .object({
      vehicleNumber: z.string().min(4).optional(),
      vehicleType: z.enum(Object.values(VehicleType) as [string]).optional(),
    })
    .optional(),
  nid: z.string().optional(),
});


export const updateDriverStatusZodSchema = z.object({
  driverStatus: z.enum(Object.values(DriverStatus) as [string], {
    required_error: "Driver status is required",
    invalid_type_error: "Invalid driver status value",
  }),
});
