import  {Sequelize} from "sequelize"
import dotenv from "dotenv"
dotenv.config()

export const db= new Sequelize('app','','', {
    storage: "./foodDB.sqlite",
    dialect:"sqlite",
    logging:false

})



export const accountSid=process.env.ACOUNTSID
export const authToken=process.env.AUTHTOKEN
export const fromAdminPhone=process.env.FROMADMINPHONE

export const fromAdminMail=process.env.fromAdminMail as string
export const GMAIL_USER=process.env.GMAIL_USER
export const GMAIL_PASS=process.env.GMAIL_PASS
export const userSubject=process.env.userSubject!
export const APP_SECRET = process.env.APP_SECRET as string



export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
