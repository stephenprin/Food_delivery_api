import express, { Request, Response, NextFunction, application } from "express";

const router=express.Router();

router.get("/",(req:Request,res:Response)=>{
   res.status(200).send("<h3>Welcome to view documentation</h3>")
})

export default router