import express from 'express'
import dotenv from 'dotenv'

dotenv.config()
const app = express();



app.get("/",(req, res)=>{
    res.send("hello world")
})








const VERIFY_TOKEN = process.env.ACCESS_TOKEN || "verify_instabot_42";
const APP_SECRET = process.env.APP_SECRET || "your_app_secret_here"; // used for signature check





 app.listen(8080,()=>{

console.log("server running")

})
