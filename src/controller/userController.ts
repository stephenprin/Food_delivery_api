import express, { Request, Response, NextFunction, application } from "express";


export const Register=(req:Request,res:Response,next:NextFunction)=>{
    try {
       return res.status(200).json({
            message: 'Hello Express'
          })
    } catch (error) {
        res.status(400).json({message: error})
    }
}


