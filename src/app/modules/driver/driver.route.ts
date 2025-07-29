import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDriverZodSchema } from "./driver.validation";
import { multerUpload } from "../../config/multer.config";
import { driverControllers } from "./driver.controller";


const router = Router()


router.post("/register",
    checkAuth(...Object.values(Role)),
    multerUpload.single("file"),
    validateRequest(createDriverZodSchema),
    driverControllers.createDriver
)


export const DriverRoutes = router
