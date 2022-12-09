import express, {Request, Response, NextFunction} from "express"
import { adminRegister } from "../controller/adminController";
import {Register, VerifyUser, Login, resendOTP, getAllUser, getSingleUser, updateUserProfile} from "../controller/userController";
import {auth} from "../middleware/auth"


const router=express.Router()



router.post("/register", Register)
router.post("/verify/:signature", VerifyUser)
router.post("/login", Login)

router.get("/resend-otp/:signature", resendOTP)
router.get("/get-all-users", auth, getAllUser)
router.get("/get-single-user", auth, getSingleUser)

router.patch("/update-profile",auth, updateUserProfile)



export default router;