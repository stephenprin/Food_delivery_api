import express, { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { FoodAttribute, FoodInstance } from "../models/foodModel";
import { VendorAttribute, VendorInstance } from "../models/vendorModels";
import {
  GenerateSignature,
  loginSchema,
  option,
  updateVendorSchema,
  validatePassword,
} from "../utils/utility";

import { v4 as uuidV4 } from "uuid";

export const vendorLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const validateResult = loginSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    //check if the vendor exits
    const Vendor = (await VendorInstance.findOne({
      where: { email: email },
    })) as unknown as VendorAttribute;

    if (Vendor) {
      const validation = await validatePassword(
        password,
        Vendor.password,
        Vendor.salt
      );
      if (validation) {
        //Geneerate a new siignature for vendor
        let signature = await GenerateSignature({
          id: Vendor.id,
          email: Vendor.email,
          verified: Vendor.serviceAvailable,
        });
        return res.status(200).json({
          message: "You have suucessfully logged in",
          signature,
          email: Vendor.email,
          serviceAvailable: Vendor.serviceAvailable,
          role: Vendor.role,
        });
      }
    }
  
  } catch (error) {
    res.status(500).json({
      Error: "Internal server error",
      route: "/vendors/login",
    });
  }
};

/**==============VEENDOOR ADD FOOD========= */
export const createFood = async(req: JwtPayload, res: Response) => {
  try {
    const foodid = uuidV4();
    const id = req.vendor.id;
    const { name, description, category, foodTypes, readyTime, price, image } = req.body;
  
   //check if the vendor exits
    const Vendor = (await VendorInstance.findOne({
        where: { id: id },
    })) as unknown as VendorAttribute
    
      if (Vendor) {
          const createFood = await FoodInstance.create({
            id: foodid,
           name,
           description,
           category,
           foodTypes,
           readyTime,
            price,
            vendorId: id,
            image:req.file.path,
          });

          return res.status(201).json({
            message: "food added sucessfully",
            createFood,

          });
      }
    
      return res.status(400).json({
        message: "No food to add",
      });


    
  } catch (error) {
    console.log(error)
    res.status(500).json({
      Error: "Internal server error",
      route: "/vendors/get-profile",
    });
  }
};

/**==============GET VENDORR PROFILE========= */
export const vendorProfile=async(req:JwtPayload, res:Response)=>{
   try {
    const id=req.vendor.id

    //check if the vendor exits
    const Vendor = (await VendorInstance.findOne({
        where: { id: id },
        //attributes
         include:[
            {
                model:FoodInstance,
                as:"food",
            attributes:["id","name","description","category","foodTypes", "readyTime","rating","vendorId"]
           },
        ]
      })) as unknown as VendorAttribute

  res.status(200).json({
    Vendor
  })

   } catch (error) {
    console.log(error)
    res.status(500).json({
        Error: "Internal server error",
        route: "/vendors/get-profile",
      });
   }
}
/**==============VENDORR delete foood ========= */
export const deleteFood=async(req:JwtPayload, res:Response)=>{
   try {
    const id=req.vendor.id
    const foodid=req.params.foodid
      //check if the vendor exits
      const Vendor = (await VendorInstance.findOne({
        where: { id: id },
      })) as unknown as VendorAttribute
     
        //check if the vendor exits
        if(Vendor){
          
         const deleteFood=await FoodInstance.destroy({where:{id:foodid}})
              return res.status(200).json({
                message: "You have sucessfully deleted food",
                deleteFood
              })
             
        }
    

   } catch (error) {
    res.status(500).json({
        Error: "Internal server error",
        route: "/vendors/delete-food",
      });
   }
}


/**==================VENDOR UPDATE PROFILE============================= */

export const updateVendorProfile=async(req:JwtPayload, res:Response)=>{
  try {
    const id=req.vendor.id
    const { name, phone, address, coverImage } = req.body
    
      const validateResult = updateVendorSchema.validate(req.body, option);
      if (validateResult.error) {
        return res.status(400).json({
          Error: validateResult.error.details[0].message,
        });
      }
      //check if the user exits
      const Vendor = (await VendorInstance.findOne({
        where: { id: id },
      })) as unknown as VendorAttribute;
      
      if(!Vendor){
        return res.status(400).json({
          Error:"You are not authorize to update your profile"
        })
      }
    
      const updatedVendor = (await VendorInstance.update(
        {
          name,
          phone,
          address,
          coverImage:req.file.path,
      
        },
        { where: { id: id } }
      )) as unknown as VendorAttribute;
  
      if(updatedVendor){
        const Vendor = (await VendorInstance.findOne({
          where: { id: id },
        })) as unknown as VendorAttribute;
  
        return res.status(200).json({
          message:"You have succesfully updated your profile",
          Vendor
        })
      }
      return res.status(400).json({
        Error: "Error occured"
      })
  
  } catch (error) {
    return res.status(500).json({
      Error:"Internal server Error",
      route:"/vendors/update-profile"
    })
  }
}
  

/** =============================== Get Food By VendorID =============================== **/
export const getFoodByVendor = async(req:Request, res:Response) => {
  try {
      const id = req.params.id
      //check if vendor exist.....Below gives us all d user information
      const Vendor = await VendorInstance.findOne({where: {id:id},
      //attributes: ["","","",""]
      include:[
          {
              model: FoodInstance,
              as: 'food',          //from foodModel..... TableName
              attributes: ["id", 
              "name", 
              "description", "category", "foodType", "readyTime", "price", "image", "rating", "vendorId" ]   //Only these will be displayed
          }
      ]
      }) as unknown as VendorAttribute
      return res.status(200).json({
          Vendor
      })
  } catch (err) {
      res.status(500).json({
          Error: "Internal server Error",
          route: "/vendors/get-vendor-food",
      });
  }
  }