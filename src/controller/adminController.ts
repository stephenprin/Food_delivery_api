import { NextFunction, Request, Response } from "express"
import jwt, {JwtPayload} from "jsonwebtoken"
import {UserAttribute,UserInstance} from "../models/userModel"
import {v4 as uuidv4} from "uuid"

import { adminSchema, GeneratePassword, GenerateSalt, GenerateSignature, option } from "../utils/utility"
import { emailHtml, GenerateOtp } from "../utils/notification"
import { fromAdminMail, userSubject } from "../config"

/**==================ADMIN REGISTER============================= */
export const adminRegister = async (
    req: JwtPayload,
    res: Response,
    next: NextFunction
  ) => {
     const id=req.user.id
    try {
      const { email, phone, password,firstName,lastName,address } = req.body;
      const iduuid = uuidv4();
      //console.log(iduuid)
      const validateResult = adminSchema.validate(req.body, option);
      if (validateResult.error) {
        return res.status(400).json({
          Error: validateResult.error.details[0].message,
        });
      }
  
      //generate salt
      const salt = await GenerateSalt();
  
      const adminPassword = await GeneratePassword(password, salt);
  
      //Generate otp and expirys
      const { otp, expiry } = GenerateOtp();
  
      //check if admin exit
      const Admin = await UserInstance.findOne({ where: { id: id } }) as unknown as UserAttribute;

      if(Admin.email===email){
            return res.status(400).json({
                message:"Email already exit"
            })
      }
      if(Admin.phone===phone){
        return res.status(400).json({
            message:"Phone already exit"
        })
  }
      if (Admin.role === 'superadmin') {
        //creeate a admin
        await UserInstance.create({
          id: iduuid,
          email,
          password: adminPassword,
          firstName,
          lastName,
          salt,
          address,
          phone,
          otp,
          otp_expiry: expiry,
          lng: 0,
          lat: 0,
          verified: true,
          role:"admin"
        });
       
  
       
        // check if admin is created
        const Admin = (await UserInstance.findOne({
          where: { id: id },
        })) as unknown as UserAttribute;
        // //Generate Signature
        let signature = await GenerateSignature({
          id: Admin.id,
          email: Admin.email,
          verified: Admin.verified,
        });
  
        return res.status(201).json({
          message: "admin created sucessfully",
          signature,
          verified: Admin.verified,
        });
      }
      return res.status(401).json({
        message: "Admin already created",
      });
    } catch (error) {
      return res.status(500).json({
        Error: "Internal server error",
        route: "/admin/create-admin",
      });
    }
  };


/** ================= Super Admin ===================== **/
export const SuperAdmin = async (req: JwtPayload, res: Response) => {
    try {
      const { email, phone, password, firstName, lastName, address } = req.body;
      const uuiduser = uuidv4();
  
      const validateResult = adminSchema.validate(req.body, option);
      if (validateResult.error) {
        return res.status(400).json({
          Error: validateResult.error.details[0].message,
        });
      }
  
      // Generate salt
      const salt = await GenerateSalt();
      const adminPassword = await GeneratePassword(password, salt);
  
      // Generate OTP
      const { otp, expiry } = GenerateOtp();
  
      // check if the admin exist
      const Admin = (await UserInstance.findOne({
        where: { email: email},
      })) as unknown as UserAttribute;

  
      //Create Admin
      if (!Admin) {
        await UserInstance.create({
          id: uuiduser,
          email,
          password: adminPassword,
          firstName,
          lastName,
          salt,
          address,
          phone,
          otp,
          otp_expiry: expiry,
          lng: 0,
          lat: 0,
          verified: true,
          role: "superadmin",
        });
  
        // check if the admin exist
        const Admin = (await UserInstance.findOne({
          where: { email: email},
        })) as unknown as UserAttribute;
  
        //Generate signature for user
        let signature = await GenerateSignature({
          id: Admin.id,
          email: Admin.email,
          verified: Admin.verified,
        });
  
        return res.status(201).json({
          message: "Admin created successfully",
          signature,
          verified: Admin.verified,
        });
      }
      return res.status(400).json({
        message: "Admin already exist",
      });
    } catch (err) {
      res.status(500).json({
        Error: "Internal server Error",
        route: "/admins/create-admin",
      });
    }
  };
  


