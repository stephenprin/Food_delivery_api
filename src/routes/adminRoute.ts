import express, {Request, Response, NextFunction} from "express"
import{ auth} from "../middleware/auth"
import { adminRegister, createVendor, SuperAdmin} from "../controller/adminController"

const router=express.Router()

router.post("/create-admin",auth, adminRegister)
router.post("/create-super-admin",SuperAdmin)
router.post("/create-vendors",auth, createVendor)



export default router;