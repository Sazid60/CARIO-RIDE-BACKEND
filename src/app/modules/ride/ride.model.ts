// import { Schema, model } from "mongoose";
// import { IRide, IRideStatus } from "./ride.interface";

// const rideSchema = new Schema<IRide>(
//   {
//     riderId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     driverId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//     },
//     pickupLocation: {
//       type: {
//         type: String,
//         enum: ["Point"],
//         default: "Point",
//       },
//       coordinates: {
//         type: [Number],
//         required: true,
//       },
//     },
//     destination: {
//       type: {
//         type: String,
//         enum: ["Point"],
//         default: "Point",
//       },
//       coordinates: {
//         type: [Number],
//         required: true,
//       },
//     },
//     rideStatus: {
//       type: String,
//       enum: Object.values(IRideStatus),
//       default: IRideStatus.REQUESTED,
//     },
//     timestamps: {
//       requestedAt: {
//         type: Date,
//         default: Date.now,
//       },
//       acceptedAt: Date,
//       pickedUpAt: Date,
//       completedAt: Date,
//       cancelledAt: Date,
//     },
//     rejectedBy: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],
//   },
//   { timestamps: true }
// );

// export const Ride = model<IRide>("Ride", rideSchema);


import { Schema, model } from "mongoose";
import { IRide, IRideStatus } from "./ride.interface";

const rideSchema = new Schema<IRide>(
  {
    riderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    driverId: { type: Schema.Types.ObjectId, ref: "User" },
    pickupLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    destination: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    travelDistance: {
      type: Number, 
    },
    fare: {
      type: Number, 
    },
    rideStatus: {
      type: String,
      enum: Object.values(IRideStatus),
      default: IRideStatus.REQUESTED,
    },
    timestamps: {
      requestedAt: {
        type: Date,
        default: Date.now,
      },
      acceptedAt: Date,
      pickedUpAt: Date,
      completedAt: Date,
      cancelledAt: Date,
    },
    rejectedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export const Ride = model<IRide>("Ride", rideSchema);
