import express, { Request, Response, NextFunction, application } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv"
dotenv.config()
import createHttpError from "http-errors";
import color from "color";
import {db} from "./config"
//IMPORTING ROUTE
import userRouter from "./routes/userRoute"
import indexRouter from "./routes/indexRoute"
// import userVerify from "./routes/userRoute"
// import loginRoute from "./routes/userRoute"
// import resendOTP from "./routes/userRoute"
// import getAllUseer from "./routes/userRoute";
// import getSingleUser from "./routes/userRoute"
// import updsteProfile from "./routes/userRoute"


//Admin rroute

import adminRoute from "./routes/adminRoute"

const app=express()
//sequelize connection
db.sync().then(()=>{
    console.log("DB connected succesfully")
}).catch(err=>{
    console.log(err)
})



app.use(express.json())

if(process.env.NODE_ENV==="developmet"){
    app.use(logger("dev"))
}

app.use(cookieParser())






app.use(indexRouter);
app.use("/user", userRouter )
// app.use("/user", userVerify )
// app.use("/user",loginRoute)
// app.use("/user", resendOTP)
// app.use("/user", getAllUseer)
// app.use("/user", getSingleUser)
// app.use("/user",updsteProfile)

app.use("/admin", adminRoute)


const PORT=process.env.PORT ||5000
app.listen(PORT, ()=>{
    console.log(`Server listening on http://localhoost:${PORT}`)
})


export default app;