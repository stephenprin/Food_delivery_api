
import {accountSid,authToken,fromAdminPhone,GMAIL_USER,  GMAIL_PASS, fromAdminMail, userSubject} from "../config"
import nodemailer from 'nodemailer';
export const GenerateOtp=()=>{
   const otp= Math.floor(1000 +  Math.random() * 9000)
   const expiry= new Date()

   expiry.setTime(new Date().getTime()+ (20 *60 *1000))
   return  {otp, expiry}
}

export const onRequestOTP= async(otp:number, toPhoneNumber:string)=>{
    const client = require('twilio')(accountSid, authToken); 
    
    const response= await client.messages.create({
        body:`Your Otp is ${otp} and will expire in 20minute times`,
        from: fromAdminPhone,
        to: toPhoneNumber
    })
    return response 
}

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});
// export const sendEmail = () => {
// }
export const sendMail = async (
    from: string,
    to: string,
    subject: string,
    html: string
) => {
   try {
       const response = await transport.sendMail({
            from: fromAdminMail, to:GMAIL_USER, subject: userSubject, html
        })
        return response
   } catch(err) {
       console.log(err)
   }
};
export const emailHtml = (otp:number):string => {
    let temp = `
    <div style="max-width:700px; margin:auto; border:10px solid #ddd; padding:50px 20px; font-size:110%">
    <h2 style="text-align:center; text-transform:uppercase; color:teal">Welcome to Prince Pizza </h2>
    <p> Hi there, your otp is ${otp}, it will expire iin 20minutes</p>
    </div>
    `
    return temp
}