import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDriverZodSchema, updateDriverStatusZodSchema } from "./driver.validation";
import { multerUpload } from "../../config/multer.config";
import { driverControllers } from "./driver.controller";


const router = Router()


router.post("/register",
    checkAuth(...Object.values(Role)),
    multerUpload.single("file"),
    validateRequest(createDriverZodSchema),
    driverControllers.createDriver
)
router.patch("/status/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(updateDriverStatusZodSchema),
    driverControllers.updateDriverStatus
)


export const DriverRoutes = router
