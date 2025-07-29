import { z } from "zod";

export const createRideZodSchema = z.object({
    pickupLocation: z.object({
      type: z.literal("Point"),
      coordinates: z
        .tuple([z.number(), z.number()])
        .refine(val => val.length === 2, {
          message: "Coordinates must have [longitude, latitude]",
        }),
    }),
    destination: z.object({
      type: z.literal("Point"),
      coordinates: z
        .tuple([z.number(), z.number()])
        .refine(val => val.length === 2, {
          message: "Coordinates must have [longitude, latitude]",
        }),
    }),
});
