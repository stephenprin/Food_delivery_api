import express, { Request, Response, NextFunction} from "express";
import {
  registerSchema,
  option,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  verifySignature,
  loginSchema,
  validatePassword,
  updateSchema,
} from "../utils/utility";
import {
  GenerateOtp,
  onRequestOTP,
  emailHtml,
  sendMail,
} from "../utils/notification";
import { UserInstance, UserAttribute } from "../models/userModel";
import { v4 as uuidv4 } from "uuid";
import { fromAdminMail, userSubject } from "../config";
import { JwtPayload } from "jsonwebtoken";


export const Register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, phone, password, confirm_password } = req.body;
    const iduuid = uuidv4();
    //console.log(iduuid)
    const validateResult = registerSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

    //generate salt
    const salt = await GenerateSalt();

    const userPassword = await GeneratePassword(password, salt);

    //Generate otp and expiry
    const { otp, expiry } = GenerateOtp();

    //check if user exit
    const User = await UserInstance.findOne({ where: { email: email } });
    if (!User) {
      //creeate a user
      await UserInstance.create({
        id: iduuid,
        email,
        password: userPassword,
        firstName: "",
        lastName: "",
        salt,
        address: "",
        phone,
        otp,
        otp_expiry: expiry,
        lng: 0,
        lat: 0,
        verified: false,
        role:""
      });
      //send OTP to user
      await onRequestOTP(otp, phone);

      // send email
      const html = emailHtml(otp);
      await sendMail(fromAdminMail, email, userSubject, html);
      // check if user is created
      const User = (await UserInstance.findOne({
        where: { email: email },
      })) as unknown as UserAttribute;
      // //Generate Signature
      let signature = await GenerateSignature({
        id: User.id,
        email: User.email,
        verified: User.verified,
      });

      return res.status(201).json({
        message: "user created sucessfully",
        signature,
        verified: User.verified,
      });
    }
    return res.status(401).json({
      Error: "User already created",
    });
  } catch (error) {
    console.log(error),
    res.status(500).json({
    
      Error: "Internal server error",
      route: "/user/register",
    });
  }
};

/**==================Verify user============================= */
export const VerifyUser = async (req: Request, res: Response) => {
  try {
    const token = req.params.signature;
    const decode = await verifySignature(token);

    //check if the user is a registereed user

    const User = (await UserInstance.findOne({
      where: { email: decode.email },
    })) as unknown as UserAttribute;

    if (User) {
      const { otp } = req.body;
      if (User.otp === parseInt(otp) && User.otp_expiry >= new Date()) {
        const updatedUser = (await UserInstance.update(
          {
            verified: true,
          },
          { where: { email: decode.email } }
        )) as unknown as UserAttribute;

        //ReGeneerate a new siignature
        let signature = await GenerateSignature({
          id: updatedUser.id,
          email: updatedUser.email,
          verified: updatedUser.verified,
        });

        return res.status(200).json({
          message: "You have suucessfully verified your account",
          signature,
          verified: User.verified,
        });
      }
    }
    return res.status(400).json({
      Error: "Token already expire",
    });


  } catch (err) {
    console.log(err);
    res.status(500).json({
      Error: "Internal server Error",
      route: "/users/verify",
    });
  }
};
/**==================login user============================= */
export const Login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const validateResult = loginSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    //check if the user exits
    const User = (await UserInstance.findOne({
      where: { email: email },
    })) as unknown as UserAttribute;
    if (User.verified===true) {
      const validation = await validatePassword(
        password,
        User.password,
        User.salt
      );
      if (validation) {
        //Geneerate a new siignature
        let signature = await GenerateSignature({
          id: User.id,
          email: User.email,
          verified: User.verified,
        });
        return res.status(200).json({
          message: "You have suucessfully logged in",
          signature,
          email: User.email,
          verified: User.verified,
          role:User.role
        });
      }
    }
    res.status(400).json({
      Error: "Wrong username or password oor not a verfied user",
    });
  } catch (error) {
    res.status(500).json({
      Error: "Internal server error",
      route: "/user/login",
    });
  }
};

/**==================Resend otp============================= */
export const resendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.body.signature;
    const decode = await verifySignature(token);
    const User = (await UserInstance.findOne({
      where: { email: decode.email },
    })) as unknown as UserAttribute;

    if (User) {
      //Generate otp and expiry
      const { otp, expiry } = GenerateOtp();
      const updatedUser = (await UserInstance.update(
        {
          otp,
          otp_expiry: expiry,
        },
        { where: { email: decode.email } }
      )) as unknown as UserAttribute;

      if (updatedUser) {
        //send OTP to user
        await onRequestOTP(otp, updatedUser.phone);
        // send email
        const html = emailHtml(otp);
        await sendMail(fromAdminMail, updatedUser.email, userSubject, html);

        return res.status(200).json({
          message: "OTP resend tp phoone number and email",
        });
      }
    }
      return res.status(400).json({
        Error: "Error sending OTP"
      })
  } catch (error) {
    res.status(500).json({
      Error: "Internal server error",
      route: "/user/resend-otp/:signature",
    });
  }
};

/**==================USER ALLPROOFILE============================= */
export const getAllUser=async(req:Request, res:Response)=>{
   try {
    const limit=req.query.limit as number | undefined
    const users=await UserInstance.findAndCountAll({
      limit:limit
    })
    return res.status(200).json({
      message:"You have successfully retrieved all users",
      Count:users.count,
      Users:users.rows
    })
   } catch (error) {
      res.status(500).json({
        Error:"Internal server Error",
        route:"/user/get-all-users"
      })
   }
}



/**==================SINGLE USER PROFILE============================= */
export const getSingleUser=async(req:JwtPayload, res:Response, next:NextFunction)=>{
  try {
    const id=req.user.id

    //find user by id
    const User = (await UserInstance.findOne({
      where: { id: id },
    })) as unknown as UserAttribute;
  
    if(User){
      return res.status(200).json({
        message:"You have successfully retrieved one user",
        User:User
      })
    }
  } catch (error) {
     res.status(500).json({
       Error:"Internal server Error",
       route:"/user/get-single-user"
     })
  }
}


/**==================UPDATE PROFILE============================= */

export const updateUserProfile=async(req:JwtPayload, res:Response)=>{
try {
  const id=req.user.id
  const {firstName,
    lastName,address,password,phone}=req.body
    const validateResult = updateSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    //check if the user exits
    const User = (await UserInstance.findOne({
      where: { id: id },
    })) as unknown as UserAttribute;
    
    if(!User){
      return res.status(400).json({
        Error:"You are not authorize to update your profile"
      })
    }
    const updatedUser = (await UserInstance.update(
      {
        firstName,
        lastName,
        address,
        password,
        phone
      },
      { where: { id: id } }
    )) as unknown as UserAttribute;

    if(updatedUser){
      const User = (await UserInstance.findOne({
        where: { id: id },
      })) as unknown as UserAttribute;

      return res.status(200).json({
        message:"You have succesfully updated your profile",
        User
      })
    }
    return res.status(400).json({
      Error: "Error occured"
    })

} catch (error) {
  return res.status(500).json({
    Error:"Internal server Error",
    route:"/users/update-profile"
  })
}
}

/**==================FORGOT PASSWORD============================= */