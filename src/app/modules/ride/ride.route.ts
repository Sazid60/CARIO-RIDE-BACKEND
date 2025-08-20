import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createRideZodSchema, rideFeedbackSchema } from "./ride.validation";
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

// GET ALL RIDES- Admin

router.get("/all-rides-admin",
  checkAuth(Role.ADMIN),
  rideController.getAllRidesForAdmin
)

// GET ALL MY RIDES - riders

router.get("/all-rides-rider",
  checkAuth(...Object.values(Role)),
  rideController.getAllRidesForRider
)

// GET ALL MY RIDES - driver

router.get("/all-rides-driver",
  checkAuth(Role.DRIVER),
  rideController.getAllRidesForDriver
)



// GET Rider Near Me - RIDER
router.get("/drivers-near",
  checkAuth(...Object.values(Role)),
  rideController.getDriversNearMe
)


// GET MY RIDE  - Rider
router.get("/my-ride/:id",
  checkAuth(...Object.values(Role)),
  rideController.getSingleRideForRider
)

// cancel ride - rider

router.patch("/cancel-ride/:id", checkAuth(...Object.values(Role)), rideController.cancelRideByRider)

// reject rides - rider

router.patch("/reject-ride/:id", checkAuth(Role.DRIVER), rideController.rejectRide)

// driver accept ride

router.patch("/accept-ride/:id", checkAuth(Role.DRIVER), rideController.acceptRide)


// Pickup the rider
router.patch("/pickup-rider/:id", checkAuth(Role.DRIVER), rideController.pickupRider)

// start the ride 
router.patch("/start-ride/:id", checkAuth(Role.DRIVER), rideController.startRide)

// arrived
router.patch("/arrived-destination/:id", checkAuth(Role.DRIVER), rideController.arrived)
// pay Online

router.patch("/pay-online/:id", checkAuth(Role.RIDER), rideController.payOnline)

// COMPLETE THE RIDE
router.patch("/pay-offline/:id", checkAuth(Role.DRIVER), rideController.payOffline)





// give feedback 

router.post(
  "/feedback/:rideId",
  checkAuth(...Object.values(Role)),
  validateRequest(rideFeedbackSchema),
  rideController.giveFeedback
);


export const RideRoutes = router
