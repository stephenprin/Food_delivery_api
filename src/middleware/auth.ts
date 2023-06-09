import{ Request, Response, NextFunction} from "express";

import jwt, { JwtPayload } from "jsonwebtoken"
import {APP_SECRET} from "../config"
import { UserAttribute, UserInstance } from "../models/userModel";
import { VendorAttribute, VendorInstance } from "../models/vendorModels";
export const auth=async(req:JwtPayload, res:Response, next:NextFunction)=>{
   try {
    // or req.cookies.jwt
    const authorization = req.headers.authorization as string
    if(!authorization){
        return res.status(401).json({
            status:"fail",
            message:"unauthorize request, kindly login"
        })
    }

    //Bearer errryyffgggkks
    const token=authorization.slice(7, authorization.length)
    let verified=jwt.verify(token, APP_SECRET)
    if(!verified){
        return res.status(401).json({
            Error: "unauthorize"
        })
    }
     
    const {id} =verified as  {[key:string]:string}
    
    const user = (await UserInstance.findOne({
        where: { id: id },
      })) as unknown as UserAttribute;

  if(!user){
    return res.status(401).json({
        Error:"Invalid credentials"
    })
  }
  req.user=verified

  next()
   } catch (error) {
     res.status(500).json({
        Error:"Unauthorizsed"
     })
   }
   
}


/**==========Vendor middlewarre================================= */

export const authVendor=async(req:JwtPayload, res:Response, next:NextFunction)=>{
    try {
     // or req.cookies.jwt
     const authorization = req.headers.authorization as string
     if(!authorization){
         return res.status(401).json({
             status:"fail",
             message:"unauthorize request, kindly login"
         })
     }
 
     //Bearer errryyffgggkks
     const token=authorization.slice(7, authorization.length)
     let verified=jwt.verify(token, APP_SECRET)
     if(!verified){
         return res.status(401).json({
             Error: "unauthorize"
         })
     }
      
     const {id} =verified as  {[key:string]:string}
     
     const vendor = (await VendorInstance.findOne({
         where: { id: id },
       })) as unknown as VendorAttribute;
 
   if(!vendor){
     return res.status(401).json({
         Error:"Invalid credentials"
     })
   }
   req.vendor=verified
 
   next()
    } catch (error) {
      res.status(500).json({
         Error:"Unauthorizsed"
      })
    }
    
 }