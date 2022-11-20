import express, {Request, Response, NextFunction} from "express"
import{ auth} from "../middleware/auth"
import { adminRegister, SuperAdmin} from "../controller/adminController"

const router=express.Router()

router.post("/create-admin",auth, adminRegister)
router.post("/create-super-admin",SuperAdmin)



export default router;