import express, { Request, Response, NextFunction, application } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv"
dotenv.config({path: '.config.env'})
import createHttpError from "http-errors";
import color from "color";
import {db} from "./config"
//IMPORTING ROUTE
import userRouter from "./routes/userRoute"
import indexRouter from "./routes/indexRoute"

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
app.use("/register", userRouter )


const PORT=process.env.PORT ||5000
app.listen(PORT, ()=>{
    console.log(`Server listening on http://localhoost:${PORT}`)
})


export default app;