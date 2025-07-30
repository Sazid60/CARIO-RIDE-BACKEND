import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createRideZodSchema } from "./ride.validation";
import { rideController } from "./ride.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";



const router = Router()

// create a ride request - > user 

router.post(
  "/request",
  checkAuth(...Object.values(Role)),
  validateRequest(createRideZodSchema),
  rideController.createRide
);

// get all the available rides in driver coordinates 
router.get("/rides-near", 
  checkAuth(Role.DRIVER),
  rideController.getRidesNearMe
)

// driver accept ride

// driver reject ride 

// 




export const RideRoutes = router
