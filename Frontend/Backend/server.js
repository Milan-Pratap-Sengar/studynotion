const express=require("express")
const app=express()

require("dotenv").config()
const port=process.env.PORT || 5000;

const dbConnect=require("./config/db")
dbConnect();
const {cloudinaryConnect}=require("./config/cloudinary")
cloudinaryConnect()
const cookieParser=require("cookie-parser")
const cors=require("cors")
const fileUpload=require("express-fileupload")

app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true
    })
)
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp"
    })
)

const userRoute=require("./routes/user")
const profileRoute=require("./routes/profile")
const paymentRoute=require("./routes/payments")
const courseRoute=require("./routes/course")

app.use("/api/v1/auth",userRoute)
app.use("/api/v1/profile",profileRoute)
app.use("/api/v1/payment",paymentRoute)
app.use("/api/v1/course",courseRoute)




app.get('/',(req,res)=>{
    res.send("This is the HomePage for Edtech Website")
})

app.listen(port,()=>{
    console.log("App is running successfully")
})


