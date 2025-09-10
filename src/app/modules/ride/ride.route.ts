import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createRideZodSchema, rideFeedbackSchema } from "./ride.validation";
import { rideController } from "./ride.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";



const router = Router()


router.post(
  "/request",
  checkAuth(...Object.values(Role)),
  validateRequest(createRideZodSchema),
  rideController.createRide
);

router.get("/rides-near",
  checkAuth(Role.DRIVER),
  rideController.getRidesNearMe
)


router.get("/all-rides-admin",
  checkAuth(Role.ADMIN),
  rideController.getAllRidesForAdmin
)

router.get("/all-feedbacks",
  rideController.getFeedbacks
)


router.get("/all-rides-rider",
  checkAuth(Role.RIDER),
  rideController.getAllRidesForRider
)
router.get("/rider-latest-ride",
  checkAuth(Role.RIDER),
  rideController.getRequestedRideForRider
)

router.get("/all-rides-driver",
  checkAuth(Role.DRIVER),
  rideController.getAllRidesForDriver
)



router.get("/drivers-near",
  checkAuth(...Object.values(Role)),
  rideController.getDriversNearMe
)


router.get("/my-accepted-ride",
  checkAuth(Role.DRIVER),
  rideController.getLatestAcceptedRideForDriver
)





router.get("/my-ride/:id",
  checkAuth(Role.RIDER),
  rideController.getSingleRideForRider
)
router.get("/my-accepted-ride/:id",
  checkAuth(Role.DRIVER),
  rideController.getSingleRideForDriver
)
router.get("/single-ride/:id",
  checkAuth(Role.ADMIN),
  rideController.getSingleRideForAdmin
)


router.patch("/cancel-ride/:id", checkAuth(...Object.values(Role)), rideController.cancelRideByRider)



router.patch("/reject-ride/:id", checkAuth(Role.DRIVER), rideController.rejectRide)



router.patch("/accept-ride/:id", checkAuth(Role.DRIVER), rideController.acceptRide)



router.patch("/ride-location-update/:id", checkAuth(Role.DRIVER, Role.RIDER), rideController.updateRideLocation)


router.patch("/pickup-rider/:id", checkAuth(Role.DRIVER), rideController.pickupRider)


router.patch("/start-ride/:id", checkAuth(Role.DRIVER), rideController.startRide)


router.patch("/arrived-destination/:id", checkAuth(Role.DRIVER), rideController.arrived)


router.patch("/pay-online/:id", checkAuth(Role.RIDER), rideController.payOnline)


router.patch("/pay-offline/:id", checkAuth(Role.DRIVER), rideController.payOffline)






router.patch(
  "/feedback/:rideId",
  checkAuth(...Object.values(Role)),
  validateRequest(rideFeedbackSchema),
  rideController.giveFeedback
);


export const RideRoutes = router
