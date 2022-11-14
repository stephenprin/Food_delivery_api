import express, {Request, Response, NextFunction} from "express"
import {Register} from "../controller/userController";

const router=express.Router()



router.get("/users", Register)


export default router;