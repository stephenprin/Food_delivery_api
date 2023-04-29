import express, {Request, Response, NextFunction} from "express"
import{ auth, authVendor} from "../middleware/auth"
import { adminRegister, SuperAdmin} from "../controller/adminController"
import { createFood, deleteFood, getFoodByVendor,  updateVendorProfile, vendorLogin, vendorProfile, } from "../controller/vendorController"
import { upload } from "../utils/multer"

const router=express.Router()

router.post("/login", vendorLogin)
router.post("/create-food",authVendor,upload.single("image"), createFood)
router.get("/get-profile",authVendor,vendorProfile)
router.delete("/delete-food/food-id", authVendor, deleteFood)
router.patch("/update-profile", authVendor, upload.single("coverImage"), updateVendorProfile)
router.get("/get-vendor-food/id", getFoodByVendor)




export default router;