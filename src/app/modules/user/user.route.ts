
import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { userControllers } from "./user.controller";

import { createUserZodSchema, updateOwnProfileUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { multerUpload } from "../../config/multer.config";



const router = Router()



router.get("/all-users", checkAuth(Role.ADMIN), userControllers.getAllUsers)

router.get("/me", checkAuth(...Object.values(Role)), userControllers.getMe)

router.post("/register", multerUpload.single("file"), validateRequest(createUserZodSchema), userControllers.createUser)


router.patch("/:id", validateRequest(updateOwnProfileUserZodSchema), checkAuth(...Object.values(Role)), userControllers.updateUser)

router.patch("/:id", multerUpload.single("file"), validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), userControllers.updateUser)

router.get("/:id",checkAuth(Role.ADMIN), userControllers.getSingleUser)

export const UserRoutes = router